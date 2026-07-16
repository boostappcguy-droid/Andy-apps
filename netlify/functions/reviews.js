// Serverless proxy for Google Places reviews.
// Keeps the API key out of client-side code and caches responses
// so normal traffic never burns through Places API quota.
//
// Required environment variable (Netlify: Site configuration → Environment variables):
//   GOOGLE_MAPS_API_KEY  — API key with Places API enabled
// Optional:
//   GOOGLE_PLACE_ID      — overrides the default State Cool Place ID below

const DEFAULT_PLACE_ID = 'ChIJO5VUgpHLQIYRW82NC0Z1q7k'; // State Cool AC & Heating

let cache = { data: null, ts: 0 };
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

exports.handler = async () => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;

  if (!key || !placeId) {
    return respond(503, { error: 'Reviews are not configured yet.' });
  }

  if (cache.data && Date.now() - cache.ts < TTL_MS) {
    return respond(200, cache.data);
  }

  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    `?place_id=${encodeURIComponent(placeId)}` +
    '&fields=rating,user_ratings_total,reviews' +
    '&reviews_sort=newest' +
    `&key=${key}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== 'OK') {
      return respond(502, { error: `Places API error: ${json.status}` });
    }

    const r = json.result;
    const data = {
      rating: r.rating,
      total: r.user_ratings_total,
      reviews: (r.reviews || []).slice(0, 5).map((v) => ({
        author: v.author_name,
        rating: v.rating,
        text: v.text,
        when: v.relative_time_description,
        photo: v.profile_photo_url,
      })),
    };

    cache = { data, ts: Date.now() };
    return respond(200, data);
  } catch (err) {
    return respond(502, { error: 'Failed to reach Places API.' });
  }
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify(body),
  };
}
