import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';
import { DkAiSession } from '../services/geminiService';
import { trackEvent } from '../services/analytics';
import { DESTINATIONS } from '../data/destinations';

export function AiAssistant({
  isOpen,
  onClose,
  destination,
  onLoadItineraryOnPage,
  onViewWeather,
  onExploreDestination,
}) {
  const [session] = useState(() => new DkAiSession());
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello, I'm **DK AI** — your intelligent travel companion for DK Holidays.\n\nAsk me where to go, when to visit, what to pack, how much time you need, or let's architect a personalized trip together.`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (destination && isOpen) {
      session.context.destination = destination.id;
      session.context.destinationObj = destination;
      setMessages([
        {
          id: `dest-welcome-${Date.now()}`,
          sender: 'assistant',
          text: `Hello, I'm **DK AI** — your intelligent travel concierge for **${destination.name}, ${destination.country}** (${destination.region}).\n\nAsk me what to see, what food to taste, the best time to visit, how many days you need, what to pack, or let's build your day-by-day trip!`,
        },
      ]);
    } else if (!destination && isOpen && messages.length === 1 && messages[0].id.startsWith('dest-welcome-')) {
      setMessages([
        {
          id: 'init-1',
          sender: 'assistant',
          text: `Hello, I'm **DK AI** — your intelligent travel companion for DK Holidays.\n\nAsk me where to go, when to visit, what to pack, how much time you need, or let's architect a personalized trip together.`,
        },
      ]);
    }
  }, [destination, isOpen]);

  const activePrompts = destination
    ? [
        `What should I see in ${destination.name}?`,
        `What food should I try in ${destination.name}?`,
        `What is the best time to visit ${destination.name}?`,
        `How many days do I need in ${destination.name}?`,
        `What should I pack for ${destination.name}?`,
        `What is the weather in ${destination.name}?`,
        `Plan a trip to ${destination.name}`,
      ]
    : [
        'Where should I travel this month?',
        'Plan a 5-day Bali trip',
        'Compare Bali and Maldives',
        'Is December good for Switzerland?',
        'What should I pack for Ladakh?',
        'What food should I try in Kerala?',
      ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const query = (queryText || inputVal).trim();
    if (!query) return;

    trackEvent('ai_question', { query });

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await session.ask(query);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        handoff: response.handoff,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('DK AI error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "DK AI couldn't respond right now. Please verify your connection or try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHandoff = (handoff) => {
    onClose();
    if (handoff.type === 'BUILD_TRIP') {
      onLoadItineraryOnPage(handoff.destinationId, handoff.duration || 4);
      const elem = document.getElementById('planner');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (handoff.type === 'VIEW_WEATHER') {
      onViewWeather(handoff.destinationId);
    } else if (handoff.type === 'EXPLORE_DESTINATION') {
      onExploreDestination(handoff.destinationId);
    }
  };

  return (
    <div className="ai-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="ai-chat-window-clean"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '740px',
          height: '82vh',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header with DK AI Identity */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #17142b 0%, #1e1b38 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #5d38f5 0%, #1e1b38 70%)',
                border: '2px solid #866bf5',
                boxShadow: '0 0 16px rgba(93, 56, 245, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Icon name="sparkles" size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>DK AI Companion</div>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>Context-Aware Travel Intelligence</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              padding: '6px',
              cursor: 'pointer',
              borderRadius: '50%',
            }}
            aria-label="Close DK AI"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Suggested Question Chips Bar */}
        <div
          style={{
            padding: '12px 20px',
            background: '#faf9f6',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {activePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation History Area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#f8f7f4',
          }}
        >
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isUser ? '#f26440' : '#ffffff',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  padding: '16px 20px',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                }}
              >
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                {/* Structured Interactive Handoff Card */}
                {m.handoff && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleHandoff(m.handoff)}
                      style={{
                        background: '#151922',
                        color: '#ffffff',
                        padding: '8px 18px',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{m.handoff.label}</span>
                      <Icon name="arrow-right" size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '12px 18px',
                background: '#ffffff',
                borderRadius: '18px 18px 18px 4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="sparkles" size={16} style={{ color: '#866bf5' }} />
              <span>DK AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input & Send Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '16px 20px',
            background: '#ffffff',
            borderTop: '1px solid rgba(0, 0, 0, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <input
            type="text"
            placeholder="Ask DK AI about destinations, weather, packing, seasons, comparisons..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              flex: 1,
              background: '#f4f3f0',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '999px',
              padding: '12px 20px',
              fontSize: '0.92rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            style={{
              background: '#f26440',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              opacity: inputVal.trim() ? 1 : 0.6,
              cursor: inputVal.trim() ? 'pointer' : 'default',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
