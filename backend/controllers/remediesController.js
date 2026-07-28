const axios = require('axios');

/**
 * Controller to generate Vastu Remedies using Google Gemini API
 */
exports.generateGeminiRemedies = async (req, res) => {
  try {
    const {
      fullName = 'Valued Client',
      vastuScore = 70,
      tier = 'Moderate',
      inputs = {},
      criticalDoshas = [],
      defects = []
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Detailed structured prompt for Gemini
    const prompt = `
You are an expert Vedic Vastu Shastra Consultant and Architectural Remedial Specialist.
Generate a comprehensive, non-demolition remedy report for the following property evaluation:

Client Name: ${fullName}
Overall Vastu Score: ${vastuScore}/100 (${tier})
Property Facing: ${inputs.plotFacing || 'N/A'}
Plot Shape: ${inputs.plotShape || 'Square'}
Main Entrance: ${inputs.mainEntrance || 'N/A'}
Kitchen Direction: ${inputs.kitchen || 'N/A'}
Master Bedroom: ${inputs.masterBedroom || 'N/A'}
Pooja Room: ${inputs.poojaRoom || 'N/A'}
Main Toilet/Bathroom: ${inputs.bathroom || 'N/A'}

Critical Doshas / Severe Energy Flaws:
${criticalDoshas.length > 0 ? criticalDoshas.map(d => `- ${d}`).join('\n') : 'None'}

Specific Spatial Non-Compliance Defects:
${defects.length > 0 ? defects.map(d => `- ${d.zone} in ${d.direction} (${d.severity} severity): ${d.description}`).join('\n') : 'No major spatial clashes detected.'}

INSTRUCTIONS:
Provide clear, practical, NON-DEMOLITION Vastu remedies formatted with clean section headers and bullet points:
1. EXECUTIVE VASTU SUMMARY: A 2-sentence summary of the property's energetic health.
2. CRITICAL DOSHA CORRECTIONS: Immediate remedies (color therapy, metal strip insertion, copper/brass wire, elemental balancers) for each severe defect.
3. ZONE-BY-ZONE REMEDIAL RECOMMENDATIONS:
   - Entrance Remedies
   - Kitchen & Fire Element Adjustments
   - Bedroom & Grounding Remedies
   - Bathroom & Energy Drain Remedies
4. GENERAL VASTU HARMONIZATION: 3-4 universal remedies (crystals, plants, sacred symbols, lighting).

Keep responses professional, encouraging, authoritative, and structured clearly without markdown formatting clutter like bold symbols everywhere. Use plain text bullet lists.
`;

    let remediesText = '';

    if (apiKey) {
      try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        console.log(`Calling Gemini API: model=${modelName}`);
        const geminiResponse = await axios.post(geminiUrl, {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }, { timeout: 25000 });

        const candidates = geminiResponse.data?.candidates;
        if (candidates && candidates[0]?.content?.parts[0]?.text) {
          remediesText = candidates[0].content.parts[0].text;
          console.log(`Gemini API success: received ${remediesText.length} chars`);
        } else {
          console.warn('Gemini API returned no candidates:', JSON.stringify(geminiResponse.data));
        }
      } catch (geminiErr) {
        console.error('Gemini API Request Error:', geminiErr?.response?.status, geminiErr?.response?.data || geminiErr.message);
      }
    } else {
      console.warn('GEMINI_API_KEY not set, using fallback remedies engine');
    }

    // Fallback Vastu Remedies Engine if Gemini API key is unavailable or fails
    if (!remediesText.trim()) {
      remediesText = `EXECUTIVE VASTU SUMMARY:
Your property achieved a Vastu Harmony Score of ${vastuScore}/100. While core architectural zones are functional, targeted elemental rectifications are recommended to balance energy flow without any structural demolition.

CRITICAL DOSHA CORRECTIONS:
${criticalDoshas.map(dosha => `• [${dosha}]: Install a 3mm copper strip along the threshold boundary to neutralize energy leakage. Place a lead pyramid grid at the corner.`).join('\n') || '• No critical structural defects found. Overall elemental alignment is stable.'}

ZONE-BY-ZONE REMEDIAL RECOMMENDATIONS:
• Main Entrance (${inputs.mainEntrance || 'North'}): Place a silver Swastik symbol above the outer doorframe. Ensure bright warm lighting at the entryway to welcome positive Prana.
• Kitchen Zone (${inputs.kitchen || 'South-East'}): Keep a small bowl of natural sea salt in the kitchen corner. Avoid yellow or blue color paints in the cooking zone.
• Master Bedroom (${inputs.masterBedroom || 'South-West'}): Sleep with your head pointing Towards the South. Place heavy wooden furniture in the South-West zone for grounding.
• Toilet & Bathrooms (${inputs.bathroom || 'North-West'}): Keep bathroom doors closed at all times. Place a bowl of raw rock salt inside to absorb negative moisture energy.
• Pooja Room (${inputs.poojaRoom || 'North-East'}): Keep the North-East zone clutter-free. Use white or light yellow marble flooring in prayer space.

GENERAL VASTU HARMONIZATION:
• Place a Tulsi (Holy Basil) plant in the East/North-East balcony.
• Hang a brass wind chime near the main balcony to disperse stagnant energy.
• Use camphor crystals diffused with lavender oil during evening hours for spatial purification.`;
    }

    return res.status(200).json({
      success: true,
      data: {
        fullName,
        vastuScore,
        tier,
        remediesText,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Generate Remedies Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Vastu remedies report: ' + error.message
    });
  }
};
