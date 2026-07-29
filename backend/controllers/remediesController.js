const axios = require('axios');

/**
 * Controller to generate Vastu Remedies using Google Gemini API.
 * Priority: Gemini AI response > hardcoded fallback.
 * Uses current-generation models (gemini-2.5-flash, gemini-3.5-flash-lite).
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

    // ── Detailed structured prompt for Gemini ──
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
    let geminiUsed = false;

    // ── Attempt Gemini API call (PRIORITY) ──
    if (apiKey && apiKey.trim().length > 10) {
      // Models to try in order of preference (current-gen first)
      const modelsToTry = [
        process.env.GEMINI_MODEL,       // user-configured model from .env
        'gemini-2.5-flash',             // latest stable flash model
        'gemini-3.5-flash-lite',        // ultra-fast lite model
        'gemini-2.5-flash-lite',        // fallback lite
      ].filter(Boolean);

      // Deduplicate
      const uniqueModels = [...new Set(modelsToTry)];

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔮 Gemini Remedies Generation Started');
      console.log(`   API Key: ${apiKey.substring(0, 6)}...${apiKey.slice(-4)} (${apiKey.length} chars)`);
      console.log(`   Models to try: [${uniqueModels.join(', ')}]`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      for (const modelName of uniqueModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          console.log(`\n  → Trying model: ${modelName}`);

          const geminiResponse = await axios.post(geminiUrl, {
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.9
            }
          }, {
            timeout: 25000,
            headers: { 'Content-Type': 'application/json' }
          });

          const candidates = geminiResponse.data?.candidates;
          if (candidates && candidates[0]?.content?.parts[0]?.text) {
            remediesText = candidates[0].content.parts[0].text;
            geminiUsed = true;

            // Log token usage if available
            const usageMetadata = geminiResponse.data?.usageMetadata;
            if (usageMetadata) {
              console.log(`  ✅ SUCCESS with [${modelName}]`);
              console.log(`     Prompt tokens: ${usageMetadata.promptTokenCount || 'N/A'}`);
              console.log(`     Response tokens: ${usageMetadata.candidatesTokenCount || 'N/A'}`);
              console.log(`     Total tokens: ${usageMetadata.totalTokenCount || 'N/A'}`);
            } else {
              console.log(`  ✅ SUCCESS with [${modelName}]: ${remediesText.length} chars (no usage metadata)`);
            }

            break; // Stop on first successful model
          } else {
            console.warn(`  ⚠️  Model [${modelName}] returned no candidates:`, JSON.stringify(geminiResponse.data).substring(0, 200));
          }
        } catch (geminiErr) {
          const status = geminiErr?.response?.status;
          const errMsg = geminiErr?.response?.data?.error?.message || geminiErr.message;
          console.error(`  ❌ Model [${modelName}] FAILED (HTTP ${status || 'N/A'}): ${errMsg}`);

          // If it's a 400 with "API key not valid", no point trying other models
          if (status === 400 && errMsg?.includes('API key not valid')) {
            console.error('  🛑 API Key is INVALID. Stopping all model attempts.');
            console.error('     Get a valid key from: https://aistudio.google.com/apikey');
            break;
          }
          // If 429 rate limit, also break — trying another model with same key won't help
          if (status === 429) {
            console.error('  🛑 Rate limited (429). All models share the same quota.');
            break;
          }
        }
      }
    } else {
      console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.warn('⚠️  GEMINI_API_KEY is NOT SET or empty!');
      console.warn('   Set it in .env or Vercel Dashboard.');
      console.warn('   Get one at: https://aistudio.google.com/apikey');
      console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // ── Fallback: hardcoded remedies (only if Gemini failed) ──
    if (!remediesText || !remediesText.trim()) {
      console.log('\n📋 Using HARDCODED fallback remedies (Gemini was unavailable/failed)');

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

    // Post-process: strip any mention of "Gemini" from the output text
    remediesText = remediesText.replace(/gemini/gi, 'Vastu Harmony');

    console.log(`\n✅ Remedies generated: ${remediesText.length} chars | Source: ${geminiUsed ? '🤖 Gemini AI' : '📋 Hardcoded Fallback'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return res.status(200).json({
      success: true,
      data: {
        fullName,
        vastuScore,
        tier,
        remediesText,
        source: geminiUsed ? 'gemini' : 'fallback',
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Generate Remedies FATAL Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Vastu remedies report: ' + error.message
    });
  }
};
