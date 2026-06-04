interface PricingDetails {
  materialCost: number;
  manufacturingCost: number;
  packagingCost: number;
  shippingCost: number;
  profitMargin: number; // percentage (e.g. 60)
  totalCost: number;
  retailPrice: number;
}

interface ManufacturingStep {
  name: string;
  durationHours: number;
  description: string;
  cost: number;
}

interface ManufacturingSim {
  steps: ManufacturingStep[];
  totalTimeHours: number;
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
  carbonFootprintKg: number;
  materialUsageGrams: number;
}

export class PricingEngine {
  calculatePricing(config: any, category: string): PricingDetails {
    let baseMaterialCost = 15;
    let baseMfgCost = 35;
    let weightModifier = 1.0;

    const cat = category.toLowerCase();
    if (cat.includes('car') || cat.includes('auto')) {
      baseMaterialCost = 8500;
      baseMfgCost = 12000;
      weightModifier = 1200.0;
    } else if (cat.includes('chair') || cat.includes('furnit')) {
      baseMaterialCost = 120;
      baseMfgCost = 180;
      weightModifier = 15.0;
    } else if (cat.includes('sneaker') || cat.includes('shoes')) {
      baseMaterialCost = 25;
      baseMfgCost = 45;
      weightModifier = 0.8;
    }

    // Material analysis multiplier
    let metalMultiplier = 1.0;
    let finishMultiplier = 1.0;
    let partsCount = 0;

    try {
      const keys = Object.keys(config);
      partsCount = keys.length;
      for (const k of keys) {
        const mat = config[k];
        if (mat) {
          if (mat.metalness && mat.metalness > 0.5) metalMultiplier += 0.25;
          if (mat.clearcoat && mat.clearcoat > 0.5) finishMultiplier += 0.2;
          if (mat.opacity && mat.opacity < 0.9) finishMultiplier += 0.15; // glass/transparency requires molding
        }
      }
    } catch {
      // Use defaults
    }

    const materialCost = Math.round(baseMaterialCost * metalMultiplier * (partsCount ? Math.max(0.5, partsCount / 3) : 1));
    const manufacturingCost = Math.round(baseMfgCost * finishMultiplier * (partsCount ? Math.max(0.5, partsCount / 3) : 1));
    const packagingCost = cat.includes('car') ? 1500 : cat.includes('chair') ? 85 : 12;
    const shippingCost = Math.round(50 * weightModifier * (1 + (metalMultiplier - 1) * 0.5));
    const profitMargin = 60; // 60% standard luxury margin

    const totalCost = materialCost + manufacturingCost + packagingCost + shippingCost;
    // retail = totalCost / (1 - margin/100)
    const retailPrice = Math.round(totalCost / (1 - profitMargin / 100));

    return {
      materialCost,
      manufacturingCost,
      packagingCost,
      shippingCost,
      profitMargin,
      totalCost,
      retailPrice
    };
  }

  generateSimulation(config: any, category: string): ManufacturingSim {
    const pricing = this.calculatePricing(config, category);
    const cat = category.toLowerCase();

    const steps: ManufacturingStep[] = [];
    let carbonFootprintKg = 15;
    let materialUsageGrams = 1200;

    if (cat.includes('car') || cat.includes('auto')) {
      carbonFootprintKg = 4800;
      materialUsageGrams = 1450000;
      steps.push(
        { name: 'Alloy Casting & Stamping', durationHours: 72, description: 'High-pressure hydraulic chassis stamping and structural composite frame layup.', cost: Math.round(pricing.manufacturingCost * 0.3) },
        { name: 'Multi-Coat Paint Treatment', durationHours: 24, description: 'Application of corrosion inhibiting primer followed by multiple metallic pigment layers.', cost: Math.round(pricing.manufacturingCost * 0.2) },
        { name: 'R3F Dynamic Trim Assembly', durationHours: 48, description: 'Precision mounting of interior dashboard, custom trim panels, and electrical wiring looms.', cost: Math.round(pricing.manufacturingCost * 0.25) },
        { name: 'Clearcoat & Polishing', durationHours: 12, description: 'Robotic clearcoat layering with 120°C heat curing, followed by detailed hand orbital polishing.', cost: Math.round(pricing.manufacturingCost * 0.15) },
        { name: 'PDI & Track Calibration', durationHours: 6, description: 'Final Quality Audit inspection, wheel alignment checks, and torque sensors diagnostic scan.', cost: Math.round(pricing.manufacturingCost * 0.1) }
      );
    } else if (cat.includes('chair') || cat.includes('furnit')) {
      carbonFootprintKg = 42;
      materialUsageGrams = 18500;
      steps.push(
        { name: 'Precision CNC Frame Milling', durationHours: 4, description: 'Computerized shaping of support structure from structural grade metal blocks or hardwoods.', cost: Math.round(pricing.manufacturingCost * 0.3) },
        { name: 'Foam & Ergonomic Layup', durationHours: 3, description: 'Thermoformed dual-density memory foam core cut to fit seat contours.', cost: Math.round(pricing.manufacturingCost * 0.2) },
        { name: 'Upholstery Hand Stitching', durationHours: 6, description: 'Manual stitching of custom panels (leather, fabric, or micro-suede) onto seat sub-assemblies.', cost: Math.round(pricing.manufacturingCost * 0.3) },
        { name: 'Structural Curing & Assembly', durationHours: 2, description: 'Joining the structural frame with backing structures and base gas lift mounts.', cost: Math.round(pricing.manufacturingCost * 0.1) },
        { name: 'Finish Waxing & QC', durationHours: 1, description: 'Detail wipe down, polish base elements, and load pressure fatigue testing.', cost: Math.round(pricing.manufacturingCost * 0.1) }
      );
    } else {
      // Sneakers or other
      carbonFootprintKg = 8.5;
      materialUsageGrams = 750;
      steps.push(
        { name: 'Polymer Injection Molding', durationHours: 1.5, description: 'High-density foam injection molding for shock absorbing sole structures.', cost: Math.round(pricing.manufacturingCost * 0.25) },
        { name: 'Vamp Knitting & Lasering', durationHours: 2.0, description: 'Dynamic computerized threading of upper panel mesh, laser etching venting holes.', cost: Math.round(pricing.manufacturingCost * 0.3) },
        { name: 'Sole Vulcanization & Gluing', durationHours: 1.0, description: 'Thermal bonding of traction undersoles to knitted upper structures under continuous pressure.', cost: Math.round(pricing.manufacturingCost * 0.25) },
        { name: 'Eyelet & Trim Assembly', durationHours: 0.5, description: 'Threading customized high-tensile laces and heat sealing plastic trim accents.', cost: Math.round(pricing.manufacturingCost * 0.1) },
        { name: 'Visual QA & Box Boxing', durationHours: 0.5, description: 'Final manual stitching audit, color verification, and packing in luxury slide boxes.', cost: Math.round(pricing.manufacturingCost * 0.1) }
      );
    }

    let totalTimeHours = 0;
    steps.forEach(s => totalTimeHours += s.durationHours);

    let difficulty: ManufacturingSim['difficulty'] = 'Medium';
    if (totalTimeHours > 100) difficulty = 'Extreme';
    else if (totalTimeHours > 10) difficulty = 'High';
    else if (totalTimeHours < 4) difficulty = 'Low';

    return {
      steps,
      totalTimeHours,
      difficulty,
      carbonFootprintKg,
      materialUsageGrams
    };
  }
}

export const pricingEngine = new PricingEngine();
export default pricingEngine;
