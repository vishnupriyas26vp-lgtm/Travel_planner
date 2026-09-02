import React from 'react';
import { Icon } from './Icons';

export function DkAiSection({ onOpenAi, onPromptClick }) {
  const QUICK_PROMPTS = [
    'Plan 5 days in Bali',
    'Best time to visit Ladakh?',
    'Romantic trip under ₹80,000',
    'I have 3 days in Munnar',
    'Trip for family of 4 to Switzerland',
  ];

  return (
    <section className="dk-ai-dock-section" id="ai-section" aria-label="DK AI Travel Assistant">
      <div className="container-xl">
        <div className="dk-ai-dock-banner">
          {/* Left Avatar & Text */}
          <div className="ai-dock-left">
            <div className="ai-bot-avatar-glow">
              <Icon name="sparkles" size={26} />
            </div>
            <div>
              <h3 className="ai-dock-title">Your trip starts with a conversation.</h3>
              <p className="ai-dock-subtitle">
                Tell us what you're looking for and we'll help turn it into a journey.
              </p>
            </div>
          </div>

          {/* Middle Suggestion Pills */}
          <div className="ai-prompt-pills-row">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-prompt-pill"
                onClick={() => (onPromptClick ? onPromptClick(prompt) : onOpenAi())}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Right Action Button */}
          <div>
            <button className="ai-chat-trigger-btn" onClick={onOpenAi}>
              <span>✦ Chat with DK AI</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
