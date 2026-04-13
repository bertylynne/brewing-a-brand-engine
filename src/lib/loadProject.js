import { supabase } from './supabaseClient';

/**
 * Fetches a business record + its staff from Supabase by biz_id.
 * Returns a partial data object ready to be merged into global state,
 * or throws an Error if not found / on DB error.
 *
 * @param {string} bizId
 * @returns {object} Partial data object
 */
export async function loadProject(bizId) {
  if (!bizId?.trim()) throw new Error('Please enter a Business ID.');

  const id = bizId.trim().toLowerCase();

  // ── 1. Fetch business row ────────────────────────────────────────────────
  const { data: biz, error: bizError } = await supabase
    .from('businesses')
    .select('*')
    .eq('biz_id', id)
    .single();

  if (bizError || !biz) {
    throw new Error(`No project found for ID "${id}". Check the ID and try again.`);
  }

  // ── 2. Fetch staff rows ──────────────────────────────────────────────────
  const { data: staffRows, error: staffError } = await supabase
    .from('staff')
    .select('*')
    .eq('biz_id', id);

  if (staffError) {
    // Non-fatal — load business data without staff
    console.warn('Staff fetch failed:', staffError.message);
  }

  // ── 3. Map staff DB rows → app shape ────────────────────────────────────
  let idCounter = 400;
  const staff = (staffRows || []).map((m) => ({
    id:              idCounter++,
    name:            m.name           || '',
    title:           m.role_type      || '',
    photo:           m.photo_url      || null,
    photoName:       m.photo_url ? 'loaded-photo.jpg' : null,
    bookingStyle:    m.booking_style  || 'digital',
    bookingLink:     m.booking_link   || '',
    bio:             m.bio            || '',
    instagram:       m.instagram      || '',
    contactEmail:    m.contact_email  || '',
    contactPhone:    m.contact_phone  || '',
    portfolioAccess: m.portfolio_access ?? false,
  }));

  // ── 4. Map business DB row → app shape ──────────────────────────────────
  return {
    bizId:          biz.biz_id,
    businessName:   biz.business_name   || '',
    businessType:   biz.business_type   || null,
    address:        biz.address         || null,
    phone:          biz.phone           || null,
    rating:         biz.rating          ?? null,
    reviewCount:    biz.review_count    ?? null,
    heroText:       biz.hero_text       || '',
    heroImage:      biz.hero_image_url  || null,
    heroImageName:  biz.hero_image_url  ? 'loaded-hero.jpg' : null,
    logo:           biz.logo_url        || null,
    logoName:       biz.logo_url        ? 'loaded-logo.png' : null,
    tagline:        biz.tagline         || '',
    brandPhotos:    Array.isArray(biz.brand_photos) ? biz.brand_photos : [],
    socialLinks:    biz.social_links    || { facebook: '', instagram: '', others: [] },
    paymentMethods: biz.accepted_payments || [],
    brandColors:    biz.brand_colors    || null,
    customDesign:   biz.custom_design   || { enabled: false, urls: ['', '', ''], vibeNotes: '' },
    businessHours:  biz.business_hours  || null,
    fontKit:        biz.font_kit        || null,
    hiring:         biz.hiring_info     || { active: false, roles: [], description: '' },
    staff,
    // keep selectedServices empty — not stored per brief currently
    selectedServices: [],
  };
}
