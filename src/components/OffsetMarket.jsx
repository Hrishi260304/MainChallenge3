import React, { useState } from 'react';
import { ShoppingBag, Leaf, Award, Globe, HelpCircle, CheckCircle } from 'lucide-react';

const MARKET_ITEMS = [
  { id: 'm1', title: 'Plant a Mature Tree Reforestation', cost: 200, offsetKg: 22, desc: 'Supplies seedling planting and maintenance. Offsets 22kg CO2 yearly.', icon: '🌲' },
  { id: 'm2', title: 'Wind Energy Grid Infrastructure Support', cost: 500, offsetKg: 65, desc: 'Funds expansion of community wind farms, displacing fossil fuels.', icon: '💨' },
  { id: 'm3', title: 'Direct Air Capture & Carbon Burial Credit', cost: 1200, offsetKg: 180, desc: 'Supports cutting-edge geological storage capturing atmospheric CO2.', icon: '💎' },
  { id: 'm4', title: 'Oceanic Kelp Re-Seeding Credit', cost: 800, offsetKg: 110, desc: 'Restores marine habitats that absorb and sink carbon deep underwater.', icon: '🌊' }
];

export default function OffsetMarket({ points, onRedeemOffset, redeemedOffsets = [] }) {
  const [successMsg, setSuccessMsg] = useState(null);

  const handleRedeem = (item) => {
    if (points < item.cost) return;

    const redeemedItem = {
      id: Date.now().toString(),
      itemId: item.id,
      title: item.title,
      cost: item.cost,
      offsetKg: item.offsetKg,
      date: new Date().toLocaleDateString(),
      icon: item.icon
    };

    onRedeemOffset(redeemedItem);

    // Celebration message
    setSuccessMsg(`Redeemed! "${item.title}" successfully funded. Offsetted -${item.offsetKg} kg of CO2e!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }} className="metric-grid">
      
      {/* Marketplace Cards Column */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--accent-green)" /> Virtual Carbon Offset Shop
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(139, 92, 246, 0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: 'var(--accent-purple)' }}>
            <Award size={14} /> {points} Eco Points
          </div>
        </div>

        {successMsg && (
          <div className="animate-fade-in" style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid var(--accent-green)',
            color: 'var(--text-primary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="metric-grid">
          {MARKET_ITEMS.map(item => {
            const canAfford = points >= item.cost;
            return (
              <div 
                key={item.id} 
                className="glass-panel"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: canAfford ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                  opacity: canAfford ? 1 : 0.65
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{item.icon}</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600', background: 'rgba(16, 185, 129, 0.08)', padding: '3px 8px', borderRadius: '10px' }}>
                      -{item.offsetKg} kg CO2
                    </span>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{item.desc}</p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className="btn"
                    style={{ 
                      width: '100%', 
                      background: canAfford ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: canAfford ? 'white' : 'var(--text-muted)',
                      border: 'none',
                      fontSize: '13px',
                      padding: '10px'
                    }}
                  >
                    Redeem: {item.cost} pts
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemed List Column */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--accent-blue)" /> Funded Project Portfolio
        </h3>

        {redeemedOffsets.length === 0 ? (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <HelpCircle size={40} style={{ opacity: 0.15, marginBottom: '12px' }} />
            <p style={{ fontSize: '13px' }}>No offsets funded yet.</p>
            <p style={{ fontSize: '11px', marginTop: '2px' }}>Accumulate points to fund global ecological projects.</p>
          </div>
        ) : (
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {redeemedOffsets.map(redeem => (
              <div 
                key={redeem.id} 
                className="animate-fade-in"
                style={{
                  background: 'rgba(16, 185, 129, 0.03)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '24px' }}>{redeem.icon}</span>
                <div style={{ textAlign: 'left', flexGrow: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{redeem.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>Funded on {redeem.date}</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: '600' }}>-{redeem.offsetKg} kg CO2e</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
