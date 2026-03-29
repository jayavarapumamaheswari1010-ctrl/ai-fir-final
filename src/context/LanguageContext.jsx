import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const fallbackData = {
  en: {
    welcomeTitle: "Welcome to Official Reporting.",
    welcomeSubtitle: "Choose your language to begin filing your report. Our digital assistant will guide you through the process securely.",
    proceed: "Proceed to Report ->",
    secure: "Secure Government Portal",
    chatTitle: "Tell me what happened today.",
    reviewTitle: "Review Your Draft",
    reviewSubtitle: "Please verify the information extracted from your statement. This draft will be used to generate your official First Information Report.",
    incidentDetails: "Incident Details",
    incidentType: "Incident Type",
    dateTime: "Date & Time",
    location: "Location",
    description: "Description",
    suspect: "Suspect Details",
    reportedItems: "Reported Items",
    submit: "Submit Report",
    edit: "Edit",
    successTitle: "FIR Successfully Registered",
    successDesc: "Your formal report has been officially timestamped and securely archived in the state database.",
    legalStatus: "LEGAL STATUS\nACTIVE",
    download: "Download Copy",
    share: "Share",
    home: "Home",
    bottomNote: "An SMS and Email confirmation has been sent to your registered contact details. A local officer will review the evidence within 24 business hours.",
    
    // New UI items
    personalDetails: "Personal Details",
    fatherSpouse: "Father/Spouse Name",
    mobile: "Mobile Number",
    address: "Address",
    witness: "Witness Details",
    suspectWitness: "Suspect & Witness",
    
    // AI Questions
    q_name: "1. What is your full name?",
    q_father_name: "2. What is your father or spouse name?",
    q_mobile: "3. What is your mobile number?",
    q_address: "4. What is your address?",
    q_type: "5. What type of incident happened? (detect theft, lost, cyber fraud)",
    q_date: "6. When did it happen?",
    q_location: "7. Where did it happen?",
    q_desc: "8. Describe the incident clearly.",
    q_suspect: "9. Any suspect details?",
    q_witness: "10. Any witness details?",
    q_out: "Thank you for the information. I have compiled your draft report."
  },
  hi: {
    welcomeTitle: "आधिकारिक रिपोर्टिंग में आपका स्वागत है।",
    welcomeSubtitle: "अपनी रिपोर्ट दर्ज करने के लिए अपनी भाषा चुनें। हमारा डिजिटल सहायक आपको प्रक्रिया के माध्यम से सुरक्षित रूप से मार्गदर्शन करेगा।",
    proceed: "रिपोर्ट के लिए आगे बढ़ें ->",
    secure: "सुरक्षित सरकारी पोर्टल",
    chatTitle: "मुझे बताएं आज क्या हुआ।",
    reviewTitle: "अपने ड्राफ्ट की समीक्षा करें",
    reviewSubtitle: "कृपया अपने बयान से निकाली गई जानकारी की पुष्टि करें। इस ड्राफ्ट का उपयोग आपकी आधिकारिक प्रथम सूचना रिपोर्ट (FIR) उत्पन्न करने के लिए किया जाएगा।",
    incidentDetails: "घटना का विवरण",
    incidentType: "घटना का प्रकार",
    dateTime: "दिनांक और समय",
    location: "स्थान",
    description: "विवरण",
    suspect: "संदिग्ध विवरण",
    reportedItems: "रिपोर्ट किए गए आइटम",
    submit: "रिपोर्ट जमा करें",
    edit: "संपादित करें",
    successTitle: "FIR सफलतापूर्वक दर्ज की गई",
    successDesc: "आपकी औपचारिक रिपोर्ट को आधिकारिक तौर पर टाइमस्टैम्प किया गया है और राज्य डेटाबेस में सुरक्षित रूप से संग्रहीत किया गया है।",
    legalStatus: "कानूनी स्थिति\nसक्रिय",
    download: "कॉपी डाउनलोड करें",
    share: "साझा करें",
    home: "होम",
    bottomNote: "आपके पंजीकृत संपर्क विवरण पर एक एसएमएस और ईमेल पुष्टिकरण भेजा गया है। एक स्थानीय अधिकारी 24 व्यावसायिक घंटों के भीतर सबूतों की समीक्षा करेगा।",
    
    // New UI items
    personalDetails: "व्यक्तिगत विवरण",
    fatherSpouse: "पिता/पति का नाम",
    mobile: "मोबाइल नंबर",
    address: "पता",
    witness: "गवाह का विवरण",
    suspectWitness: "संदिग्ध और गवाह",
    
    // AI Questions
    q_name: "1. आपका पूरा नाम क्या है?",
    q_father_name: "2. आपके पिता या पति का नाम क्या है?",
    q_mobile: "3. आपका मोबाइल नंबर क्या है?",
    q_address: "4. आपका पता क्या है?",
    q_type: "5. किस प्रकार की घटना हुई? (चोरी, खोया हुआ, साइबर धोखाधड़ी आदि)",
    q_date: "6. यह कब हुआ?",
    q_location: "7. यह कहाँ हुआ?",
    q_desc: "8. घटना का स्पष्ट रूप से वर्णन करें।",
    q_suspect: "9. कोई संदिग्ध विवरण?",
    q_witness: "10. कोई गवाह का विवरण?",
    q_out: "जानकारी के लिए धन्यवाद। मैंने आपकी ड्राफ्ट रिपोर्ट संकलित कर ली है।"
  },
  te: {
    welcomeTitle: "అధికారిక రిపోర్టింగ్‌కు స్వాగతం.",
    welcomeSubtitle: "మీ నివేదికను దాఖలు చేయడానికి మీ భాషను ఎంచుకోండి. మా డిజిటల్ అసిస్టెంట్ మీకు ప్రక్రియ ద్వారా సురక్షితంగా మార్గనిర్దేశం చేస్తారు.",
    proceed: "నివేదికకు కొనసాగండి ->",
    secure: "సురక్షిత ప్రభుత్వ పోర్టల్",
    chatTitle: "ఈ రోజు ఏమి జరిగిందో చెప్పండి.",
    reviewTitle: "మీ డ్రాఫ్ట్‌ను సమీక్షించండి",
    reviewSubtitle: "దయచేసి మీ వాంగ్మూలం నుండి తీసుకోబడిన సమాచారాన్ని ధృవీకరించండి. ఈ డ్రాఫ్ట్ మీ అధికారిక ప్రథమ సమాచార నివేదిక (FIR) ని రూపొందించడానికి ఉపయోగించబడుతుంది.",
    incidentDetails: "సంఘటన వివరాలు",
    incidentType: "సంఘటన రకం",
    dateTime: "తేదీ & సమయం",
    location: "స్థానం",
    description: "వివరణ",
    suspect: "అనుమానితుని వివరాలు",
    reportedItems: "నివేదించబడిన అంశాలు",
    submit: "నివేదికను సమర్పించండి",
    edit: "సవరించు",
    successTitle: "FIR విజయవంతంగా నమోదు చేయబడింది",
    successDesc: "మీ అధికారిక నివేదిక అధికారికంగా టైమ్‌స్టాంప్ చేయబడింది మరియు రాష్ట్ర డేటాబేస్‌లో సురక్షితంగా ఆర్కైవ్ చేయబడింది.",
    legalStatus: "చట్టపరమైన స్థితి\nక్రియాశీలం",
    download: "కాపీని డౌన్‌లోడ్ చేయండి",
    share: "భాగస్వామ్యం చేయండి",
    home: "హోమ్",
    bottomNote: "మీ నమోదిత సంప్రదింపు వివరాలకు SMS మరియు ఇమెయిల్ నిర్ధారణ పంపబడింది. స్థానిక అధికారి 24 పని గంటలలోపు సాక్ష్యాలను సమీక్షిస్తారు.",
    
    // New UI items
    personalDetails: "వ్యక్తిగత వివరాలు",
    fatherSpouse: "తండ్రి/భర్త పేరు",
    mobile: "మొబైల్ నంబర్",
    address: "చిరునామా",
    witness: "సాక్షి వివరాలు",
    suspectWitness: "అనుమానితుడు & సాక్షి",
    
    // AI Questions
    q_name: "1. మీ పూర్తి పేరు ఏమిటి?",
    q_father_name: "2. మీ తండ్రి లేదా భర్త పేరు ఏమిటి?",
    q_mobile: "3. మీ మొబైల్ నంబర్ ఏమిటి?",
    q_address: "4. మీ చిరునామా ఏమిటి?",
    q_type: "5. ఎలాంటి సంఘటన జరిగింది? (దొంగతనం, తప్పిపోయినది, సైబర్ మోసం మొదలైనవి)",
    q_date: "6. ఇది ఎప్పుడు జరిగింది?",
    q_location: "7. ఇది ఎక్కడ జరిగింది?",
    q_desc: "8. సంఘటనను స్పష్టంగా వివరించండి.",
    q_suspect: "9. ఏవైనా అనుమానిత వివరాలు ఉన్నాయా?",
    q_witness: "10. సాక్షి వివరాలు ఏమైనా ఉన్నాయా?",
    q_out: "సమాచారం అందించినందుకు ధన్యవాదాలు. నేను మీ ముసాయిదా నివేదికను సంకలనం చేసాను."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const t = (key) => {
    return fallbackData[language][key] || fallbackData['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
