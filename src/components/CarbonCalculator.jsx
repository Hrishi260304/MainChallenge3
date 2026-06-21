import React, { useState } from 'react';
import { Compass, TrendingDown } from 'lucide-react';
import { calculateBaseline } from '../utils/carbonMath';

export default function CarbonCalculator({ baseline }) {
  const [answers, setAnswers] = useState({
    carWeeklyMiles: baseline ? (baseline.transport * 1000 / 0.404 / 52).toFixed(0) : '60',
    carType: 'gas',
    monthlyElectricBill: baseline ? baseline.electricityBill || '80' : '80',
    dietType: 'balanced',
    shoppingHabits: 'average',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const projected = calculateBaseline(answers);
  const baselineTotal = baseline ? baseline.total : 15.0;
  const diff = projected.total - baselineTotal;
  const isReduced = diff < 0;

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={22} color="var(--accent-blue)" /> Carbon Calculator
      </h3>

      {/* Inputs */}
      <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        {/* Driving */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Weekly Driving Miles
            <input
              type="range"
              name="carWeeklyMiles"
              min="0"
              max="400"
              step="10"
              value={answers.carWeeklyMiles}
              onChange={handleChange}
              className="slider-input"
              aria-label="Weekly driving miles slider"
              aria-valuemin="0"
              aria-valuemax="400"
              aria-valuenow={answers.carWeeklyMiles}
            />
          </label>
        </div>
        {/* Electricity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Monthly Electricity Bill
            <input
              type="range"
              name="monthlyElectricBill"
              min="0"
              max="350"
              step="10"
              value={answers.monthlyElectricBill}
              onChange={handleChange}
              className="slider-input"
              aria-label="Monthly electricity bill slider"
              aria-valuemin="0"
              aria-valuemax="350"
              aria-valuenow={answers.monthlyElectricBill}
            />
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="glass-panel" style={{ background: 'rgba(5, 6, 9, 0.4)', padding: '24px', textAlign: 'center', marginTop: '24px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Projected annual emissions
        </span>
        <div style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: '8px 0', color: isReduced ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
          {projected.total.toFixed(1)} <span style={{ fontSize: '18px', fontWeight: '500' }}>Tons</span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            background: isReduced ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            color: isReduced ? 'var(--accent-green)' : 'var(--accent-rose)',
            border: `1px solid ${isReduced ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
          }}
        >
          {isReduced ? (
            <>
              <TrendingDown size={14} /> Saves {Math.abs(diff).toFixed(1)} Tons / yr
            </>
          ) : (
            <>Adds +{diff.toFixed(1)} Tons / yr</>
          )}
        </div>
      </div>
    </div>
  );
}
