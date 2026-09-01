import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, Loader2, Compass, HelpCircle, MapPin, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { BackButton } from '../components/BackButton';

export const TravelAssistantPage = () => {
  const { user, activeTrip } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user.name}! I am your dedicated AI Travel Assistant. I'm connected to your active trip to **${activeTrip.destination}** (${activeTrip.startDate} – ${activeTrip.endDate}). How can I assist with your planning today?`,
      time: '10:00 AM',
    },
  ]);

  const handleSend = async (customText) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      time: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.askChat(textToSend, {
        destination: activeTrip.destination,
        dates: `${activeTrip.startDate} - ${activeTrip.endDate}`,
        travelers: activeTrip.travelers,
        budget: `$${activeTrip.estimatedCost}`,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: res.text || 'I can help with that recommendation!',
          time: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="travel-assistant-chat-page" className="max-w-4xl mx-auto space-y-4">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">AI Concierge</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">AI Travel Concierge</h2>
            <p className="text-xs text-white/80 mt-0.5">
              Powered by Gemini 3.7 Flash • Contextualized for {activeTrip.destination}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Travel Agent</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-100/90 shadow-sm p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-3xl max-w-lg text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none font-normal'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block mt-1.5 ${
                    m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI Concierge is preparing travel insights...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Queries */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
          {[
            'What are the best vegetarian restaurants in Bali?',
            'How much cash vs card do I need?',
            'Give me a 1-day rainy day itinerary backup',
            'Recommend secret sunrise photography locations',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/70 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about flights, local customs, packing tips, or currency conversion..."
            className="w-full text-xs sm:text-sm py-3.5 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
