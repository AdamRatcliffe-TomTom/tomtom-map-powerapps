export default function parseOriginFromUrl(url) {
  const pattern = /calculateReachableRange\/([\d.+-]+),([\d.+-]+)/;
  const match = url.match(pattern);

  if (!match || match.length < 3) return null;

  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);

  return [lon, lat];
}
