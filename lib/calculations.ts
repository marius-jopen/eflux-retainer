export interface CalculationInputs {
  retainer: number;
  hours: number;
  developerRetainerHours: number;
  developerRetainerRate: number;
  clientRate1: number;
  clientRate2: number;
  clientRate3: number;
  developerRate1: number;
  developerRate2: number;
  developerRate3: number;
}

export interface CalculationResults {
  developerRetainerCost: number;
  hourBreakdown: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  revenueFromHours: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
}

export function formatCurrency(value: number): string {
  return '€' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function calculateTieredRevenue(
  hours: number,
  rate1: number,
  rate2: number,
  rate3: number
): number {
  if (hours <= 20) {
    return hours * rate1;
  } else if (hours <= 40) {
    return 20 * rate1 + (hours - 20) * rate2;
  } else {
    return 20 * rate1 + 20 * rate2 + (hours - 40) * rate3;
  }
}

export function calculateTieredCost(
  hours: number,
  retainerHours: number,
  retainerRate: number,
  rate1: number,
  rate2: number,
  rate3: number
): number {
  const fixedRetainerCost = retainerHours * retainerRate;

  if (hours <= retainerHours) {
    return fixedRetainerCost;
  }

  let additionalCost = 0;

  if (hours <= 40) {
    const excessHours = hours - retainerHours;
    additionalCost = excessHours * rate2;
  } else {
    const hoursInTier2 = 40 - retainerHours;
    const hoursInTier3 = hours - 40;
    additionalCost = hoursInTier2 * rate2 + hoursInTier3 * rate3;
  }

  return fixedRetainerCost + additionalCost;
}

export function getHourBreakdown(hours: number): {
  tier1: number;
  tier2: number;
  tier3: number;
} {
  if (hours <= 20) {
    return { tier1: hours, tier2: 0, tier3: 0 };
  } else if (hours <= 40) {
    return { tier1: 20, tier2: hours - 20, tier3: 0 };
  } else {
    return { tier1: 20, tier2: 20, tier3: hours - 40 };
  }
}

export function calculateAll(inputs: CalculationInputs): CalculationResults {
  const developerRetainerCost =
    inputs.developerRetainerHours * inputs.developerRetainerRate;

  const hourBreakdown = getHourBreakdown(inputs.hours);

  const revenueFromHours = calculateTieredRevenue(
    inputs.hours,
    inputs.clientRate1,
    inputs.clientRate2,
    inputs.clientRate3
  );

  const totalRevenue = inputs.retainer + revenueFromHours;

  const totalCost = calculateTieredCost(
    inputs.hours,
    inputs.developerRetainerHours,
    inputs.developerRetainerRate,
    inputs.developerRate1,
    inputs.developerRate2,
    inputs.developerRate3
  );

  const profit = totalRevenue - totalCost;

  return {
    developerRetainerCost,
    hourBreakdown,
    revenueFromHours,
    totalRevenue,
    totalCost,
    profit,
  };
}

