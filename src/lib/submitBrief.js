import { supabase } from './supabaseClient';

// ── Raw fetch helpers (same pattern as Newsroom — no SDK auth layer) ──────────

const SB_URL  = 'https://bjxgqbgjtzbgzdprtepd.supabase.co';
const SB_KEY  = 'sb_publishable_5mY9p11tWx6znT3h2zMr2A_1J19xwEr';
const SB_HDRS = {
  'apikey':        SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
  'Content-Type':  'application/json',
  'Prefer':        'return=representation',
};

async function dbPost(table, body, selectCols = '*') {
  // Append ?select= so PostgREST always returns the requested columns in the 201 body
  const url  = `${SB_URL}/rest/v1/${table}?select=${encodeURIComponent(selectCols)}`;
  const res  = await fetch(url, { method: 'POST', headers: SB_HDRS, body: JSON.stringify(body) });
  const json = await res.json();
  console.log(`dbPost(${table}) status=${res.status}`, json);
  if (!res.ok) return { data: null, error: { message: json?.message || json?.hint || JSON.stringify(json) } };
  const rows = Array.isArray(json) ? json : [json];
  return { data: rows, error: null };
}

async function dbUpsert(table, body, onConflict) {
  const hdrs = { ...SB_HDRS, 'Prefer': `return=representation,resolution=merge-duplicates` };
  const url  = `${SB_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`;
  const res  = await fetch(url, { method: 'POST', headers: hdrs, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) return { error: { message: json?.message || json?.hint || JSON.stringify(json) } };
  return { error: null };
}

async function dbDelete(table, col, val) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}`, { method: 'DELETE', headers: SB_HDRS });
  return { error: res.ok ? null : { message: `DELETE ${table} failed: ${res.status}` } };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function blobUrlToFile(blobUrl, filename) {
  const response = await fetch(blobUrl);
  const blob     = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

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

  // ── 2. CREATE client record — raw fetch, no SDK ────────────────────────────
  onProgress('Creating salon client record…');
  const subdomainPrefix = toSubdomainPrefix(data.businessName);

  const clientFields = {
    name:             data.businessName || 'Unnamed Salon',
    logo_url:         logoUrl           || null,
    brand_colors:     data.brandColors  || null,   // jsonb — fetch will JSON.stringify the whole body
    subdomain_prefix: subdomainPrefix,
  };

  // ✅ DEBUG: inspect exact payload before sending
  console.log('Sending to Supabase (clients):', JSON.stringify(clientFields, null, 2));

  // Request only the 'id' column back — avoids RLS SELECT issues on other columns
  const { data: clientRows, error: clientError } = await dbPost('clients', clientFields, 'id');
  if (clientError) throw new Error(`clients: ${clientError.message}`);
  const clientId = clientRows?.[0]?.id ?? null;
  if (!clientId) throw new Error(`clients: insert returned no id — response was: ${JSON.stringify(clientRows)}`);

  console.log('Client record created. clientId:', clientId);

  // ── 3. Upsert businesses row ───────────────────────────────────────────────
  onProgress('Saving business profile…');

  const bizFields = {
    biz_id:            bizId,
    business_name:     data.businessName   || null,
    business_type:     data.businessType   || null,
    address:           data.address        || null,
    phone:             data.phone          || null,
    rating:            data.rating         ?? null,
    hero_text:         data.heroText       || null,
    tagline:           data.tagline        || null,
    logo_url:          logoUrl             || null,
    hero_image_url:    heroImageUrl        || null,
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
  };

  console.log('Sending to Supabase (businesses):', JSON.stringify(bizFields, null, 2));

  const { error: bizError } = await dbUpsert('businesses', bizFields, 'biz_id');
  if (bizError) throw new Error(`businesses: ${bizError.message}`);

  // ── 4. Replace staff rows — tagged with client_id ──────────────────────────
  onProgress('Saving team members…');
  await dbDelete('staff', 'biz_id', bizId);

  if (staffWithPhotos.length > 0) {
    const staffFields = staffWithPhotos.map((m) => ({
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
    }));

    console.log('Sending to Supabase (staff):', JSON.stringify(staffFields, null, 2));

    const { error: staffError } = await dbPost('staff', staffFields);
    if (staffError) throw new Error(`staff: ${staffError.message}`);
  }

  // ── 5. Replace services rows — tagged with client_id ──────────────────────
  onProgress('Saving services…');
  await dbDelete('services_offered', 'biz_id', bizId);

  if ((data.selectedServices || []).length > 0) {
    const svcFields = (data.selectedServices || []).map((s) => ({
      biz_id:    bizId,
      client_id: clientId,
      name:      s.name     || null,
      category:  s.category || null,
      duration:  s.duration ?? null,
      buffer:    s.buffer   ?? null,
      custom:    s.custom   || false,
    }));

    console.log('Sending to Supabase (services_offered):', JSON.stringify(svcFields, null, 2));

    const { error: svcError } = await dbPost('services_offered', svcFields);
    if (svcError) throw new Error(`services_offered: ${svcError.message}`);
  }

  return { bizId, clientId };
}
