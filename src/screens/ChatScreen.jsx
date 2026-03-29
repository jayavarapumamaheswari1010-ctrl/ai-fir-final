import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mic, Square, Play, ArrowLeft, Send, ShieldCheck, User, MapPin, Volume2 } from 'lucide-react';

export default function ChatScreen({ firData, setFirData }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const questions = [
    { id: 'name', text: t('q_name') },
    { id: 'father_name', text: t('q_father_name') },
    { id: 'mobile', text: t('q_mobile') },
    { id: 'address', text: t('q_address') },
    { id: 'incident_type', text: t('q_type') },
    { id: 'date_time', text: t('q_date') },
    { id: 'location', text: t('q_location') },
    { id: 'description', text: t('q_desc') },
    { id: 'suspect', text: t('q_suspect') },
    { id: 'witness', text: t('q_witness') },
    { id: 'done', text: t('q_out') }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: questions[0].text }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (text, onEndCallback) => {
    if (window.currentAudio) {
      window.currentAudio.pause();
    }
    window.speechSynthesis.cancel(); // Cancel any native speech

    setIsAiSpeaking(true);
    const cleanText = text.replace(/^\d+\.\s*/, '');
    
    // Convert generic language map to what gTTS uses
    const tl = language === 'hi' ? 'hi' : language === 'te' ? 'te' : 'en-US';
    
    // Attempt to use Google TTS endpoint
    const url = `https://translate.googleapis.com/translate_tts?client=tw-ob&ie=UTF-8&tl=${tl}&q=${encodeURIComponent(cleanText)}`;
    
    window.currentAudio = new Audio(url);
    
    window.currentAudio.onended = () => {
      setIsAiSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    window.currentAudio.play().catch(e => {
        console.warn("Google TTS failed or autoplay blocked, falling back to Native SpeechSynthesis:", e);
        
        // Fallback to Native Browser Speech API
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
        
        utterance.onend = () => {
          setIsAiSpeaking(false);
          if (onEndCallback) onEndCallback();
        };
        
        utterance.onerror = (err) => {
          console.error("Native SpeechSynthesis failed:", err);
          setIsAiSpeaking(false);
          if (onEndCallback) onEndCallback(); // trigger callback anyway
        };
        
        window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    
    // Auto-speak the first question on load
    const timer = setTimeout(() => {
      speakText(questions[0].text, () => {
        if (recognitionRef.current) {
          setIsRecording(true);
          try { recognitionRef.current.start(); } catch (e) { console.log("Auto-start mic blocked by browser", e); }
        }
      });
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  const replayCurrentQuestion = () => {
    const currentQ = messages.filter(m => m.sender === 'bot').pop();
    if (currentQ) {
      speakText(currentQ.text);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // If mic is turned off and we have text, auto-send it
    if (!isRecording && inputText.trim() !== '') {
      handleSend();
    }
  }, [isRecording]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      const langMap = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update input text with what's spoken so far
        setInputText((prev) => (finalTranscript ? finalTranscript : interimTranscript));
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  const detectIncidentType = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('stole') || lowerText.includes('theft') || lowerText.includes('robbed') || lowerText.includes('చోరీ') || lowerText.includes('चोरी')) {
      return 'Theft';
    } else if (lowerText.includes('lost') || lowerText.includes('missing') || lowerText.includes('खो गया') || lowerText.includes('పోగొట్టుకున్నాను')) {
      return 'Lost Item';
    } else if (lowerText.includes('fraud') || lowerText.includes('scam') || lowerText.includes('bank') || lowerText.includes('धోఖ') || lowerText.includes('మోసం')) {
      return 'Cyber Fraud';
    }
    return 'Other';
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    processMessage(inputText);
  };

  const processMessage = async (text) => {
    const userMessage = text;
    setInputText('');
    
    // Stop mic if user manually typed and sent a response while it was active
    if (isRecording) {
      setIsRecording(false);
      try { recognitionRef.current?.stop(); } catch(e) {}
    }
    
    setMessages(prev => [...prev, { sender: 'user', text: userMessage.split('|')[0] }]);
    
    // Save data based on current step
    const currentQ = questions[currentStep];
    const newFirData = { ...firData };
    
    if (currentQ.id === 'incident_type') {
      const detected = detectIncidentType(userMessage);
      newFirData[currentQ.id] = detected;
      // We can also store the raw user response in description as a starting point
      newFirData.description = userMessage + ". ";
    } else if (currentQ.id === 'location' && userMessage.toLowerCase().includes('gps')) {
      // Mock GPS
      newFirData[currentQ.id] = "Current GPS Location (Lat: 17.3850, Long: 78.4867)";
    } else if (currentQ.id !== 'done') {
      if (currentQ.id === 'description') {
        newFirData.description += userMessage;
      } else {
        newFirData[currentQ.id] = userMessage;
      }
    }
    
    setFirData(newFirData);
    
    // Move to next question
    if (currentStep < questions.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const nextPrompt = questions[currentStep + 1].text;
        setMessages(prev => [...prev, { sender: 'bot', text: nextPrompt }]);
        
        const isFinal = currentStep + 1 === questions.length - 1;
        speakText(nextPrompt, () => {
          if (!isFinal && recognitionRef.current) {
            setIsRecording(true);
            try { recognitionRef.current.start(); } catch (e) { console.log("Auto-start mic blocked by browser", e); }
          }
        });
        
        setCurrentStep(prev => prev + 1);
        
        if (isFinal) {
          // It's the "done" message, navigate automatically after a short delay
          setTimeout(() => {
             navigate('/review');
          }, 2000);
        }
      }, 1000);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      if (recognitionRef.current) {
        setInputText(''); // Clear existing input before recording
        setIsRecording(true);
        recognitionRef.current.start();
      } else {
        alert("Microphone & Speech recognition is not supported in this browser.");
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const handleGPS = () => {
    if ("geolocation" in navigator) {
      setIsTyping(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsTyping(false);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.02},${lat-0.02},${lon+0.02},${lat+0.02}&layer=mapnik&marker=${lat},${lon}`;
          const locStr = `Detected GPS: ${lat.toFixed(4)}, ${lon.toFixed(4)}|${mapUrl}`;
          processMessage(locStr);
        },
        (error) => {
          setIsTyping(false);
          alert("Could not get GPS location. Please type manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const currentMainQuestion = messages.filter(m => m.sender === 'bot').pop()?.text;

  return (
    <div className="chat-screen">
      <div className="app-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-title">CIVIC GUARDIAN</span>
        <div className="profile-icon">
          <User size={18} />
        </div>
      </div>

      <div className="chat-history">
        <div className="ai-avatar-container">
          {isAiSpeaking && (
            <div className="soundwave-container">
              <div className="soundwave-ring"></div>
              <div className="soundwave-ring"></div>
              <div className="soundwave-ring"></div>
            </div>
          )}
          <img src="/police_ai.png" alt="Police Agent" className={`ai-avatar ${isAiSpeaking ? 'speaking' : 'idle'}`} />
        </div>
        
        {currentStep <= 1 && (
           <div className="greeting-bubble">
              Hi, I am your Police AI Assistant. How can I help you today?
           </div>
        )}

        {/* We format it nicely according to the UI: large text for bot if it's the latest */}
        {messages.map((msg, index) => {
          const isLatestBot = msg.sender === 'bot' && index === messages.lastIndexOf(messages.filter(m => m.sender === 'bot').pop());
          return (
            <div key={index} className={msg.sender === 'bot' ? 'message-bot' : 'message-user'}>
              {msg.sender === 'bot' ? (
                 <div className="bot-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isLatestBot ? '24px' : '16px', color: isLatestBot ? 'var(--primary-color)' : 'var(--text-secondary)'}}>
                   <span style={{ flex: 1 }}>{msg.text}</span>
                   <button 
                     onClick={() => speakText(msg.text)} 
                     style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     title="Play Audio"
                   >
                     <Volume2 size={isLatestBot ? 22 : 16} />
                   </button>
                 </div>
              ) : (
                msg.text
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="voice-controls">
        <div className="mic-status">
          <ShieldCheck size={16} /> 
          {isRecording ? "Listening..." : "Official Statement Recording"}
        </div>
        
        <div className="mic-button-wrapper">
          {isRecording && <div className="mic-ripple"></div>}
          <button 
            className={`mic-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? <Square fill="white" size={24} /> : <Mic size={28} />}
          </button>
        </div>
        
        <div className="control-actions">
          <button className="icon-btn" onClick={replayCurrentQuestion}>
            <Play size={20} />
            REPLAY
          </button>
          <button className="icon-btn stop" onClick={() => {
            if (window.currentAudio) window.currentAudio.pause();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            setIsAiSpeaking(false);
          }}>
            <Square size={20} />
            STOP
          </button>
          <button className="icon-btn">
            <User size={20} /> {/* Mock TYPE INSTEAD icon using User */}
            TYPE INSTEAD
          </button>
        </div>

        <div className="input-container">
          <input 
            type="text" 
            className="text-input" 
            placeholder="Type your response..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={currentStep === questions.length - 1}
          />
          {questions[currentStep]?.id === 'location' && (
            <button 
              className="send-btn" 
              style={{ backgroundColor: '#0f766e', marginRight: 4 }}
              onClick={handleGPS} 
              title="Use GPS"
            >
              <MapPin size={18} />
            </button>
          )}
          <button className="send-btn" onClick={handleSend} disabled={currentStep === questions.length - 1}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
