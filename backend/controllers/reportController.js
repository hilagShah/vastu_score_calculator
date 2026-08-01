const mongoose = require('mongoose');
const UserReport = require('../models/UserReport');

// Vastu Scoring engine helper function
const calculateVastuScoreDetails = (inputs) => {
  const {
    mainEntrance,
    kitchen,
    additionalKitchens = [],
    masterBedroom,
    additionalBedrooms = [],
    bathroom,
    additionalBathrooms = [],
    poojaRoom,
    plotFacing,
    plotShape,
    staircaseBalcony
  } = inputs;

  const breakdown = {};
  const criticalDoshas = [];
  let baseScore = 0;

  // Helper to determine status
  const getStatus = (ratio) => {
    if (ratio >= 0.8) return 'Auspicious';
    if (ratio >= 0.5) return 'Neutral';
    return 'Malefic';
  };

  // a) Main Entrance (Max 20 pts)
  let entranceRatio = 0.5;
  if (['NE', 'E', 'N'].includes(mainEntrance)) entranceRatio = 1.0;
  else if (['NW', 'W'].includes(mainEntrance)) entranceRatio = 0.7;
  else if (['SE', 'S'].includes(mainEntrance)) entranceRatio = 0.4;
  else if (mainEntrance === 'SW') entranceRatio = 0.1;
  
  const entranceScore = 20 * entranceRatio;
  baseScore += entranceScore;
  breakdown.entrance = { score: Math.round(entranceScore * 10) / 10, max: 20, status: getStatus(entranceRatio) };

  // b) Kitchen Zone & Additional Kitchens (Max 15 pts)
  const getKitchenRatio = (dir) => {
    if (dir === 'SE') return 1.0;
    if (dir === 'NW') return 0.75;
    if (['E', 'W', 'S'].includes(dir)) return 0.5;
    if (['N', 'SW', 'NE'].includes(dir)) return 0.0;
    return 0.5;
  };

  const mainKitchenRatio = getKitchenRatio(kitchen);
  let totalKitchenRatioSum = mainKitchenRatio;

  if (additionalKitchens && additionalKitchens.length > 0) {
    additionalKitchens.forEach(kitchenDir => {
      totalKitchenRatioSum += getKitchenRatio(kitchenDir);
    });
  }

  const kitchenCount = 1 + (additionalKitchens ? additionalKitchens.length : 0);
  const averageKitchenRatio = totalKitchenRatioSum / kitchenCount;
  const kitchenScore = 15 * averageKitchenRatio;
  baseScore += kitchenScore;
  breakdown.kitchen = { score: Math.round(kitchenScore * 10) / 10, max: 15, status: getStatus(averageKitchenRatio) };

  // c) Master Bedroom & Additional Bedrooms Zone (Max 15 pts)
  const getBedroomRatio = (dir) => {
    if (dir === 'SW') return 1.0;
    if (['S', 'W'].includes(dir)) return 0.8;
    if (['NW', 'N', 'E'].includes(dir)) return 0.5;
    if (['SE', 'NE'].includes(dir)) return 0.1;
    return 0.5; // fallback
  };

  const masterRatio = getBedroomRatio(masterBedroom);
  let totalBedroomRatioSum = masterRatio;
  
  if (additionalBedrooms && additionalBedrooms.length > 0) {
    additionalBedrooms.forEach(bedroomDir => {
      totalBedroomRatioSum += getBedroomRatio(bedroomDir);
    });
  }
  
  const bedroomCount = 1 + (additionalBedrooms ? additionalBedrooms.length : 0);
  const averageBedroomRatio = totalBedroomRatioSum / bedroomCount;
  const bedroomScore = 15 * averageBedroomRatio;
  baseScore += bedroomScore;
  breakdown.masterBedroom = { 
    score: Math.round(bedroomScore * 10) / 10, 
    max: 15, 
    status: getStatus(averageBedroomRatio) 
  };

  // d) Pooja Room Zone (Max 10 pts)
  let poojaRatio = 0.0;
  if (poojaRoom === 'NE') poojaRatio = 1.0;
  else if (['E', 'N'].includes(poojaRoom)) poojaRatio = 0.8;
  else if (poojaRoom === 'W') poojaRatio = 0.6;
  else if (['NW', 'SE', 'S'].includes(poojaRoom)) poojaRatio = 0.3;
  else if (poojaRoom === 'SW') poojaRatio = 0.0;
  
  const poojaScore = 10 * poojaRatio;
  baseScore += poojaScore;
  breakdown.poojaRoom = { score: Math.round(poojaScore * 10) / 10, max: 10, status: getStatus(poojaRatio) };

  // e) Bathroom & Additional Bathrooms Zone (Max 10 pts)
  const getBathroomRatio = (dir) => {
    if (['NW', 'W'].includes(dir)) return 1.0;
    if (['S', 'SE'].includes(dir)) return 0.6;
    if (['SW', 'N', 'E'].includes(dir)) return 0.2;
    if (dir === 'NE') return 0.0;
    return 0.2; // fallback
  };

  const mainBathroomRatio = getBathroomRatio(bathroom);
  let totalBathroomRatioSum = mainBathroomRatio;

  if (additionalBathrooms && additionalBathrooms.length > 0) {
    additionalBathrooms.forEach(bathDir => {
      totalBathroomRatioSum += getBathroomRatio(bathDir);
    });
  }

  const bathroomCount = 1 + (additionalBathrooms ? additionalBathrooms.length : 0);
  const averageBathroomRatio = totalBathroomRatioSum / bathroomCount;
  const bathroomScore = 10 * averageBathroomRatio;
  baseScore += bathroomScore;
  breakdown.bathroom = { 
    score: Math.round(bathroomScore * 10) / 10, 
    max: 10, 
    status: getStatus(averageBathroomRatio) 
  };

  // f) Plot Facing (Max 15 pts)
  let facingRatio = 0.5;
  if (['NE', 'E', 'N'].includes(plotFacing)) facingRatio = 1.0;
  else if (['NW', 'W'].includes(plotFacing)) facingRatio = 0.7;
  else if (['SE', 'S'].includes(plotFacing)) facingRatio = 0.4;
  else if (plotFacing === 'SW') facingRatio = 0.1;
  
  const facingScore = 15 * facingRatio;
  baseScore += facingScore;
  breakdown.plotFacing = { score: Math.round(facingScore * 10) / 10, max: 15, status: getStatus(facingRatio) };

  // g) Plot Shape (Max 10 pts)
  let shapeRatio = 1.0;
  if (['Square', 'Rectangle'].includes(plotShape)) shapeRatio = 1.0;
  else if (['L-Shaped', 'Extending'].includes(plotShape)) shapeRatio = 0.4;
  else if (['Triangular', 'Irregular'].includes(plotShape)) shapeRatio = 0.1;
  
  const shapeScore = 10 * shapeRatio;
  baseScore += shapeScore;
  breakdown.plotShape = { score: Math.round(shapeScore * 10) / 10, max: 10, status: getStatus(shapeRatio) };

  // h) Staircase / Open Balcony Zone (Max 5 pts)
  let staircaseRatio = 0.6;
  if (['SW', 'W', 'S', 'NW'].includes(staircaseBalcony)) staircaseRatio = 1.0;
  else if (['SE', 'E', 'N'].includes(staircaseBalcony)) staircaseRatio = 0.6;
  else if (staircaseBalcony === 'NE') staircaseRatio = 0.2;
  
  const staircaseScore = 5 * staircaseRatio;
  baseScore += staircaseScore;
  breakdown.staircaseBalcony = { score: Math.round(staircaseScore * 10) / 10, max: 5, status: getStatus(staircaseRatio) };

  // 3. CRITICAL DOSHA PENALTIES
  let finalScore = baseScore;
  
  const hasBathroomInNE = bathroom === 'NE' || (additionalBathrooms && additionalBathrooms.includes('NE'));
  if (hasBathroomInNE) {
    finalScore -= 15;
    criticalDoshas.push('Toilet in North-East Zone');
  }
  if (kitchen === 'NE') {
    finalScore -= 10;
    criticalDoshas.push('Kitchen in North-East Zone');
  }
  if (mainEntrance === 'SW') {
    finalScore -= 10;
    criticalDoshas.push('Main Entrance in South-West Zone');
  }

  // Bound between 0 and 100
  const vastuScore = Math.min(100, Math.max(0, Math.round(finalScore)));

  // Tier categorization
  let tier = '';
  if (vastuScore >= 85) tier = 'Excellent Vastu';
  else if (vastuScore >= 70) tier = 'Good';
  else if (vastuScore >= 55) tier = 'Moderate';
  else if (vastuScore >= 40) tier = 'Below Average';
  else tier = 'Poor';

  // Generate detailed defects lists (for visual UI cards)
  const defects = [];
  if (hasBathroomInNE) {
    defects.push({
      zone: 'Bathroom/Toilet',
      direction: 'NE',
      severity: 'High',
      description: 'Bathroom located in the sacred North-East (Ishaan Kona) triggers major energy blockages.'
    });
  }
  if (kitchen === 'NE') {
    defects.push({
      zone: 'Kitchen',
      direction: 'NE',
      severity: 'High',
      description: 'Kitchen in the North-East zone brings elemental conflict (Fire vs Water).'
    });
  }
  if (mainEntrance === 'SW') {
    defects.push({
      zone: 'Main Entrance',
      direction: 'SW',
      severity: 'High',
      description: 'Entrance in the South-West (Nairuti Kona) leads to career and relationship instability.'
    });
  }

  // Master Bedroom check
  if (masterRatio < 0.8) {
    defects.push({
      zone: 'Master Bedroom',
      direction: masterBedroom,
      severity: 'Medium',
      description: `Master Bedroom in the ${masterBedroom} reduces sleep grounding quality.`
    });
  }

  // Additional Bedrooms check
  if (additionalBedrooms && additionalBedrooms.length > 0) {
    additionalBedrooms.forEach((bedroomDir, idx) => {
      const ratio = getBedroomRatio(bedroomDir);
      if (ratio < 0.8) {
        defects.push({
          zone: `Additional Bedroom ${idx + 1}`,
          direction: bedroomDir,
          severity: 'Medium',
          description: `Bedroom ${idx + 1} located in the ${bedroomDir} has suboptimal grounding energy flow.`
        });
      }
    });
  }

  // Main Bathroom check (if not NE)
  if (mainBathroomRatio < 0.6 && bathroom !== 'NE') {
    defects.push({
      zone: 'Main Bathroom',
      direction: bathroom,
      severity: 'Medium',
      description: `Main Bathroom in the ${bathroom} can lead to financial and health energy drain.`
    });
  }

  // Additional Bathrooms check
  if (additionalBathrooms && additionalBathrooms.length > 0) {
    additionalBathrooms.forEach((bathDir, idx) => {
      const ratio = getBathroomRatio(bathDir);
      if (ratio < 0.6 && bathDir !== 'NE') {
        defects.push({
          zone: `Additional Bathroom ${idx + 1}`,
          direction: bathDir,
          severity: 'Medium',
          description: `Bathroom ${idx + 1} located in the ${bathDir} causes energy drainage.`
        });
      }
    });
  }

  if (poojaRatio === 0.0 && poojaRoom !== 'NE') {
    defects.push({
      zone: 'Pooja Room',
      direction: poojaRoom,
      severity: 'Medium',
      description: `Pooja room in the ${poojaRoom} diminishes spiritual alignment.`
    });
  }

  return {
    vastuScore,
    tier,
    breakdown,
    criticalDoshas,
    defects
  };
};

// Create a new report
exports.createReport = async (req, res) => {
  console.log('>>> createReport called. Body keys:', Object.keys(req.body));
  try {
    const {
      fullName,
      phone,
      mainEntrance,
      kitchen,
      masterBedroom,
      bathroom,
      poojaRoom,
      plotFacing,
      plotShape,
      staircaseBalcony
    } = req.body;

    if (!fullName || !phone || !mainEntrance || !kitchen || !masterBedroom || !bathroom || !poojaRoom || !plotFacing || !plotShape || !staircaseBalcony) {
      return res.status(400).json({ message: 'All form fields (name, phone, directions) are required' });
    }

    // Parse array inputs
    let additionalBedrooms = [];
    if (req.body.additionalBedrooms) {
      additionalBedrooms = Array.isArray(req.body.additionalBedrooms)
        ? req.body.additionalBedrooms
        : [req.body.additionalBedrooms];
    }

    let additionalBathrooms = [];
    if (req.body.additionalBathrooms) {
      additionalBathrooms = Array.isArray(req.body.additionalBathrooms)
        ? req.body.additionalBathrooms
        : [req.body.additionalBathrooms];
    }


    // Compute Score
    const inputs = {
      mainEntrance,
      kitchen,
      masterBedroom,
      additionalBedrooms,
      bathroom,
      additionalBathrooms,
      poojaRoom,
      plotFacing,
      plotShape,
      staircaseBalcony
    };

    const scoreResults = calculateVastuScoreDetails(inputs);

    // Save report to DB with fallback
    const newReport = new UserReport({
      fullName,
      phone,
      inputs,
      vastuScore: scoreResults.vastuScore,
      breakdown: scoreResults.breakdown,
      criticalDoshas: scoreResults.criticalDoshas,
      defects: scoreResults.defects
    });

    // Generate ID for response
    newReport._id = newReport._id || new mongoose.Types.ObjectId();

    // Always save user lead record to MongoDB in background
    newReport.save().then(() => {
      console.log(`✅ User Lead Saved to MongoDB: ${fullName} (${phone}) | Score: ${scoreResults.vastuScore}`);
    }).catch((dbError) => {
      console.warn('⚠️ Database save notice:', dbError.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Vastu Score calculated successfully',
      data: {
        _id: newReport._id,
        fullName: newReport.fullName,
        phone: newReport.phone,
        inputs: newReport.inputs,
        totalScore: scoreResults.vastuScore,
        tier: scoreResults.tier,
        breakdown: scoreResults.breakdown,
        criticalDoshas: scoreResults.criticalDoshas,
        defects: scoreResults.defects,
        createdAt: newReport.createdAt || new Date()
      }
    });

  } catch (error) {
    console.error('Create Vastu Report Error:', error);
    return res.status(500).json({ message: 'Server error during Vastu scoring: ' + error.message });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await UserReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Vastu Report not found' });
    }

    // Recalculate or map to the required output format
    const scoreResults = calculateVastuScoreDetails(report.inputs);

    return res.status(200).json({
      success: true,
      data: {
        _id: report._id,
        fullName: report.fullName,
        email: report.email,
        phone: report.phone,
        inputs: report.inputs,
        totalScore: report.vastuScore,
        tier: scoreResults.tier,
        breakdown: report.breakdown || scoreResults.breakdown,
        criticalDoshas: report.criticalDoshas || scoreResults.criticalDoshas,
        defects: report.defects || scoreResults.defects,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Get Vastu Report Error:', error);
    return res.status(500).json({ message: 'Server error retrieving report' });
  }
};

// List all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await UserReport.find().sort({ createdAt: -1 });
    const formattedReports = reports.map(report => {
      const scoreResults = calculateVastuScoreDetails(report.inputs);
      return {
        _id: report._id,
        fullName: report.fullName,
        email: report.email,
        phone: report.phone,
        inputs: report.inputs,
        totalScore: report.vastuScore,
        tier: scoreResults.tier,
        breakdown: report.breakdown || scoreResults.breakdown,
        criticalDoshas: report.criticalDoshas || scoreResults.criticalDoshas,
        defects: report.defects || scoreResults.defects,
        createdAt: report.createdAt
      };
    });
    return res.status(200).json({ success: true, count: formattedReports.length, data: formattedReports });
  } catch (error) {
    console.error('List Vastu Reports Error:', error);
    return res.status(500).json({ message: 'Server error listing reports' });
  }
};
