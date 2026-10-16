export type GoldPoint = { time: string; value: number };
export type GoldForecastPoint = GoldPoint & { low: number; high: number };

export const GOLD_FORECAST_INTERVALS = [
  5 * 60_000,
  15 * 60_000,
  30 * 60_000,
  60 * 60_000,
  4 * 60 * 60_000,
  12 * 60 * 60_000,
  24 * 60 * 60_000,
] as const;

function fitLine(values: number[]) {
  const meanX = (values.length - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / values.length;
  let numerator = 0;
  let denominator = 0;

  values.forEach((value, index) => {
    numerator += (index - meanX) * (value - meanY);
    denominator += (index - meanX) ** 2;
  });

  const slope = denominator ? numerator / denominator : 0;
  return { intercept: meanY - slope * meanX, slope };
}

export function buildGoldForecast(points: GoldPoint[], steps: number, intervalMs: number, anchor: GoldPoint): GoldForecastPoint[] {
  const sample = points.slice(-48);
  const values = sample.map((point) => point.value);
  const { intercept, slope } = fitLine(values);
  const fittedLast = intercept + slope * (values.length - 1);
  const offset = anchor.value - fittedLast;
  const returns = values.slice(1).map((value, index) => value - values[index]);
  const volatility = Math.sqrt(returns.reduce((sum, value) => sum + value ** 2, 0) / Math.max(1, returns.length));
  const start = Date.parse(anchor.time);

  return Array.from({ length: steps }, (_, index) => {
    const elapsedHours = (index + 1) * intervalMs / 3_600_000;
    const value = intercept + slope * (values.length - 1 + elapsedHours) + offset * Math.exp(-elapsedHours / 12);
    const band = Math.max(volatility * Math.sqrt(elapsedHours) * 1.65, value * 0.0015);
    return {
      time: new Date(start + (index + 1) * intervalMs).toISOString(),
      value,
      low: value - band,
      high: value + band,
    };
  });
}

export function buildRollingGoldForecast(hourlyPoints: GoldPoint[], minutePoints: GoldPoint[], anchor: GoldPoint, learnedCorrection = 0) {
  const base = buildGoldForecast(hourlyPoints, 288, 5 * 60_000, anchor);
  const recent = minutePoints.slice(-60);
  const recentValues = recent.map((point) => point.value);
  const recentSlopePerMinute = recentValues.length >= 10 ? fitLine(recentValues).slope : 0;

  let previousValue = anchor.value;
  return base.map((point, index) => {
    const elapsedMinutes = (index + 1) * 5;
    const elapsedHours = elapsedMinutes / 60;
    const day = new Date(point.time).getUTCDay();
    const marketClosedForWeekend = day === 0 || day === 6;
    const momentum = recentSlopePerMinute * elapsedMinutes * Math.exp(-elapsedHours / 2);
    const boundedMomentum = Math.max(-anchor.value * 0.01, Math.min(anchor.value * 0.01, momentum));
    const correction = learnedCorrection * Math.exp(-elapsedHours / 6);
    const adjustment = boundedMomentum + correction;
    const value = marketClosedForWeekend ? previousValue : point.value + adjustment;
    const result = {
      ...point,
      value,
      low: marketClosedForWeekend ? value - value * 0.0005 : point.low + adjustment,
      high: marketClosedForWeekend ? value + value * 0.0005 : point.high + adjustment,
    };
    previousValue = value;
    return result;
  });
}

export function buildLockedForecastSnapshot(points: GoldPoint[], anchor: GoldPoint, corrections: Record<string, number> = {}) {
  return Object.fromEntries(
    GOLD_FORECAST_INTERVALS.map((intervalMs) => {
      const correction = corrections[String(intervalMs)] ?? 0;
      const predictions = buildGoldForecast(points, 24, intervalMs, anchor).map((point) => ({
        ...point,
        value: point.value + correction,
        low: point.low + correction,
        high: point.high + correction,
      }));
      return [String(intervalMs), predictions];
    }),
  ) as Record<string, GoldForecastPoint[]>;
}
