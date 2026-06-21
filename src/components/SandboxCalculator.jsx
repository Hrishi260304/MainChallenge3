import React, { useState } from 'react';
import { Compass, Leaf, ArrowRight, TrendingDown } from 'lucide-react';
import { calculateBaseline } from '../utils/carbonMath';

export default React.memo(function SandboxCalculatorDemo({ baseline }) {
  const [sandboxAnswers, setSandboxAnswers] = useState({
    carWeeklyMiles: baseline ? (baseline.transport * 1000 / 0.404 / 52).toFixed(0) : '60',
    carType: 'gas',
    transitWeeklyMiles: '10',
    shortFlightsYear: '1',
    longFlightsYear: '0',
    monthlyElectricBill: '80',
    monthlyGasBill: '40',
    dietType: 'balanced',
    shoppingHabits: 'average'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSandboxAnswers(prev => ({ ...prev, [name]: value }));
  };

  const projectedBaseline = calculateBaseline(sandboxAnswers);
  const baselineTotal = baseline ? baseline.total : 15.0;
  const carbonDifference = projectedBaseline.total - baselineTotal;
  const isReduced = carbonDifference < 0;

  // Equivalents calculations
  const equivalentTrees = Math.round((Math.abs(carbonDifference) * 1000) / 22);

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={22} color="var(--accent-blue)" /> "What-If" Carbon Sandbox Simulator
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '28px', textAlign: 'left' }}>
        Slide parameters to see how shifts in your lifestyle alter your projected emissions compared to your active baseline.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="metric-grid">
        
        {/* Sliders Input Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="slider-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Weekly driving: <strong>{sandboxAnswers.carWeeklyMiles} miles</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>{sandboxAnswers.carType} car</span>
            </div>
            <input
                type="range"
                name="carWeeklyMiles"
                min="0"
                max="400"
                step="10"
                value={sandboxAnswers.carWeeklyMiles}
                onChange={handleChange}
                className="slider-input"
                aria-label="Weekly driving miles slider"
                aria-valuemin="0"
                aria-valuemax="400"
                aria-valuenow={sandboxAnswers.carWeeklyMiles}
              />
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {['gas', 'hybrid', 'electric'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSandboxAnswers(prev => ({ ...prev, carType: type }))}
                  style={{
                    flexGrow: 1,
                    background: sandboxAnswers.carType === type ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 6, 9, 0.25)',
                    border: `1px solid ${sandboxAnswers.carType === type ? 'var(--accent-green)' : 'var(--panel-border)'}`,
                    color: sandboxAnswers.carType === type ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="slider-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Utilities Electricity bill</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${sandboxAnswers.monthlyElectricBill}</span>
            </div>
            <input
                type="range"
                name="monthlyElectricBill"
                min="0"
                max="350"
                step="10"
                value={sandboxAnswers.monthlyElectricBill}
                onChange={handleChange}
                className="slider-input"
                aria-label="Monthly electricity bill slider"
                aria-valuemin="0"
                aria-valuemax="350"
                aria-valuenow={sandboxAnswers.monthlyElectricBill}
              />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '13px' }}>Dietary Habit Change</label>
            <select 
                name="dietType" 
                value={sandboxAnswers.dietType} 
                onChange={handleChange} 
                className="form-select"
                style={{ padding: '10px' }}
                aria-label="Diet type selector"
              >
              <option value="vegan">🌱 Shift completely to Vegan</option>
              <option value="vegetarian">🥚 Shift to Vegetarian</option>
              <option value="balanced">🥗 Balanced Diet (Moderate meat)</option>
              <option value="heavy-meat">🥩 High Red Meat Consumer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '13px' }}>Consumer Buying habits</label>
            <select 
                name="shoppingHabits" 
                value={sandboxAnswers.shoppingHabits} 
                onChange={handleChange} 
                className="form-select"
                style={{ padding: '10px' }}
                aria-label="Shopping habits selector"
              >
              <option value="minimalist">📦 Minimalist (Local & eco items)</option>
              <option value="average">🛍️ Average consumption</option>
              <option value="frequent">🏷️ High consumer rate</option>
            </select>
          </div>

        </div>

        {/* Results Graph Screen */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div className="glass-panel" style={{ background: 'rgba(5, 6, 9, 0.4)', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Projected annual emissions
            </span>
            <div style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: '8px 0', color: isReduced ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
              {projectedBaseline.total.toFixed(1)} <span style={{ fontSize: '18px', fontWeight: '500' }}>Tons</span>
            </div>

            {/* Impact statement badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              background: isReduced ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              color: isReduced ? 'var(--accent-green)' : 'var(--accent-rose)',
              border: `1px solid ${isReduced ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`
            }}>
              {isReduced ? (
                <>
                  <TrendingDown size={14} /> Saves {Math.abs(carbonDifference).toFixed(1)} Tons / yr
                </>
              ) : (
                <>
                  Adds +{carbonDifference.toFixed(1)} Tons / yr
                </>
              )}
            </div>

            {/* Details box */}
            {carbonDifference !== 0 && (
              <div className="animate-fade-in" style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--panel-border)', paddingTop: '16px', textAlign: 'left' }}>
                {isReduced ? (
                  <p>
                    🎉 This projected reduction is equivalent to planting <strong>{equivalentTrees} mature trees</strong>! That offsets the typical driving carbon of an average car for <strong>{(Math.abs(carbonDifference) * 1000 / 0.404).toFixed(0)} miles</strong>.
                  </p>
                ) : (
                  <p>
                    ⚠️ This setup exceeds your active baseline. Try adjusting driving miles down, switching to a hybrid/EV, or selecting a lower-impact diet to balance it.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
