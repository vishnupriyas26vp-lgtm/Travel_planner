import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icons';
import { DkAiSession } from '../services/geminiService';
import { trackEvent } from '../services/analytics';

export function AiAssistant({
  isOpen,
  onClose,
  onToggle,
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

  // Close on Escape key if open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleFabClick = () => {
    if (onToggle) {
      onToggle();
    } else if (isOpen) {
      onClose();
    }
  };

  return (
    <div className="ai-widget-container">
      {/* Floating Popup Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-popup-panel"
            className="ai-widget-popup"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="DK AI Travel Assistant"
            aria-modal="false"
          >
            {/* Header */}
            <div className="ai-widget-header">
              <div className="ai-widget-identity">
                <div className="ai-widget-avatar">
                  <Icon name="sparkles" size={18} />
                </div>
                <div>
                  <div className="ai-widget-title">DK AI Assistant</div>
                  <div className="ai-widget-status">
                    <span className="ai-status-dot" />
                    <span>Online · Travel Concierge</span>
                  </div>
                </div>
              </div>

              <div className="ai-widget-header-actions">
                <button
                  type="button"
                  className="ai-widget-close-btn"
                  onClick={onClose}
                  aria-label="Close DK AI Assistant"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>
            </div>

            {/* Destination contextual banner (if opened for a specific destination) */}
            {destination && (
              <div className="ai-widget-dest-badge">
                <Icon name="compass" size={13} style={{ color: 'var(--accent-orange)' }} />
                <span>
                  Focus: <strong>{destination.name}, {destination.country}</strong>
                </span>
              </div>
            )}

            {/* Suggested Question Chips Bar */}
            <div className="ai-widget-prompts-bar">
              {activePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="ai-widget-chip"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation History Area */}
            <div ref={scrollRef} className="ai-widget-messages">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`ai-widget-msg-bubble ${isUser ? 'user' : 'assistant'}`}
                  >
                    <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                    {/* Interactive Handoff Card */}
                    {m.handoff && (
                      <div className="ai-widget-handoff-wrap">
                        <button
                          type="button"
                          className="ai-widget-handoff-btn"
                          onClick={() => handleHandoff(m.handoff)}
                        >
                          <span>{m.handoff.label}</span>
                          <Icon name="arrow-right" size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="ai-widget-typing-indicator">
                  <Icon name="sparkles" size={14} style={{ color: '#866bf5' }} />
                  <span>DK AI is typing...</span>
                </div>
              )}
            </div>

            {/* Input & Send Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="ai-widget-input-form"
            >
              <input
                type="text"
                placeholder="Ask DK AI anything about your trip..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="ai-widget-input"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="ai-widget-send-btn"
                aria-label="Send message"
              >
                <Icon name="arrow-right" size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Chatbot Action Button (Fixed Bottom-Right) */}
      <button
        type="button"
        className={`ai-floating-fab ${isOpen ? 'active' : ''}`}
        onClick={handleFabClick}
        aria-label={isOpen ? 'Close AI Assistant' : 'Chat with DK AI'}
        title={isOpen ? 'Close AI Assistant' : 'Chat with DK AI'}
      >
        <span className="ai-fab-icon">
          {isOpen ? <Icon name="x" size={22} /> : <Icon name="sparkles" size={22} />}
        </span>
        {!isOpen && <span className="ai-fab-badge" />}
        {!isOpen && (
          <span className="ai-fab-tooltip">
            <span className="ai-tooltip-sparkle">✦</span> Ask DK AI
          </span>
        )}
      </button>
    </div>
  );
}
