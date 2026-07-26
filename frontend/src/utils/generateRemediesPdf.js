/**
 * Multi-lingual Vastu Remedies PDF Generator
 * Direct PDF Download (No about:blank window)
 */

const translations = {
  en: {
    reportTitle: 'VASTU HARMONY AI REMEDIAL REPORT',
    reportSubtitle: 'Vedic Architecture & Non-Demolition Remedial Guide',
    evalDetails: 'EVALUATION DETAILS',
    clientName: 'Owner Name',
    propertyFacing: 'Property Facing',
    plotGeometry: 'Plot Geometry',
    contactPhone: 'Contact Phone',
    emailAddress: 'Email Address',
    reportDate: 'Report Date',
    score: 'Score',
    tier: 'Tier',
    criticalFlawsTitle: 'CRITICAL VASTU FLAWS IDENTIFIED',
    breakdownTitle: 'ZONE COMPLIANCE SCORE BREAKDOWN',
    tableZone: 'Zone / Area',
    tablePlacement: 'Orientation Placement',
    tableStatus: 'Compliance Status',
    tableScore: 'Score',
    auspicious: 'Auspicious',
    neutral: 'Neutral',
    malefic: 'Malefic',
    remediesTitle: 'GEMINI AI TAILORED NON-DEMOLITION REMEDIES',
    consultantTitle: 'NEED 1-ON-1 ARCHITECTURAL CONSULTATION?',
    consultantDesc: 'Speak with Senior Vastu Architect for copper wire & pyramid installation.',
    consultantBtn: 'Direct Call / WhatsApp',
    footerText: 'Vastu Harmony AI Evaluation System • Confidential & Proprietary Report'
  },
  hi: {
    reportTitle: 'वास्तु हारमनी एआई निवारण रिपोर्ट',
    reportSubtitle: 'वैदिक वास्तुकला एवं बिना तोड़-फोड़ वास्तु सुधार मार्गदर्शिका',
    evalDetails: 'मूल्यांकन विवरण',
    clientName: 'मालिक का नाम',
    propertyFacing: 'संपत्ति की दिशा',
    plotGeometry: 'भूखंड का आकार',
    contactPhone: 'संपर्क फोन',
    emailAddress: 'ईमेल पता',
    reportDate: 'रिपोर्ट तिथि',
    score: 'वास्तु स्कोर',
    tier: 'श्रेणी',
    criticalFlawsTitle: 'पहचाने गए गंभीर वास्तु दोष',
    breakdownTitle: 'क्षेत्रवार वास्तु अनुपालन विवरण',
    tableZone: 'क्षेत्र / भाग',
    tablePlacement: 'दिशा स्थिति',
    tableStatus: 'अनुपालन स्थिति',
    tableScore: 'अंक',
    auspicious: 'शुभ',
    neutral: 'तटस्थ',
    malefic: 'अशुभ',
    remediesTitle: 'एआई आधारित बिना तोड़-फोड़ के वास्तु उपाय',
    consultantTitle: '1-ऑन-1 वास्तु विशेषज्ञ परामर्श चाहिए?',
    consultantDesc: 'तांबे के तार और पिरामिड स्थापना के लिए वरिष्ठ वास्तु विशेषज्ञ से बात करें।',
    consultantBtn: 'कॉल या व्हाट्सएप',
    footerText: 'वास्तु हारमनी एआई मूल्यांकन प्रणाली • गोपनीय एवं व्यक्तिगत रिपोर्ट'
  },
  gu: {
    reportTitle: 'વાસ્તુ હાર્મની AI નિવારણ રિપોર્ટ',
    reportSubtitle: 'વૈદિક સ્થાપત્ય અને તોડફોડ વિનાના વાસ્તુ ઉપાય માર્ગદર્શિકા',
    evalDetails: 'મૂલ્યાંકન વિગતો',
    clientName: 'માલિકનું નામ',
    propertyFacing: 'મિલકતની દિશા',
    plotGeometry: 'પ્લોટનો આકાર',
    contactPhone: 'સંપર્ક ફોન',
    emailAddress: 'ઇમેઇલ સરનામું',
    reportDate: 'રિપોર્ટ તારીખ',
    score: 'વાસ્તુ સ્કોર',
    tier: 'શ્રેણી',
    criticalFlawsTitle: 'ઓળખાયેલા ગંભીર વાસ્તુ દોષો',
    breakdownTitle: 'ઝોન મુજબ વાસ્તુ સ્થિતિ વિગતો',
    tableZone: 'વિભાગ / ઝોન',
    tablePlacement: 'દિશા સ્થિતિ',
    tableStatus: 'વાસ્તુ સ્થિતિ',
    tableScore: 'ગુણ',
    auspicious: 'શુભ',
    neutral: 'તટસ્થ',
    malefic: 'અશુભ',
    remediesTitle: 'AI આધારિત તોડફોડ વિનાના વાસ્તુ ઉપાયો',
    consultantTitle: '1-ઓન-1 વાસ્તુ નિષ્ણાત સલાહ જોઈએ છે?',
    consultantDesc: 'તાંબાના તાર અને પિરામિડ સ્થાપના માટે વરિષ્ઠ વાસ્તુ નિષ્ણાત સાથે વાત કરો.',
    consultantBtn: 'કૉલ અથવા વૉટ્સએપ',
    footerText: 'વાસ્તુ હાર્મની AI મૂલ્યાંકન સિસ્ટમ • ગોપનીય અને વ્યક્તિગત રિપોર્ટ'
  }
};

const buildDefaultRemediesText = ({ language = 'en', totalScore = 70, tier = 'Moderate', inputs = {}, criticalDoshas = [], defects = [] }) => {
  if (language === 'hi') {
    const remedies = [];
    remedies.push(`1. मुख्य वास्तु विश्लेषण:
आपकी संपत्ति ने 100 में से ${totalScore} का वास्तु स्कोर प्राप्त किया है। बुनियादी वास्तु दिशाएं अनुकूल हैं, फिर भी बिना किसी तोड़-फोड़ के सकारात्मक ऊर्जा प्रवाह बढ़ाने हेतु निम्नलिखित उपाय सुझाए जाते हैं।`);

    if (criticalDoshas && criticalDoshas.length > 0) {
      remedies.push(`2. गंभीर वास्तु दोष निवारण:
${criticalDoshas.map(d => `• [${d}]: चौखट के नीचे 3mm तांबे की पट्टी लगाएं। प्रभावित कोने में 9 सीसा पिरामिड स्थापित करें।`).join('\n')}`);
    } else {
      remedies.push(`2. गंभीर वास्तु दोष निवारण:
• कोई गंभीर संरचनात्मक दोष (ईशान/नैऋत्य दिशा clash) नहीं पाया गया। मुख्य ऊर्जा क्षेत्र सुरक्षित हैं।`);
    }

    const roomRemedies = [];
    const plotShape = inputs.plotShape || 'Square';
    if (plotShape === 'Irregular') {
      roomRemedies.push(`• भूखंड आकार (अनियमित): भूखंड की बाहरी सीमा पर पीतल की पिरामिड स्ट्रिप लगाएं। कटे हुए कोनों में 4 सीसा (Lead) पिरामिड स्थापित करें।`);
    }

    const kitchen = inputs.kitchen || 'SE';
    if (kitchen !== 'SE') {
      roomRemedies.push(`• रसोई घर (${kitchen}): गैस चूल्हे के नीचे पीला जैसलमेर संगमरमर का पत्थर रखें। रसोई में नीले या काले रंग का उपयोग न करें।`);
    } else {
      roomRemedies.push(`• रसोई घर (दक्षिण-पूर्व): आदर्श अग्नि कोण! रसोई को साफ रखें और पूर्व दिशा की ओर मुंह करके खाना बनाएं।`);
    }

    const bedroom = inputs.masterBedroom || 'SW';
    if (bedroom !== 'SW') {
      roomRemedies.push(`• मुख्य शयनकक्ष (${bedroom}): सोते समय सिर दक्षिण या पश्चिम दिशा की ओर रखें। लोहे के बजाय लकड़ी के बिस्तर का प्रयोग करें।`);
    }

    const bathroom = inputs.bathroom || 'NW';
    if (bathroom === 'NE') {
      roomRemedies.push(`• शौचालय (उत्तर-पूर्व): दरवाजे की चौखट पर तांबे की पट्टी लगाएं। अंदर कांच के बर्तन में समुद्री नमक रखें और दरवाजा हमेशा बंद रखें।`);
    }

    remedies.push(`3. कमरों एवं दिशाओं के विशेष उपाय:
${roomRemedies.join('\n')}`);

    remedies.push(`4. सामान्य ऊर्जा संतुलन उपाय:
• उत्तर-पूर्व (ईशान) बालकनी में हरा तुलसी का पौधा लगाएं।
• शाम के समय कपूर और लौंग का धुंआ करें जिससे नकारात्मक ऊर्जा समाप्त हो।
• उत्तर-पश्चिम बालकनी में 6 छड़ों वाली पीतल की विंड चाइम लगाएं।`);

    return remedies.join('\n\n');
  }

  if (language === 'gu') {
    const remedies = [];
    remedies.push(`1. મુખ્યાત્મક વાસ્તુ વિશ્લેષણ:
તમારી મિલકતે 100 માંથી ${totalScore} નો વાસ્તુ સ્કોર મેળવ્યો છે. પ્રાથમિક દિશાઓ અનુકૂળ છે, છતાં પણ કોઈ પણ તોડફોડ વિના હકારાત્મક ઊર્જા વધારવા માટે નીચે મુજબના ઉપાયો સૂચવવામાં આવે છે.`);

    if (criticalDoshas && criticalDoshas.length > 0) {
      remedies.push(`2. ગંભીર વાસ્તુ દોષ નિવારણ:
${criticalDoshas.map(d => `• [${d}]: ઉંબરા નીચે 3mm તાંબાની પટ્ટી લગાવો. અસરગ્રસ્ત ખૂણામાં 9 સીસા (Lead) પિરામિડ સ્થાપિત કરો.`).join('\n')}`);
    } else {
      remedies.push(`2. ગંભીર વાસ્તુ દોષ નિવારણ:
• કોઈ ગંભીર માળખાકીય દોષ (ઈશાન/નૈઋત્ય ક્લેશ) મળ્યો નથી. મુખ્ય ઊર્જા ક્ષેત્રો સુરક્ષિત છે.`);
    }

    const roomRemedies = [];
    const plotShape = inputs.plotShape || 'Square';
    if (plotShape === 'Irregular') {
      roomRemedies.push(`• પ્લોટનો આકાર (અનિયમિત): પ્લોટની બહારની સીમા પર પિત્તળની પિરામિડ પટ્ટી મૂકો. કપાયેલા ખૂણામાં 4 સીસાના પિરામિડ સ્થાપિત કરો.`);
    }

    const kitchen = inputs.kitchen || 'SE';
    if (kitchen !== 'SE') {
      roomRemedies.push(`• રસોડું (${kitchen}): ગેસ સગડી નીચે પીળો જેસલમેર આરસપહાણનો પથ્થર મૂકો. રસોડામાં કાળા કે વાદળી રંગનો ઉપયોગ ટાળો.`);
    } else {
      roomRemedies.push(`• રસોડું (દક્ષિણ-પૂર્વ): ઉત્તમ અગ્નિ કોણ સ્થાન! રસોડું સ્વચ્છ રાખો અને પૂર્વ દિશા તરફ મુખ રાખીને રસોઈ બનાવો.`);
    }

    const bedroom = inputs.masterBedroom || 'SW';
    if (bedroom !== 'SW') {
      roomRemedies.push(`• મુખ્ય બેડરૂમ (${bedroom}): સુતી વખતે માથું દક્ષિણ કે પશ્ચિમ દિશામાં રાખો. લાકડાના પલંગનો જ ઉપયોગ કરો.`);
    }

    const bathroom = inputs.bathroom || 'NW';
    if (bathroom === 'NE') {
      roomRemedies.push(`• શૌચાલય (ઉત્તર-પૂર્વ): દરવાજાના ઉંબરા નીચે તાંબાની પટ્ટી લગાવો. અંદર કાચના વાસણમાં સિંધવ મીઠું રાખો અને દરવાજો બંધ રાખો.`);
    }

    remedies.push(`3. ઓરડાઓ અને દિશાઓના ખાસ ઉપાયો:
${roomRemedies.join('\n')}`);

    remedies.push(`4. સામાન્ય ઊર્જા સંતુલન ઉપાયો:
• ઉત્તર-પૂર્વ (ઈશાન) ગેલેરીમાં તુલસીનો છોડ વાવો.
• સાંજના સમયે કપૂરનો ધૂપ કરો જેથી નકારાત્મક ઊર્જા દૂર થાય.
• ઉત્તર-પશ્ચિમ ગેલેરીમાં 6 સળિયા વાળી પિત્તળની વિન્ડ ચાઇમ લગાવો.`);

    return remedies.join('\n\n');
  }

  // English default
  const remedies = [];
  remedies.push(`1. EXECUTIVE VASTU SUMMARY:
Your property achieved a Vastu Harmony Score of ${totalScore}/100 (${tier} Alignment). While primary directional axes show functional potential, targeted elemental rectifications are recommended to harmonize energy flow without any structural demolition.`);

  if (criticalDoshas && criticalDoshas.length > 0) {
    remedies.push(`2. CRITICAL DOSHA RECTIFICATIONS:
${criticalDoshas.map(d => `• [${d}]: Install a 3mm copper strip along the threshold boundary to seal energy leakage. Place a lead pyramid grid in the affected corner.`).join('\n')}`);
  } else {
    remedies.push(`2. CRITICAL DOSHA RECTIFICATIONS:
• No severe structural flaws (Ishaan/Nairuti clashes) detected. Core energetic zones remain stable.`);
  }

  const roomRemedies = [];
  const plotShape = inputs.plotShape || 'Square';
  if (plotShape === 'Irregular') {
    roomRemedies.push(`• Plot Shape (Irregular): Place brass pyramid strips along the property boundary line to symbolically square the plot. Install 4 lead pyramids at the sharpest corners to suppress disharmonious energy.`);
  }

  const kitchen = inputs.kitchen || 'SE';
  if (kitchen !== 'SE') {
    roomRemedies.push(`• Kitchen Placement (${kitchen}): Place a yellow marble slab under the stove and avoid blue or black granite counter tops to resolve Fire vs Water conflict.`);
  } else {
    roomRemedies.push(`• Kitchen Placement (South-East): Ideal Agni Kona placement! Keep counter clutter-free and cook facing East.`);
  }

  const bedroom = inputs.masterBedroom || 'SW';
  if (bedroom !== 'SW') {
    roomRemedies.push(`• Master Bedroom Placement (${bedroom}): Sleep with your head pointing towards South or West. Use a solid wooden bed (no metal frame) and warm earth-tone decor (beige, terracotta).`);
  }

  const bathroom = inputs.bathroom || 'NW';
  if (bathroom === 'NE') {
    roomRemedies.push(`• Bathroom Placement (North-East): Install a copper strip under the door threshold. Place a bowl of raw rock salt inside and keep the door closed at all times.`);
  }

  remedies.push(`3. TAILORED ROOM & SPATIAL REMEDIES:
${roomRemedies.join('\n')}`);

  remedies.push(`4. GENERAL ELEMENTAL HARMONIZATION:
• Place a live Tulsi (Holy Basil) plant in the North-East or East balcony to invite positive Prana.
• Diffuse natural camphor with lavender essential oil during evening hours for spatial aura cleansing.
• Hang a 6-rod hollow metal wind chime in the North-West zone to keep stagnant air moving.`);

  return remedies.join('\n\n');
};

/**
 * Utility to generate a professional PDF Remedies Report
 * Direct PDF Download (No about:blank window)
 */
export const generateRemediesPdf = async ({
  language = 'en',
  fullName = 'Valued Client',
  email = 'N/A',
  phone = 'N/A',
  totalScore = 70,
  tier = 'Moderate',
  inputs = {},
  breakdown = {},
  criticalDoshas = [],
  defects = [],
  remediesText = '',
  createdAt = new Date()
}) => {
  const sanitizedName = (fullName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Vastu_Remedies_Report_${sanitizedName}.pdf`;

  const t = translations[language] || translations.en;

  const finalRemediesText = (remediesText && remediesText.trim().length > 20)
    ? remediesText
    : buildDefaultRemediesText({ language, totalScore, tier, inputs, criticalDoshas, defects, breakdown });

  const formattedDate = new Date(createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getStatusBadge = (status) => {
    if (status === 'Auspicious') return `<span style="background: #dcfce7; color: #14532d; padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px;">${t.auspicious}</span>`;
    if (status === 'Neutral') return `<span style="background: #fef3c7; color: #78350f; padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px;">${t.neutral}</span>`;
    return `<span style="background: #ffe4e6; color: #881337; padding: 2px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px;">${t.malefic}</span>`;
  };

  const htmlContent = `
    <div class="report-card" style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; padding: 12px; background: #ffffff; width: 750px; margin: 0 auto;">
      <style>
        @page { margin: 8mm 10mm; size: A4; }
        @media print {
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #fff; padding: 20px 24px; border-radius: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .header-title h1 { margin: 0; font-size: 18px; font-weight: 800; text-transform: uppercase; }
        .header-title p { margin: 3px 0 0 0; font-size: 11px; color: #cbd5e1; font-weight: 500; }
        .score-badge { background: rgba(79, 70, 229, 0.25); border: 1px solid rgba(199, 210, 254, 0.4); padding: 8px 16px; border-radius: 12px; text-align: center; }
        .score-num { font-size: 22px; font-weight: 900; color: ${totalScore >= 70 ? '#10b981' : '#f43f5e'}; }
        .score-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #e2e8f0; font-weight: 700; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; margin-bottom: 16px; font-size: 12px; page-break-inside: avoid; break-inside: avoid; }
        .info-item label { display: block; font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
        .info-item span { font-weight: 700; color: #0f172a; }
        .dosha-box { background: #fff1f2; border: 1px solid #fecdd3; padding: 14px; border-radius: 12px; margin-bottom: 16px; page-break-inside: avoid; break-inside: avoid; }
        .dosha-box h3 { margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #be123c; text-transform: uppercase; }
        .dosha-list { margin: 0; padding-left: 16px; color: #9f1239; font-size: 11px; font-weight: 600; }
        .dosha-list li { margin-bottom: 3px; }
        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; page-break-inside: auto; }
        th { background: #4f46e5; color: #ffffff; font-weight: 700; text-align: left; padding: 6px 10px; text-transform: uppercase; font-size: 9px; }
        td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
        tr:nth-child(even) td { background: #f8fafc; }
        .remedies-container { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; font-size: 11px; line-height: 1.6; white-space: pre-wrap; color: #1e293b; page-break-inside: auto; }
        .consultant-card { margin-top: 20px; background: #eef2ff; border: 1px solid #c7d2fe; padding: 14px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid; break-inside: avoid; }
        .consultant-info h4 { margin: 0; font-size: 12px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
        .consultant-info p { margin: 2px 0 0 0; font-size: 10px; color: #3730a3; }
        .consultant-phone { font-size: 13px; font-weight: 900; color: #4338ca; background: #ffffff; padding: 5px 12px; border-radius: 8px; border: 1px solid #c7d2fe; white-space: nowrap; }
        .footer { margin-top: 18px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>

      <div class="header">
        <div class="header-title">
          <h1>${t.reportTitle}</h1>
          <p>${t.reportSubtitle}</p>
        </div>
        <div class="score-badge">
          <div class="score-num">${totalScore}/100</div>
          <div class="score-label">${tier} ${t.tier}</div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item"><label>${t.clientName}</label><span>${fullName}</span></div>
        <div class="info-item"><label>${t.propertyFacing}</label><span>${inputs.plotFacing || 'N/A'}</span></div>
        <div class="info-item"><label>${t.plotGeometry}</label><span>${inputs.plotShape || 'Square'}</span></div>
        <div class="info-item"><label>${t.contactPhone}</label><span>${phone}</span></div>
        <div class="info-item"><label>${t.emailAddress}</label><span>${email}</span></div>
        <div class="info-item"><label>${t.reportDate}</label><span>${formattedDate}</span></div>
      </div>

      ${criticalDoshas && criticalDoshas.length > 0 ? `
        <div class="dosha-box">
          <h3>${t.criticalFlawsTitle} (${criticalDoshas.length})</h3>
          <ul class="dosha-list">
            ${criticalDoshas.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="section-title">${t.breakdownTitle}</div>
      <table>
        <thead>
          <tr>
            <th>${t.tableZone}</th>
            <th>${t.tablePlacement}</th>
            <th>${t.tableStatus}</th>
            <th>${t.tableScore}</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(breakdown).map(k => {
            const item = breakdown[k];
            const val = inputs[k === 'entrance' ? 'mainEntrance' : k] || 'Selected';
            return `
              <tr>
                <td><strong>${k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')}</strong></td>
                <td>${val}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td><strong>${item.score}</strong> / ${item.max}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="section-title">${t.remediesTitle}</div>
      <div class="remedies-container">${finalRemediesText}</div>

      <div class="consultant-card">
        <div class="consultant-info">
          <h4>${t.consultantTitle}</h4>
          <p>${t.consultantDesc}</p>
        </div>
        <div class="consultant-phone">+91 81403 95693</div>
      </div>

      <div class="footer">
        ${t.footerText} • Page 1
      </div>
    </div>
  `;

  // 1. Direct PDF File Download via html2pdf (NO POP-UP, NO ABOUT:BLANK WINDOW!)
  if (window.html2pdf) {
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '794px';
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);

    const opt = {
      margin: [8, 8, 8, 8],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await window.html2pdf().set(opt).from(tempContainer).save();
      document.body.removeChild(tempContainer);
      return;
    } catch (pdfErr) {
      console.warn('html2pdf save error, using iframe print fallback:', pdfErr);
      if (tempContainer.parentNode) document.body.removeChild(tempContainer);
    }
  }

  // 2. In-Page Hidden iframe Fallback (NO ABOUT:BLANK WINDOW!)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title></title></head><body style="margin:0;padding:0;">${htmlContent}</body></html>`);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      if (iframe.parentNode) document.body.removeChild(iframe);
    }, 1000);
  }, 300);
};
