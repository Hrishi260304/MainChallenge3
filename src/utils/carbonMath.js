// Carbon Footprint conversion factors and math engines
// Values are based on EPA, DEFRA, and Greenhouse Gas Protocol standards.

export const EMISSION_FACTORS = {
  // Transport coefficients (kg CO2e per mile)
  transport: {
    car_gas: 0.404,
    car_diesel: 0.430,
    car_hybrid: 0.200,
    car_electric: 0.080,
    public_transit: 0.100, // per mile
    flight_short: 250, // flat rate per short flight (under 3 hours)
    flight_long: 1200, // flat rate per long flight (over 3 hours)
    bike_walk: 0.000
  },

  // Home energy coefficients (kg CO2e per unit)
  energy: {
    electricity_kwh: 0.385,
    gas_therms: 5.300,
    water_gallon: 0.003
  },

  // Diet coefficients (kg CO2e per year baseline or per meal savings)
  diet: {
    vegan_annual: 1500,
    vegetarian_annual: 2200,
    balanced_annual: 3800,
    heavy_meat_annual: 5500,
    
    // Savings compared to a standard high-meat meal (kg CO2e)
    veg_meal_offset: 1.5,
    vegan_meal_offset: 2.2,
    no_waste_offset: 0.8
  },

  // Consumption/Shopping coefficients (kg CO2e per year baseline or offset)
  consumption: {
    minimalist_annual: 1200,
    average_annual: 2800,
    frequent_annual: 5200,

    // Savings (kg CO2e)
    second_hand_offset: 12.0,
    recycled_offset: 0.5,
    reusable_bag_offset: 0.2
  }
};

// Conversions for equivalent metrics (helps users visualize impact)
export const EQUIVALENTS = {
  trees_planted: 22, // 1 mature tree absorbs ~22kg of CO2 per year
  car_miles_avoided: 0.404, // 1 mile driven in a typical gas car is ~0.404kg CO2
  smartphone_charges: 0.008 // 1 full charge is ~0.008kg CO2
};

/**
 * Calculates annual baseline carbon footprint (in metric tons of CO2e) based on onboarding survey answers
 */
export function calculateBaseline(answers) {
  let transportTotal = 0;
  
  // 1. Transportation Calculation
  const carTypeKey = `car_${answers.carType || 'gas'}`;
  const carFactor = EMISSION_FACTORS.transport[carTypeKey] || EMISSION_FACTORS.transport.car_gas;
  const carAnnualMiles = (parseFloat(answers.carWeeklyMiles) || 0) * 52;
  transportTotal += carAnnualMiles * carFactor;
  
  const transitAnnualMiles = (parseFloat(answers.transitWeeklyMiles) || 0) * 52;
  transportTotal += transitAnnualMiles * EMISSION_FACTORS.transport.public_transit;
  
  const shortFlights = parseFloat(answers.shortFlightsYear) || 0;
  transportTotal += shortFlights * EMISSION_FACTORS.transport.flight_short;
  
  const longFlights = parseFloat(answers.longFlightsYear) || 0;
  transportTotal += longFlights * EMISSION_FACTORS.transport.flight_long;

  // 2. Home Energy Calculation
  let energyTotal = 0;
  // Convert monthly utility bills to units, then to annual emissions
  // Assumes electricity is $0.15/kWh and gas is $1.20/therm
  const monthlyElectricBill = parseFloat(answers.monthlyElectricBill) || 0;
  const annualElectricityKwh = (monthlyElectricBill / 0.15) * 12;
  energyTotal += annualElectricityKwh * EMISSION_FACTORS.energy.electricity_kwh;

  const monthlyGasBill = parseFloat(answers.monthlyGasBill) || 0;
  const annualGasTherms = (monthlyGasBill / 1.20) * 12;
  energyTotal += annualGasTherms * EMISSION_FACTORS.energy.gas_therms;

  // 3. Diet Calculation
  const dietTotal = EMISSION_FACTORS.diet[`${answers.dietType || 'balanced'}_annual`] || EMISSION_FACTORS.diet.balanced_annual;

  // 4. Shopping/Consumption Calculation
  const consumptionTotal = EMISSION_FACTORS.consumption[`${answers.shoppingHabits || 'average'}_annual`] || EMISSION_FACTORS.consumption.average_annual;

  // Final Sum in kg
  const grandTotalKg = transportTotal + energyTotal + dietTotal + consumptionTotal;
  
  // Return breakdown and grand total in Metric Tons (rounded to 2 decimal places)
  return {
    transport: parseFloat((transportTotal / 1000).toFixed(2)),
    energy: parseFloat((energyTotal / 1000).toFixed(2)),
    diet: parseFloat((dietTotal / 1000).toFixed(2)),
    consumption: parseFloat((consumptionTotal / 1000).toFixed(2)),
    total: parseFloat((grandTotalKg / 1000).toFixed(2))
  };
}

/**
 * Calculates emission impact or savings of a daily action (in kg CO2e)
 * Positive return value means carbon was added.
 * Negative return value means carbon was offset/saved.
 */
export function calculateActivityFootprint(category, activity, amount) {
  const quantity = parseFloat(amount) || 0;
  
  switch (category) {
    case 'transport':
      if (activity === 'drive_gas') return quantity * EMISSION_FACTORS.transport.car_gas;
      if (activity === 'drive_hybrid') return quantity * EMISSION_FACTORS.transport.car_hybrid;
      if (activity === 'drive_ev') return quantity * EMISSION_FACTORS.transport.car_electric;
      if (activity === 'transit') return quantity * EMISSION_FACTORS.transport.public_transit;
      if (activity === 'bike_walk_saved') return -quantity * EMISSION_FACTORS.transport.car_gas; // Carbon saved by walking instead of driving
      return 0;

    case 'energy':
      if (activity === 'electricity') return quantity * EMISSION_FACTORS.energy.electricity_kwh;
      if (activity === 'gas') return quantity * EMISSION_FACTORS.energy.gas_therms;
      if (activity === 'cold_wash') return -quantity * EMISSION_FACTORS.diet.veg_meal_offset * 0.4; // offset based on average laundry saving (~0.6kg)
      if (activity === 'led_lights') return -quantity * 0.15; // savings per day of LED usage
      return 0;

    case 'diet':
      if (activity === 'veg_meal') return -quantity * EMISSION_FACTORS.diet.veg_meal_offset;
      if (activity === 'vegan_meal') return -quantity * EMISSION_FACTORS.diet.vegan_meal_offset;
      if (activity === 'zero_waste') return -quantity * EMISSION_FACTORS.diet.no_waste_offset;
      return 0;

    case 'consumption':
      if (activity === 'second_hand') return -quantity * EMISSION_FACTORS.consumption.second_hand_offset;
      if (activity === 'recycled') return -quantity * EMISSION_FACTORS.consumption.recycled_offset;
      if (activity === 'reusable_cup') return -quantity * EMISSION_FACTORS.consumption.reusable_bag_offset;
      return 0;

    default:
      return 0;
  }
}

/**
 * Computes visualization equivalents for a given kg CO2 savings
 */
export function getVisualEquivalents(kgSavings) {
  const absoluteKg = Math.abs(kgSavings);
  return {
    trees: (absoluteKg / EQUIVALENTS.trees_planted).toFixed(2),
    miles: (absoluteKg / EQUIVALENTS.car_miles_avoided).toFixed(1),
    charges: Math.round(absoluteKg / EQUIVALENTS.smartphone_charges)
  };
}
