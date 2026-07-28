/**
 * Multi-lingual Vastu Remedies PDF Generator
 * Cross-platform: Mobile-friendly PDF generation & download
 * Priority for backend AI response, clean branding & zero unnecessary blank pages.
 */

const translations = {
  en: {
    reportTitle: 'VASTU HARMONY REMEDIAL REPORT',
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
    remediesTitle: 'EXPERT TAILORED NON-DEMOLITION REMEDIES',
    consultantTitle: 'NEED 1-ON-1 ARCHITECTURAL CONSULTATION?',
    consultantDesc: 'Speak with Senior Vastu Architect for copper wire & pyramid installation.',
    consultantBtn: 'Direct Call / WhatsApp',
    footerText: 'Vastu Harmony Architectural Evaluation System • Confidential & Proprietary Report'
  },
  hi: {
    reportTitle: 'वास्तु हारमनी निवारण रिपोर्ट',
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
    remediesTitle: 'वास्तु विशेषज्ञ बिना तोड़-फोड़ के उपाय',
    consultantTitle: '1-ऑन-1 वास्तु विशेषज्ञ परामर्श चाहिए?',
    consultantDesc: 'तांबे के तार और पिरामिड स्थापना के लिए वरिष्ठ वास्तु विशेषज्ञ से बात करें।',
    consultantBtn: 'कॉल या व्हाट्सएप',
    footerText: 'वास्तु हारमनी मूल्यांकन प्रणाली • गोपनीय एवं व्यक्तिगत रिपोर्ट'
  },
  gu: {
    reportTitle: 'વાસ્તુ હાર્મની નિવારણ રિપોર્ટ',
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
    remediesTitle: 'તોડફોડ વિનાના વાસ્તુ નિષ્ણાત ઉપાયો',
    consultantTitle: '1-ઓન-1 વાસ્તુ નિષ્ણાત સલાહ જોઈએ છે?',
    consultantDesc: 'તાંબાના તાર અને પિરામિડ સ્થાપના માટે વરિષ્ઠ વાસ્તુ નિષ્ણાત સાથે વાત કરો.',
    consultantBtn: 'કૉલ અથવા વૉટ્સએપ',
    footerText: 'વાસ્તુ હાર્મની મૂલ્યાંકન સિસ્ટમ • ગોપનીય અને વ્યક્તિગત રિપોર્ટ'
  }
};

const buildDefaultRemediesText = ({ language = 'en', totalScore = 70, tier = 'Moderate', inputs = {}, criticalDoshas = [], defects = [] }) => {
  const additionalBedrooms = inputs.additionalBedrooms || [];
  const additionalBathrooms = inputs.additionalBathrooms || [];
  const additionalKitchens = inputs.additionalKitchens || [];

  if (language === 'hi') {
    const remedies = [];
    remedies.push(`1. मुख्य वास्तु विश्लेषण:\nआपकी संपत्ति ने 100 में से ${totalScore} का वास्तु स्कोर प्राप्त किया है। बुनियादी वास्तु दिशाएं अनुकूल हैं, फिर भी बिना किसी तोड़-फोड़ के सकारात्मक ऊर्जा प्रवाह बढ़ाने हेतु निम्नलिखित उपाय सुझाए जाते हैं।`);

    if (criticalDoshas && criticalDoshas.length > 0) {
      remedies.push(`2. गंभीर वास्तु दोष निवारण:\n${criticalDoshas.map(d => `• [${d}]: चौखट के नीचे 3mm तांबे की पट्टी लगाएं। प्रभावित कोने में 9 सीसा पिरामिड स्थापित करें।`).join('\n')}`);
    } else {
      remedies.push(`2. गंभीर वास्तु दोष निवारण:\n• कोई गंभीर संरचनात्मक दोष नहीं पाया गया। मुख्य ऊर्जा क्षेत्र सुरक्षित हैं।`);
    }

    const roomRemedies = [];
    const plotShape = inputs.plotShape || 'Square';
    if (plotShape === 'Irregular') {
      roomRemedies.push(`• भूखंड आकार (अनियमित): भूखंड की बाहरी सीमा पर पीतल की पिरामिड स्ट्रिप लगाएं। कटे हुए कोनों में 4 सीसा (Lead) पिरामिड स्थापित करें।`);
    }

    const kitchen = inputs.kitchen || 'SE';
    if (kitchen !== 'SE') {
      roomRemedies.push(`• मुख्य रसोई घर (${kitchen}): गैस चूल्हे के नीचे पीला जैसलमेर संगमरमर का पत्थर रखें। रसोई में नीले या काले रंग का उपयोग न करें।`);
    } else {
      roomRemedies.push(`• मुख्य रसोई घर (दक्षिण-पूर्व): आदर्श अग्नि कोण! रसोई को साफ रखें और पूर्व दिशा की ओर मुंह करके खाना बनाएं।`);
    }

    additionalKitchens.forEach((dir, idx) => {
      if (dir !== 'SE') {
        roomRemedies.push(`• रसोई ${idx + 2} (${dir}): गैस चूल्हे के नीचे पीला संगमरमर रखें। अग्नि तत्व संतुलन के लिए दक्षिण-पूर्व कोने में लाल बल्ब लगाएं।`);
      } else {
        roomRemedies.push(`• रसोई ${idx + 2} (दक्षिण-पूर्व): उत्तम अग्नि कोण स्थान! स्वच्छता बनाए रखें।`);
      }
    });

    const bedroom = inputs.masterBedroom || 'SW';
    if (bedroom !== 'SW') {
      roomRemedies.push(`• मुख्य शयनकक्ष (${bedroom}): सोते समय सिर दक्षिण या पश्चिम दिशा की ओर रखें। लोहे के बजाय लकड़ी के बिस्तर का प्रयोग करें।`);
    }

    additionalBedrooms.forEach((dir, idx) => {
      if (dir !== 'SW' && !['S', 'W'].includes(dir)) {
        roomRemedies.push(`• शयनकक्ष ${idx + 2} (${dir}): सोते समय सिर दक्षिण दिशा में रखें। दीवारों पर हल्के पीले या क्रीम रंग का उपयोग करें। लोहे के पलंग से बचें।`);
      } else {
        roomRemedies.push(`• शयनकक्ष ${idx + 2} (${dir}): अच्छी दिशा! गहरे रंग की पर्दे लगाएं और शांत वातावरण बनाए रखें।`);
      }
    });

    const bathroom = inputs.bathroom || 'NW';
    if (bathroom === 'NE') {
      roomRemedies.push(`• मुख्य शौचालय (उत्तर-पूर्व): दरवाजे की चौखट पर तांबे की पट्टी लगाएं। अंदर कांच के बर्तन में समुद्री नमक रखें और दरवाजा हमेशा बंद रखें।`);
    } else if (!['NW', 'W'].includes(bathroom)) {
      roomRemedies.push(`• मुख्य शौचालय (${bathroom}): दरवाजा हमेशा बंद रखें। वेंटिलेशन के लिए एग्जॉस्ट फैन लगाएं।`);
    }

    additionalBathrooms.forEach((dir, idx) => {
      if (dir === 'NE') {
        roomRemedies.push(`• शौचालय ${idx + 2} (उत्तर-पूर्व): ⚠️ गंभीर दोष! चौखट के नीचे तांबे की पट्टी लगाएं। अंदर कांच के बर्तन में समुद्री नमक रखें। दरवाजा हमेशा बंद रखें।`);
      } else if (!['NW', 'W'].includes(dir)) {
        roomRemedies.push(`• शौचालय ${idx + 2} (${dir}): दरवाजा बंद रखें और वेंटिलेशन सुनिश्चित करें। नीले रंग की टाइल्स से बचें।`);
      } else {
        roomRemedies.push(`• शौचालय ${idx + 2} (${dir}): अनुकूल दिशा! स्वच्छता बनाए रखें।`);
      }
    });

    remedies.push(`3. कमरों एवं दिशाओं के विशेष उपाय:\n${roomRemedies.join('\n')}`);
    remedies.push(`4. सामान्य ऊर्जा संतुलन उपाय:\n• उत्तर-पूर्व (ईशान) बालकनी में हरा तुलसी का पौधा लगाएं।\n• शाम के समय कपूर और लौंग का धुंआ करें जिससे नकारात्मक ऊर्जा समाप्त हो।\n• उत्तर-पश्चिम बालकनी में 6 छड़ों वाली पीतल की विंड चाइम लगाएं।`);
    return remedies.join('\n\n');
  }

  if (language === 'gu') {
    const remedies = [];
    remedies.push(`1. મુખ્યાત્મક વાસ્તુ વિશ્લેષણ:\nતમારી મિલકતે 100 માંથી ${totalScore} નો વાસ્તુ સ્કોર મેળવ્યો છે. પ્રાથમિક દિશાઓ અનુકૂળ છે, છતાં પણ કોઈ પણ તોડફોડ વિના હકારાત્મક ઊર્જા વધારવા માટે નીચે મુજબના ઉપાયો સૂચવવામાં આવે છે.`);

    if (criticalDoshas && criticalDoshas.length > 0) {
      remedies.push(`2. ગંભીર વાસ્તુ દોષ નિવારણ:\n${criticalDoshas.map(d => `• [${d}]: ઉંબરા નીચે 3mm તાંબાની પટ્ટી લગાવો. અસરગ્રસ્ત ખૂણામાં 9 સીસા (Lead) પિરામિડ સ્થાપિત કરો.`).join('\n')}`);
    } else {
      remedies.push(`2. ગંભીર વાસ્તુ દોષ નિવારણ:\n• કોઈ ગંભીર માળખાકીય દોષ મળ્યો નથી. મુખ્ય ઊર્જા ક્ષેત્રો સુરક્ષિત છે.`);
    }

    const roomRemedies = [];
    const plotShape = inputs.plotShape || 'Square';
    if (plotShape === 'Irregular') {
      roomRemedies.push(`• પ્લોટનો આકાર (અનિયમિત): પ્લોટની બહારની સીમા પર પિત્તળની પિરામિડ પટ્ટી મૂકો. કપાયેલા ખૂણામાં 4 સીસાના પિરામિડ સ્થાપિત કરો.`);
    }

    const kitchen = inputs.kitchen || 'SE';
    if (kitchen !== 'SE') {
      roomRemedies.push(`• મુખ્ય રસોડું (${kitchen}): ગેસ સગડી નીચે પીળો જેસલમેર આરસપહાણનો પથ્થર મૂકો. રસોડામાં કાળા કે વાદળી રંગનો ઉપયોગ ટાળો.`);
    } else {
      roomRemedies.push(`• મુખ્ય રસોડું (દક્ષિણ-પૂર્વ): ઉત્તમ અગ્નિ કોણ સ્થાન! રસોડું સ્વચ્છ રાખો અને પૂર્વ દિશા તરફ મુખ રાખીને રસોઈ બનાવો.`);
    }

    additionalKitchens.forEach((dir, idx) => {
      if (dir !== 'SE') {
        roomRemedies.push(`• રસોડું ${idx + 2} (${dir}): ગેસ સગડી નીચે પીળો આરસપહાણ મૂકો. અગ્નિ તત્વ સંતુલન માટે દક્ષિણ-પૂર્વ ખૂણામાં લાલ બલ્બ લગાવો.`);
      } else {
        roomRemedies.push(`• રસોડું ${idx + 2} (દક્ષિણ-પૂર્વ): ઉત્તમ અગ્નિ કોણ! સ્વચ્છતા જાળવો.`);
      }
    });

    const bedroom = inputs.masterBedroom || 'SW';
    if (bedroom !== 'SW') {
      roomRemedies.push(`• મુખ્ય બેડરૂમ (${bedroom}): સુતી વખતે માથું દક્ષિણ કે પશ્ચિમ દિશામાં રાખો. લાકડાના પલંગનો જ ઉપયોગ કરો.`);
    }

    additionalBedrooms.forEach((dir, idx) => {
      if (dir !== 'SW' && !['S', 'W'].includes(dir)) {
        roomRemedies.push(`• બેડરૂમ ${idx + 2} (${dir}): સુતી વખતે માથું દક્ષિણ દિશામાં રાખો. દીવાલો પર આછો પીળો કે ક્રીમ રંગ વાપરો. લોખંડના પલંગ ટાળો.`);
      } else {
        roomRemedies.push(`• બેડરૂમ ${idx + 2} (${dir}): સારી દિશા! ઘેરા રંગના પડદા લગાવો અને શાંત વાતાવરણ જાળવો.`);
      }
    });

    const bathroom = inputs.bathroom || 'NW';
    if (bathroom === 'NE') {
      roomRemedies.push(`• મુખ્ય શૌચાલય (ઉત્તર-પૂર્વ): દરવાજાના ઉંબરા નીચે તાંબાની પટ્ટી લગાવો. અંદર કાચના વાસણમાં સિંધવ મીઠું રાખો અને દરવાજો બંધ રાખો.`);
    } else if (!['NW', 'W'].includes(bathroom)) {
      roomRemedies.push(`• મુખ્ય શૌચાલય (${bathroom}): દરવાજો બંધ રાખો. વેન્ટિલેશન માટે એક્ઝોસ્ટ ફેન લગાવો.`);
    }

    additionalBathrooms.forEach((dir, idx) => {
      if (dir === 'NE') {
        roomRemedies.push(`• શૌચાલય ${idx + 2} (ઉત્તર-પૂર્વ): ⚠️ ગંભીર દોષ! ઉંબરા નીચે તાંબાની પટ્ટી લગાવો. અંદર કાચના વાસણમાં સિંધવ મીઠું રાખો. દરવાજો બંધ રાખો.`);
      } else if (!['NW', 'W'].includes(dir)) {
        roomRemedies.push(`• શૌચાલય ${idx + 2} (${dir}): દરવાજો બંધ રાખો અને વેન્ટિલેશન સુનિશ્ચિત કરો. વાદળી ટાઇલ્સ ટાળો.`);
      } else {
        roomRemedies.push(`• શૌચાલય ${idx + 2} (${dir}): અનુકૂળ દિશા! સ્વચ્છતા જાળવો.`);
      }
    });

    remedies.push(`3. ઓરડાઓ અને દિશાઓના ખાસ ઉપાયો:\n${roomRemedies.join('\n')}`);
    remedies.push(`4. સામાન્ય ઊર્જા સંતુલન ઉપાયો:\n• ઉત્તર-પૂર્વ (ઈશાન) ગેલેરીમાં તુલસીનો છોડ વાવો.\n• સાંજના સમયે કપૂરનો ધૂપ કરો જેથી નકારાત્મક ઊર્જા દૂર થાય.\n• ઉત્તર-પશ્ચિમ ગેલેરીમાં 6 સળિયા વાળી પિત્તળની વિન્ડ ચાઇમ લગાવો.`);
    return remedies.join('\n\n');
  }

  // English default
  const remedies = [];
  remedies.push(`1. EXECUTIVE VASTU SUMMARY:\nYour property achieved a Vastu Harmony Score of ${totalScore}/100 (${tier} Alignment). While primary directional axes show functional potential, targeted elemental rectifications are recommended to harmonize energy flow without any structural demolition.`);

  if (criticalDoshas && criticalDoshas.length > 0) {
    remedies.push(`2. CRITICAL DOSHA RECTIFICATIONS:\n${criticalDoshas.map(d => `• [${d}]: Install a 3mm copper strip along the threshold boundary to seal energy leakage. Place a lead pyramid grid in the affected corner.`).join('\n')}`);
  } else {
    remedies.push(`2. CRITICAL DOSHA RECTIFICATIONS:\n• No severe structural flaws detected. Core energetic zones remain stable.`);
  }

  const roomRemedies = [];
  const plotShape = inputs.plotShape || 'Square';
  if (plotShape === 'Irregular') {
    roomRemedies.push(`• Plot Shape (Irregular): Place brass pyramid strips along the property boundary line to symbolically square the plot. Install 4 lead pyramids at the sharpest corners to suppress disharmonious energy.`);
  }

  const kitchen = inputs.kitchen || 'SE';
  if (kitchen !== 'SE') {
    roomRemedies.push(`• Main Kitchen (${kitchen}): Place a yellow marble slab under the stove and avoid blue or black granite counter tops to resolve Fire vs Water conflict.`);
  } else {
    roomRemedies.push(`• Main Kitchen (South-East): Ideal Agni Kona placement! Keep counter clutter-free and cook facing East.`);
  }

  additionalKitchens.forEach((dir, idx) => {
    if (dir !== 'SE') {
      roomRemedies.push(`• Kitchen ${idx + 2} (${dir}): Place a yellow marble slab under the cooking area. Install a red bulb in the South-East corner to balance the Fire element.`);
    } else {
      roomRemedies.push(`• Kitchen ${idx + 2} (South-East): Ideal Agni Kona placement! Maintain cleanliness.`);
    }
  });

  const bedroom = inputs.masterBedroom || 'SW';
  if (bedroom !== 'SW') {
    roomRemedies.push(`• Master Bedroom (${bedroom}): Sleep with your head pointing towards South or West. Use a solid wooden bed (no metal frame) and warm earth-tone decor (beige, terracotta).`);
  }

  additionalBedrooms.forEach((dir, idx) => {
    if (dir !== 'SW' && !['S', 'W'].includes(dir)) {
      roomRemedies.push(`• Bedroom ${idx + 2} (${dir}): Sleep with head towards South. Use light yellow or cream wall colors. Avoid metal bed frames and place a Vastu pyramid under the bed.`);
    } else {
      roomRemedies.push(`• Bedroom ${idx + 2} (${dir}): Good placement! Use dark-tone curtains and maintain a calm atmosphere.`);
    }
  });

  const bathroom = inputs.bathroom || 'NW';
  if (bathroom === 'NE') {
    roomRemedies.push(`• Main Bathroom (North-East): Install a copper strip under the door threshold. Place a bowl of raw rock salt inside and keep the door closed at all times.`);
  } else if (!['NW', 'W'].includes(bathroom)) {
    roomRemedies.push(`• Main Bathroom (${bathroom}): Keep the door closed at all times. Install an exhaust fan for proper ventilation.`);
  }

  additionalBathrooms.forEach((dir, idx) => {
    if (dir === 'NE') {
      roomRemedies.push(`• Bathroom ${idx + 2} (North-East): ⚠️ Critical Flaw! Install a copper strip under the threshold. Place raw rock salt in a glass bowl inside. Keep door permanently closed.`);
    } else if (!['NW', 'W'].includes(dir)) {
      roomRemedies.push(`• Bathroom ${idx + 2} (${dir}): Keep door closed and ensure proper ventilation. Avoid blue-colored tiles.`);
    } else {
      roomRemedies.push(`• Bathroom ${idx + 2} (${dir}): Favorable placement! Maintain cleanliness.`);
    }
  });

  remedies.push(`3. TAILORED ROOM & SPATIAL REMEDIES:\n${roomRemedies.join('\n')}`);
  remedies.push(`4. GENERAL ELEMENTAL HARMONIZATION:\n• Place a live Tulsi (Holy Basil) plant in the North-East or East balcony to invite positive Prana.\n• Diffuse natural camphor with lavender essential oil during evening hours for spatial aura cleansing.\n• Hang a 6-rod hollow metal wind chime in the North-West zone to keep stagnant air moving.`);
  return remedies.join('\n\n');
};

/**
 * Dynamically load html2pdf.js bundle from CDN if not already loaded
 */
const loadHtml2PdfScript = () => {
  return new Promise((resolve) => {
    if (window.html2pdf) return resolve(window.html2pdf);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
};

/**
 * Build the PDF report as a real DOM element tree with fully inline styles.
 * This avoids the broken "full HTML document inside innerHTML" approach
 * where <style> tags get stripped by the browser parser.
 */
const buildReportElement = ({
  t, fullName, email, phone, totalScore, tier, inputs, breakdown,
  criticalDoshas, formattedDate, scoreColor, remediesHtml
}) => {
  const el = document.createElement('div');
  el.id = 'vastu-pdf-render';
  el.style.cssText = 'width:750px;margin:0 auto;padding:12px;background:#ffffff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;box-sizing:border-box;';

  el.innerHTML = `
    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);color:#fff;padding:14px 18px;border-radius:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:15px;font-weight:800;letter-spacing:0.2px;margin:0;">${t.reportTitle}</div>
        <div style="font-size:9px;color:#cbd5e1;margin-top:2px;">${t.reportSubtitle}</div>
      </div>
      <div style="background:rgba(79,70,229,0.2);border:1px solid rgba(199,210,254,0.4);padding:6px 12px;border-radius:8px;text-align:center;min-width:75px;">
        <div style="font-size:20px;font-weight:900;color:${scoreColor};">${totalScore}/100</div>
        <div style="font-size:7px;text-transform:uppercase;letter-spacing:0.8px;color:#e2e8f0;font-weight:700;margin-top:1px;">${tier} ${t.tier}</div>
      </div>
    </div>

    <!-- INFO GRID -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:8px;margin-bottom:10px;">
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.clientName}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${fullName}</div></div>
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.propertyFacing}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${inputs.plotFacing || 'N/A'}</div></div>
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.plotGeometry}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${inputs.plotShape || 'Square'}</div></div>
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.contactPhone}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${phone}</div></div>
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.emailAddress}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${email}</div></div>
      <div><div style="font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:1px;">${t.reportDate}</div><div style="font-weight:700;color:#0f172a;font-size:10px;">${formattedDate}</div></div>
    </div>

    ${criticalDoshas && criticalDoshas.length > 0 ? `
    <!-- DOSHAS -->
    <div style="background:#fff1f2;border:1px solid #fecdd3;padding:10px;border-radius:8px;margin-bottom:10px;">
      <div style="font-size:9px;font-weight:800;color:#be123c;text-transform:uppercase;margin-bottom:4px;">${t.criticalFlawsTitle} (${criticalDoshas.length})</div>
      <ul style="margin:0;padding-left:14px;color:#9f1239;font-size:9px;font-weight:600;">
        ${criticalDoshas.map(d => `<li style="margin-bottom:2px;">${d}</li>`).join('')}
      </ul>
    </div>` : ''}

    <!-- BREAKDOWN TABLE -->
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:2px;margin:10px 0 6px 0;">${t.breakdownTitle}</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9px;">
      <thead>
        <tr>
          <th style="background:#4f46e5;color:#fff;font-weight:700;text-align:left;padding:4px 6px;text-transform:uppercase;font-size:7px;">${t.tableZone}</th>
          <th style="background:#4f46e5;color:#fff;font-weight:700;text-align:left;padding:4px 6px;text-transform:uppercase;font-size:7px;">${t.tablePlacement}</th>
          <th style="background:#4f46e5;color:#fff;font-weight:700;text-align:left;padding:4px 6px;text-transform:uppercase;font-size:7px;">${t.tableStatus}</th>
          <th style="background:#4f46e5;color:#fff;font-weight:700;text-align:left;padding:4px 6px;text-transform:uppercase;font-size:7px;">${t.tableScore}</th>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(breakdown).map((k, i) => {
          const item = breakdown[k];
          const val = inputs[k === 'entrance' ? 'mainEntrance' : k] || 'Selected';
          const bgColor = i % 2 === 1 ? '#f8fafc' : '#ffffff';
          const statusColor = item.status === 'Auspicious' ? 'background:#dcfce7;color:#14532d' : item.status === 'Neutral' ? 'background:#fef3c7;color:#78350f' : 'background:#ffe4e6;color:#881337';
          const statusLabel = item.status === 'Auspicious' ? t.auspicious : item.status === 'Neutral' ? t.neutral : t.malefic;
          return `<tr>
            <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;color:#334155;background:${bgColor};"><strong>${k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')}</strong></td>
            <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;color:#334155;background:${bgColor};">${val}</td>
            <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;color:#334155;background:${bgColor};"><span style="padding:1px 6px;border-radius:9999px;font-weight:700;font-size:8px;display:inline-block;${statusColor};">${statusLabel}</span></td>
            <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;color:#334155;background:${bgColor};"><strong>${item.score}</strong> / ${item.max}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>

    <!-- REMEDIES -->
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:2px;margin:10px 0 6px 0;">${t.remediesTitle}</div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:8px;margin-bottom:10px;">${remediesHtml}</div>

    <!-- CONSULTANT CARD -->
    <div style="background:#eef2ff;border:1px solid #c7d2fe;padding:10px 14px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
      <div>
        <div style="font-size:10px;font-weight:800;color:#4338ca;text-transform:uppercase;margin:0;">${t.consultantTitle}</div>
        <div style="font-size:8px;color:#3730a3;margin:1px 0 0 0;">${t.consultantDesc}</div>
      </div>
      <div style="font-size:11px;font-weight:900;color:#4338ca;background:#fff;padding:3px 8px;border-radius:5px;border:1px solid #c7d2fe;white-space:nowrap;">+91 81403 95693</div>
    </div>

    <!-- FOOTER -->
    <div style="margin-top:10px;text-align:center;font-size:7px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:6px;">${t.footerText}</div>
  `;

  return el;
};

/**
 * Generate a Vastu Remedies PDF Report.
 * Works identically on phones and laptops by rendering a fixed-width
 * DOM element with all inline styles, then capturing it with html2canvas.
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
  const t = translations[language] || translations.en;

  // PRIORITY: Prioritize backend AI remediesText if available
  let rawText = (remediesText && remediesText.trim().length > 20)
    ? remediesText
    : buildDefaultRemediesText({ language, totalScore, tier, inputs, criticalDoshas, defects, breakdown });

  // Clean out any occurrence of "Gemini" from final remedies output
  const finalRemediesText = rawText.replace(/gemini/gi, 'Vastu Harmony');

  const formattedDate = new Date(createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const scoreColor = totalScore >= 70 ? '#10b981' : totalScore >= 40 ? '#f59e0b' : '#ef4444';

  // Format remedies text into inline-styled HTML
  const remediesHtml = finalRemediesText
    .split('\n\n')
    .map(block => {
      return block.split('\n').map(line => {
        if (line.match(/^\d+\.\s/)) return `<div style="margin:8px 0 3px 0;color:#1e293b;font-size:11px;font-weight:700;">${line}</div>`;
        if (line.startsWith('•')) return `<div style="margin:2px 0 2px 10px;color:#334155;font-size:10px;line-height:1.4;">${line}</div>`;
        if (line.trim()) return `<div style="margin:2px 0;color:#334155;font-size:10px;line-height:1.4;">${line}</div>`;
        return '';
      }).join('');
    }).join('');

  const fileName = `Vastu_Remedies_Report_${(fullName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  // Build the report as a real DOM element with inline styles
  const reportEl = buildReportElement({
    t, fullName, email, phone, totalScore, tier, inputs, breakdown,
    criticalDoshas, formattedDate, scoreColor, remediesHtml
  });

  // Create a wrapper that is on-screen but invisible to the user.
  // html2canvas needs the element to be in the normal document flow
  // to measure layout correctly. We use opacity:0 + overflow:hidden
  // so it's invisible but still laid out by the browser engine.
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;left:0;top:0;width:750px;opacity:0;pointer-events:none;z-index:-1;overflow:hidden;';
  wrapper.appendChild(reportEl);
  document.body.appendChild(wrapper);

  // Allow the browser one frame to lay out the element
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const html2pdf = await loadHtml2PdfScript();
    if (html2pdf) {
      await html2pdf()
        .set({
          margin: [6, 6, 6, 6],
          filename: fileName,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 750,
            windowWidth: 750
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        })
        .from(reportEl)
        .save();

      document.body.removeChild(wrapper);
      return;
    }
  } catch (pdfErr) {
    console.warn('html2pdf generation failed, using fallback:', pdfErr);
  }

  // Cleanup wrapper from the primary attempt
  if (document.body.contains(wrapper)) {
    document.body.removeChild(wrapper);
  }

  // Fallback: open a new print-ready window (works on desktop, fallback HTML download on mobile)
  const printHtml = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=750">
  <title>${t.reportTitle} - ${fullName}</title>
  <style>
    @page { size: A4; margin: 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #fff; margin: 0; padding: 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>${reportEl.outerHTML}</body>
</html>`;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

  if (isMobile) {
    const blob = new Blob([printHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vastu_Remedies_Report_${(fullName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      setTimeout(() => { try { printWindow.print(); } catch (e) { console.error(e); } }, 500);
    }
  }
};

