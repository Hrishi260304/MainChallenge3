import React, { useState } from 'react';
import { PlusCircle, Trash2, Calendar, ShieldCheck, Footprints, Award } from 'lucide-react';
import { calculateActivityFootprint } from '../utils/carbonMath';

const ACTIVITY_OPTIONS = {
  transport: [
    { value: 'drive_gas', label: 'Drive Standard Gas Car (miles)', unit: 'miles' },
    { value: 'drive_hybrid', label: 'Drive Hybrid Car (miles)', unit: 'miles' },
    { value: 'drive_ev', label: 'Drive Electric Car (miles)', unit: 'miles' },
    { value: 'transit', label: 'Public Transit / Bus / Metro (miles)', unit: 'miles' },
    { value: 'bike_walk_saved', label: 'Walk or Bicycle (Instead of Driving) (miles)', unit: 'miles', isOffset: true }
  ],
  energy: [
    { value: 'electricity', label: 'Electricity Consumption (kWh)', unit: 'kWh' },
    { value: 'gas', label: 'Natural Gas Usage (therms)', unit: 'therms' },
    { value: 'cold_wash', label: 'Cold Water Laundry Wash (loads)', unit: 'loads', isOffset: true },
    { value: 'led_lights', label: 'Eco LED Bulbs Installation (bulbs)', unit: 'bulbs', isOffset: true }
  ],
  diet: [
    { value: 'veg_meal', label: 'Vegetarian Meal (meals)', unit: 'meals', isOffset: true },
    { value: 'vegan_meal', label: 'Vegan Meal (meals)', unit: 'meals', isOffset: true },
    { value: 'zero_waste', label: 'Zero Food Waste Day (days)', unit: 'days', isOffset: true }
  ],
  consumption: [
    { value: 'second_hand', label: 'Buy Second-Hand instead of New (items)', unit: 'items', isOffset: true },
    { value: 'recycled', label: 'Recycle Paper, Metal, or Plastic (loads)', unit: 'loads', isOffset: true },
    { value: 'reusable_cup', label: 'Use Reusable Cup / Shopping Bag (uses)', unit: 'uses', isOffset: true }
  ]
};

export default function ActivityLogger({ onLogActivity, loggedActivities, onDeleteActivity }) {
  const [category, setCategory] = useState('transport');
  const [activity, setActivity] = useState(ACTIVITY_OPTIONS.transport[0].value);
  const [amount, setAmount] = useState('10');
  const [statusMessage, setStatusMessage] = useState(null);

  // Update default activity when category changes
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    setActivity(ACTIVITY_OPTIONS[cat][0].value);
  };

  const getSelectedOption = () => {
    return ACTIVITY_OPTIONS[category].find(opt => opt.value === activity);
  };

  const handleLog = (e) => {
    e.preventDefault();
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return;

    const selectedOpt = getSelectedOption();
    const co2Impact = calculateActivityFootprint(category, activity, qty);

    // Calculate Eco Points: 10 points flat plus 5 points per kg CO2 saved (for offset actions)
    let pointsEarned = 10;
    if (co2Impact < 0) {
      pointsEarned += Math.round(Math.abs(co2Impact) * 5);
    }

    const newActivity = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      category,
      activity: selectedOpt.label,
      co2Impact,
      amount: qty,
      unit: selectedOpt.unit,
      pointsEarned
    };

    onLogActivity(newActivity);

    // Trigger success message
    const isSaved = co2Impact < 0;
    setStatusMessage({
      text: isSaved 
        ? `Logged! You saved ${Math.abs(co2Impact).toFixed(1)} kg CO2e and earned ${pointsEarned} Eco Points! 🍃`
        : `Logged! Footprint added: +${co2Impact.toFixed(1)} kg CO2e. Earned ${pointsEarned} Eco Points!`,
      type: isSaved ? 'success' : 'info'
    });

    // Clear message after 4s
    setTimeout(() => setStatusMessage(null), 4000);
    setAmount('10');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="metric-grid">
      
      {/* Logger Column */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} color="var(--accent-green)" /> Log Daily Activity
        </h3>

        {statusMessage && (
          <div className="animate-fade-in" style={{
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)',
            border: `1px solid ${statusMessage.type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)'}`,
            color: 'var(--text-primary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleLog}>
          <div className="form-group">
            <label className="form-label">Sector Category</label>
            <select value={category} onChange={handleCategoryChange} className="form-select">
              <option value="transport">🚗 Transportation</option>
              <option value="energy">🏠 Home Utilities</option>
              <option value="diet">🍲 Dietary Choice</option>
              <option value="consumption">🛍️ Shopping & Consumption</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Type</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="form-select">
              {ACTIVITY_OPTIONS[category].map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Quantity / Volume</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: '600' }}>
                {getSelectedOption()?.unit}
              </span>
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Submit Entry <PlusCircle size={16} />
          </button>
        </form>
      </div>

      {/* History Column */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-purple)" /> Active Logs History
        </h3>

        {loggedActivities.length === 0 ? (
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <Footprints size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p style={{ fontSize: '14px' }}>No activities logged today yet.</p>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>Your logged activities will populate here.</p>
          </div>
        ) : (
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {loggedActivities.map(act => {
              const isOffset = act.co2Impact < 0;
              return (
                <div 
                  key={act.id} 
                  className="animate-fade-in"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {act.activity}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>{act.date}</span>
                      <span>•</span>
                      <span>Qty: {act.amount}</span>
                      <span>•</span>
                      <span style={{ color: isOffset ? 'var(--accent-green)' : 'var(--accent-rose)', fontWeight: '600' }}>
                        {isOffset ? 'Saved ' : '+'}{Math.abs(act.co2Impact).toFixed(1)} kg
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(139, 92, 246, 0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--accent-purple)' }}>
                      <Award size={12} />
                      +{act.pointsEarned}
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteActivity(act.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
