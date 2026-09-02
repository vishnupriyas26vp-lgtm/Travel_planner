import React from 'react';
import { Icon } from './Icons';

export function TrustSection() {
  const TRUST_ITEMS = [
    {
      icon: 'shield',
      title: 'Trusted by travellers',
      desc: 'for quality & support',
    },
    {
      icon: 'tag',
      title: 'Best price guarantee',
      desc: 'on all trips',
    },
    {
      icon: 'headset',
      title: '24/7 customer support',
      desc: "we're here for you",
    },
    {
      icon: 'lock',
      title: 'Secure bookings',
      desc: 'travel with confidence',
    },
  ];

  return (
    <section className="trust-bar-section" aria-label="Trust & Guarantees">
      <div className="container-xl">
        <div className="trust-bar-grid">
          {TRUST_ITEMS.map((item, idx) => (
            <div key={idx} className="trust-item-flex">
              <div style={{ color: '#12161f' }}>
                <Icon name={item.icon || 'shield'} size={24} />
              </div>
              <div>
                <div className="trust-item-title">{item.title}</div>
                <div className="trust-item-subtitle">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
