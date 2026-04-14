import { supabase } from './supabaseClient';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts a blob: URL (in-memory) into an uploadable File object.
 */
async function blobUrlToFile(blobUrl, filename) {
  const response = await fetch(blobUrl);
  const blob     = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Uploads a single asset to salon-assets storage.
 * Returns the permanent public URL, or null on failure.
 */
async function uploadAsset(blobUrl, filename, folder) {
  if (!blobUrl || !blobUrl.startsWith('blob:')) return blobUrl || null;

  try {
    const file = await blobUrlToFile(blobUrl, filename);
    const path = `${folder}/${Date.now()}-${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('salon-assets')
      .upload(path, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('salon-assets')
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (err) {
    console.warn(`Asset upload failed for "${filename}":`, err.message);
    return null;
  }
}

/**
 * Derives a URL-safe subdomain prefix from a business name.
 * e.g. "Glow by Carrie" → "glow-by-carrie"
 */
function toSubdomainPrefix(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || `salon-${Date.now()}`;
}

// ── Main submit function ───────────────────────────────────────────────────────

/**
 * Sequence Save:
 *   1. Upload all brand/staff assets
 *   2. INSERT into clients → get client_id
 *   3. Upsert businesses row (linked to biz_id)
 *   4. Replace staff rows  (tagged with biz_id + client_id)
 *   5. Replace services    (tagged with biz_id + client_id)
 *
 * @param {object}   data           The full React state data object from App.jsx
 * @param {function} onProgress     Called with a status string as work progresses
 * @param {boolean}  publishAction  If true (admin only), sets is_published: true
 * @returns {{ bizId: string, clientId: string }}
 */
export async function submitBrief(data, onProgress = () => {}, publishAction = false) {
  const bizId = data.bizId || `biz-${Date.now()}`;

  // ── 1. Upload brand assets ─────────────────────────────────────────────────
  onProgress('Uploading logo…');
  const logoUrl = data.logo
    ? await uploadAsset(data.logo, data.logoName || 'logo.png', `${bizId}/brand`)
    : null;

  onProgress('Uploading hero image…');
  const heroImageUrl = data.heroImage
    ? await uploadAsset(data.heroImage, data.heroImageName || 'hero.jpg', `${bizId}/brand`)
    : null;

  onProgress('Uploading brand photos…');
  const brandPhotosUploaded = await Promise.all(
    (data.brandPhotos || []).map(async (photo) => {
      const url = await uploadAsset(photo.url, photo.name, `${bizId}/brand-photos`);
      return { id: photo.id, category: photo.category, name: photo.name, url };
    })
  );

  onProgress('Uploading staff photos…');
  const staffWithPhotos = await Promise.all(
    (data.staff || []).map(async (member) => {
      const photoUrl = member.photo
        ? await uploadAsset(member.photo, member.photoName || 'staff-photo.jpg', `${bizId}/staff`)
        : null;
      return { ...member, uploadedPhotoUrl: photoUrl };
    })
  );

  // ── 2. CREATE client record — first action in the sequence ─────────────────
  onProgress('Creating salon client record…');
  const subdomainPrefix = toSubdomainPrefix(data.businessName);

  const { data: clientRow, error: clientError } = await supabase
    .from('clients')
    .insert({
      name:             data.businessName    || 'Unnamed Salon',
      logo_url:         logoUrl,
      brand_colors:     data.brandColors     || null,
      subdomain_prefix: subdomainPrefix,
    })
    .select('id')
    .single();

  if (clientError) throw new Error(`clients: ${clientError.message}`);
  const clientId = clientRow.id;

  // ── 3. Upsert businesses row ───────────────────────────────────────────────
  onProgress('Saving business profile…');
  const { error: bizError } = await supabase
    .from('businesses')
    .upsert(
      {
        biz_id:            bizId,
        business_name:     data.businessName   || null,
        business_type:     data.businessType   || null,
        address:           data.address        || null,
        phone:             data.phone          || null,
        rating:            data.rating         ?? null,
        hero_text:         data.heroText       || null,
        tagline:           data.tagline        || null,
        logo_url:          logoUrl,
        hero_image_url:    heroImageUrl,
        brand_photos:      brandPhotosUploaded,
        hiring_info:       data.hiring         || null,
        social_links:      data.socialLinks    || null,
        accepted_payments: data.paymentMethods || null,
        brand_colors:      data.brandColors    || null,
        custom_design:     data.customDesign   || null,
        business_hours:    data.businessHours  || null,
        status:            publishAction ? 'published' : 'pending',
        is_published:      publishAction,
        client_id:         clientId,
      },
      { onConflict: 'biz_id' }
    );

  if (bizError) throw new Error(`businesses: ${bizError.message}`);

  // ── 4. Replace staff rows — tagged with client_id ──────────────────────────
  onProgress('Saving team members…');
  await supabase.from('staff').delete().eq('biz_id', bizId);

  if (staffWithPhotos.length > 0) {
    const { error: staffError } = await supabase
      .from('staff')
      .insert(
        staffWithPhotos.map((m) => ({
          biz_id:           bizId,
          client_id:        clientId,
          name:             m.name              || null,
          role_type:        m.title             || null,
          bio:              m.bio               || null,
          instagram:        m.instagram         || null,
          contact_email:    m.contactEmail      || null,
          contact_phone:    m.contactPhone      || null,
          booking_style:    m.bookingStyle      || 'digital',
          booking_link:     m.bookingLink       || null,
          portfolio_access: m.portfolioAccess   || false,
          photo_url:        m.uploadedPhotoUrl  || null,
        }))
      );
    if (staffError) throw new Error(`staff: ${staffError.message}`);
  }

  // ── 5. Replace services rows — tagged with client_id ──────────────────────
  onProgress('Saving services…');
  await supabase.from('services_offered').delete().eq('biz_id', bizId);

  if ((data.selectedServices || []).length > 0) {
    const { error: svcError } = await supabase
      .from('services_offered')
      .insert(
        (data.selectedServices || []).map((s) => ({
          biz_id:    bizId,
          client_id: clientId,
          name:      s.name     || null,
          category:  s.category || null,
          duration:  s.duration ?? null,
          buffer:    s.buffer   ?? null,
          custom:    s.custom   || false,
        }))
      );
    if (svcError) throw new Error(`services_offered: ${svcError.message}`);
  }

  return { bizId, clientId };
}
