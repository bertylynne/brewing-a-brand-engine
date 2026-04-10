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

// ── Main submit function ───────────────────────────────────────────────────────

/**
 * Uploads all assets, then inserts/upserts into:
 *   businesses, staff, services_offered
 *
 * @param {object} data  The full React state data object from App.jsx
 * @param {function} onProgress  Called with a status string as work progresses
 * @returns {{ bizId: string }}
 */
export async function submitBrief(data, onProgress = () => {}) {
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

  // ── 2. Upsert businesses row ───────────────────────────────────────────────
  onProgress('Saving business profile…');
  const { error: bizError } = await supabase
    .from('businesses')
    .upsert(
      {
        biz_id:          bizId,
        business_name:   data.businessName   || null,
        business_type:   data.businessType   || null,
        address:         data.address        || null,
        phone:           data.phone          || null,
        rating:          data.rating         ?? null,
        hero_text:       data.heroText       || null,
        tagline:         data.tagline        || null,
        logo_url:        logoUrl,
        hero_image_url:  heroImageUrl,
        brand_photos:    brandPhotosUploaded,
        hiring_info:     data.hiring         || null,
        social_links:    data.socialLinks    || null,
        payment_methods: data.paymentMethods || null,
        brand_colors:    data.brandColors    || null,
        custom_design:   data.customDesign   || null,
        business_hours:  data.businessHours  || null,
      },
      { onConflict: 'biz_id' }
    );

  if (bizError) throw new Error(`businesses: ${bizError.message}`);

  // ── 3. Replace staff rows ──────────────────────────────────────────────────
  onProgress('Saving team members…');
  await supabase.from('staff').delete().eq('biz_id', bizId);

  if (staffWithPhotos.length > 0) {
    const { error: staffError } = await supabase
      .from('staff')
      .insert(
        staffWithPhotos.map((m) => ({
          biz_id:         bizId,
          name:           m.name              || null,
          role_type:      m.title             || null,
          bio:            m.bio               || null,
          instagram:      m.instagram         || null,
          contact_email:  m.contactEmail      || null,
          contact_phone:  m.contactPhone      || null,
          booking_status: m.bookingStatus     || 'none',
          booking_link:   m.bookingLink       || null,
          photo_url:      m.uploadedPhotoUrl  || null,
        }))
      );
    if (staffError) throw new Error(`staff: ${staffError.message}`);
  }

  // ── 4. Replace services rows ───────────────────────────────────────────────
  onProgress('Saving services…');
  await supabase.from('services_offered').delete().eq('biz_id', bizId);

  if ((data.selectedServices || []).length > 0) {
    const { error: svcError } = await supabase
      .from('services_offered')
      .insert(
        (data.selectedServices || []).map((s) => ({
          biz_id:   bizId,
          name:     s.name     || null,
          category: s.category || null,
          duration: s.duration ?? null,
          buffer:   s.buffer   ?? null,
          custom:   s.custom   || false,
        }))
      );
    if (svcError) throw new Error(`services_offered: ${svcError.message}`);
  }

  return { bizId };
}
