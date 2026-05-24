const API = 'https://www.patreon.com/api/oauth2/v2';

export function getOAuthUrl(state) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PATREON_CLIENT_ID,
    redirect_uri: process.env.PATREON_REDIRECT_URI,
    scope: 'identity identity[email] identity.memberships',
    state,
  });
  return `https://www.patreon.com/oauth2/authorize?${params}`;
}

export async function exchangeCode(code) {
  const res = await fetch('https://www.patreon.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.PATREON_CLIENT_ID,
      client_secret: process.env.PATREON_CLIENT_SECRET,
      redirect_uri: process.env.PATREON_REDIRECT_URI,
    }),
  });
  return res.json();
}

export async function getIdentity(accessToken) {
  const params = new URLSearchParams({
    include: 'memberships,memberships.campaign',
    'fields[user]': 'full_name,email,image_url,created',
    'fields[member]': 'patron_status,pledge_relationship_start,last_charge_date,last_charge_status,lifetime_support_cents,currently_entitled_amount_cents',
  });
  const res = await fetch(`${API}/identity?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  return res.json();
}

export function parseMembership(identity) {
  const campaignId = process.env.PATREON_CAMPAIGN_ID;
  const included = identity.included || [];
  // Önce campaign ID ile eşleştir, bulamazsan herhangi bir membership al
  const membership =
    included.find(m => m.type === 'member' && m.relationships?.campaign?.data?.id === campaignId) ||
    included.find(m => m.type === 'member');
  return membership ? membership.attributes : null;
}
