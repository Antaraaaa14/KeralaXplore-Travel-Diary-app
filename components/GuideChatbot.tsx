import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Icon } from './Icon';
import { ChatMessage } from '../types';

interface GuideChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYSTEM_INSTRUCTION = `You are a friendly and helpful guide for the KeralaXplore Travel Diary application. Your goal is to assist users in understanding and using the app's features. Do not answer questions outside the scope of the app. Be concise and clear in your explanations.

The app has the following main features:
1.  **Travel Diary:** Users can log their trips. They can add an origin, destination, start time, mode of transport (car, bus, train, etc.), a list of fellow travelers, and an optional photo. They can view, edit, or delete these trips.
2.  **Explore Kerala:** This section showcases beautiful, famous tourist destinations in Kerala with pictures and short descriptions.
3.  **Famous Hotels:** A curated list of well-known hotels in Kerala, with ratings and descriptions.
4.  **Famous Food:** A guide to popular and traditional Keralan dishes, with photos.
5.  **Map of Kerala:** An interactive map where users can search for specific locations within Kerala.
6.  **Voice Typing:** You can inform users that in the chatbot input (your own input field), they can click the microphone icon to dictate their message instead of typing.

When a user asks a question, provide a simple explanation of how to use the relevant feature. For example, if they ask 'How do I add a trip?', you should explain that they need to go to the 'Diary' tab and click the '+' button.`;

const GuideChatbot: React.FC<GuideChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        setChatSession(chat);
        setMessages([
          { id: 'initial', text: "Hello! I'm your KeralaXplore guide. How can I help you today?", sender: 'bot' }
        ]);
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        setMessages([
          { id: 'error', text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }
        ]);
      }
    }
  }, [isOpen, chatSession]);
  
  useEffect(() => {
    if (isOpen) {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const previousActiveElement = document.activeElement as HTMLElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }

            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        firstElement?.focus();
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (document.body.contains(previousActiveElement)) {
                previousActiveElement?.focus();
            }
        };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSession) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const stream = await chatSession.sendMessageStream({ message: inputValue });
      let botResponse = '';
      let botMessageId = 'bot-' + Date.now();
      
      setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: botResponse } : msg));
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { id: 'error-' + Date.now(), text: "Oops, something went wrong. Please try again.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleVoiceRecognition = () => {
    // FIX: Cast window to `any` to access non-standard SpeechRecognition APIs
    // and resolve TypeScript errors.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognitionRef.current.start();
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px] z-50 flex flex-col">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl flex flex-col h-full overflow-hidden animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
      >
        <header className="flex items-center justify-between p-4 border-b bg-slate-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <Icon name="chatbot" className="w-6 h-6 text-blue-600" />
            <h3 id="chatbot-title" className="font-bold text-slate-800">App Guide</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full" aria-label="Close chat">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100" aria-live="polite" aria-atomic="false">
            <div className="space-y-4">
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                </div>
            ))}
             {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg">
                        <div role="status" aria-label="Loading response">
                            <div className="flex items-center space-x-2">
                               <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
            </div>
        </div>

        <footer className="p-3 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the app..."
              className="flex-1 w-full px-4 py-2 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="button"
              onClick={toggleVoiceRecognition}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              disabled={isLoading}
            >
              <Icon name="microphone" className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GuideChatbot;