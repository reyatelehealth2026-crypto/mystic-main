const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const LAHIRI_AYANAMSHA_2000 = 23.85;
const AYANAMSHA_DRIFT_PER_YEAR = 50.27 / 3600;

const OBLIQUITY_DEG = 23.4393;

function toJulianDay(date: Date): number {
  const t = date.getTime();
  return t / 86400000 + 2440587.5;
}

function normalize360(value: number): number {
  const v = value % 360;
  return v < 0 ? v + 360 : v;
}

export function getAyanamsha(date: Date): number {
  const years = (date.getTime() - Date.UTC(2000, 0, 1, 12) / 1) / (365.25 * 86400000);
  return LAHIRI_AYANAMSHA_2000 + AYANAMSHA_DRIFT_PER_YEAR * years;
}

export function getSunTropicalLongitude(date: Date): number {
  const n = toJulianDay(date) - 2451545.0;
  const L = normalize360(280.46 + 0.9856474 * n);
  const g = normalize360(357.528 + 0.9856003 * n);
  const gRad = g * DEG_TO_RAD;
  const lambda = L + 1.915 * Math.sin(gRad) + 0.02 * Math.sin(2 * gRad);
  return normalize360(lambda);
}

export function getSunSiderealLongitude(date: Date): number {
  return normalize360(getSunTropicalLongitude(date) - getAyanamsha(date));
}

export function getLocalSiderealTimeDeg(date: Date, longitudeEast: number): number {
  const jd = toJulianDay(date);
  const n = jd - 2451545.0;
  const gmstDeg = normalize360(280.46061837 + 360.98564736629 * n);
  return normalize360(gmstDeg + longitudeEast);
}

export function getTropicalAscendant(date: Date, latitude: number, longitudeEast: number): number {
  const lstDeg = getLocalSiderealTimeDeg(date, longitudeEast);
  const lstRad = lstDeg * DEG_TO_RAD;
  const epsRad = OBLIQUITY_DEG * DEG_TO_RAD;
  const latRad = latitude * DEG_TO_RAD;

  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  const ascRad = Math.atan2(y, x);
  return normalize360(ascRad * RAD_TO_DEG);
}

export function getSiderealAscendant(date: Date, latitude: number, longitudeEast: number): number {
  return normalize360(getTropicalAscendant(date, latitude, longitudeEast) - getAyanamsha(date));
}

export function longitudeToSignIndex(longitude: number): number {
  return Math.floor(normalize360(longitude) / 30);
}
