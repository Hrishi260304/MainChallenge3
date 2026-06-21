import React, { useState } from 'react';
import { Car, Plane, Droplets, ShoppingBag, Leaf, ArrowRight, ArrowLeft, Zap, Flame } from 'lucide-react';
import { calculateBaseline } from '../utils/carbonMath';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    carWeeklyMiles: '50',
    carType: 'gas',
    transitWeeklyMiles: '10',
    shortFlightsYear: '1',
    longFlightsYear: '0',
    monthlyElectricBill: '80',
    monthlyGasBill: '40',
    dietType: 'balanced',
    shoppingHabits: 'average',
    reductionTarget: '20' // percentage
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const results = calculateBaseline(answers);
    onComplete(results, answers);
  };

  // Preview current footprint estimates on-the-fly
  const currentBaseline = calculateBaseline(answers);

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '36px', position: 'relative' }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-green)' }}>
              Step {step} of 5
            </span>
            <h2 style={{ fontSize: '24px', marginTop: '4px' }}>
              {step === 1 && 'Transportation (Driving)'}
              {step === 2 && 'Travel & Flights'}
              {step === 3 && 'Home Utilities'}
              {step === 4 && 'Diet & Consumption'}
              {step === 5 && 'Set Your Targets'}
            </h2>
          </div>
          <span style={{ fontSize: '32px' }}>
            {step === 1 && '🚗'}
            {step === 2 && '✈️'}
            {step === 3 && '🏠'}
            {step === 4 && '🍲'}
            {step === 5 && '🎯'}
          </span>
        </div>

        {/* Step Progress Line */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '32px', position: 'relative' }}>
          <div style={{
            height: '100%',
            background: 'var(--gradient-eco)',
            width: `${(step / 5) * 100}%`,
            borderRadius: '2px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Step 1: Driving */}
        {step === 1 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Transport accounts for roughly 30% of average household greenhouse gases. Let's estimate your driving impact.
            </p>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Weekly Driving Distance</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{answers.carWeeklyMiles} miles</span>
              </label>
              <input
                type="range"
                name="carWeeklyMiles"
                min="0"
                max="500"
                step="10"
                value={answers.carWeeklyMiles}
                onChange={handleChange}
                className="slider-input"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>0 miles</span>
                <span>250 miles (Avg)</span>
                <span>500+ miles</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">Primary Vehicle Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'gas', label: 'Gas / Petrol Car', desc: 'Standard engine' },
                  { value: 'diesel', label: 'Diesel Car', desc: 'Higher local emissions' },
                  { value: 'hybrid', label: 'Hybrid Car', desc: 'Partial battery usage' },
                  { value: 'electric', label: 'Electric Car (EV)', desc: 'Zero tailpipe emissions' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswers(prev => ({ ...prev, carType: opt.value }))}
                    style={{
                      background: answers.carType === opt.value ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 6, 9, 0.25)',
                      border: `1px solid ${answers.carType === opt.value ? 'var(--accent-green)' : 'var(--panel-border)'}`,
                      padding: '14px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: answers.carType === opt.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px' }}>
                      <Car size={16} color={answers.carType === opt.value ? 'var(--accent-green)' : 'currentColor'} />
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Transit & Flights */}
        {step === 2 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Aviation has a high warming impact. Trains and buses are much lower carbon alternatives.
            </p>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Weekly Public Transit (Bus/Metro)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{answers.transitWeeklyMiles} miles</span>
              </label>
              <input
                type="range"
                name="transitWeeklyMiles"
                min="0"
                max="300"
                step="5"
                value={answers.transitWeeklyMiles}
                onChange={handleChange}
                className="slider-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Short Flights (Under 3 hrs)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plane size={18} color="var(--accent-blue)" />
                  <input
                    type="number"
                    name="shortFlightsYear"
                    min="0"
                    max="50"
                    value={answers.shortFlightsYear}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per year (Round trips)</span>
              </div>
              <div className="form-group">
                <label className="form-label">Long Flights (Over 3 hrs)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plane size={18} color="var(--accent-purple)" />
                  <input
                    type="number"
                    name="longFlightsYear"
                    min="0"
                    max="50"
                    value={answers.longFlightsYear}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per year (Round trips)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Home Energy */}
        {step === 3 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Heating, cooling, and powering your home makes up another major block of emissions.
            </p>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Electricity Bill</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${answers.monthlyElectricBill}</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="var(--accent-orange)" />
                <input
                  type="range"
                  name="monthlyElectricBill"
                  min="0"
                  max="400"
                  step="10"
                  value={answers.monthlyElectricBill}
                  onChange={handleChange}
                  className="slider-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Gas / Heating Bill</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${answers.monthlyGasBill}</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={18} color="var(--accent-rose)" />
                <input
                  type="range"
                  name="monthlyGasBill"
                  min="0"
                  max="300"
                  step="10"
                  value={answers.monthlyGasBill}
                  onChange={handleChange}
                  className="slider-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Diet & Consumption */}
        {step === 4 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Food choices and secondary consumption (electronics, fashion) have huge indirect carbon footprints.
            </p>

            <div className="form-group">
              <label className="form-label">Dietary Preference</label>
              <select name="dietType" value={answers.dietType} onChange={handleChange} className="form-select">
                <option value="vegan">🌱 Vegan (100% plant-based, low impact)</option>
                <option value="vegetarian">🥚 Vegetarian (No meat, moderate impact)</option>
                <option value="balanced">🥗 Balanced (Occasional meat, typical impact)</option>
                <option value="heavy-meat">🥩 Meat Lover (Daily red meat, high impact)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">Shopping Habits</label>
              <select name="shoppingHabits" value={answers.shoppingHabits} onChange={handleChange} className="form-select">
                <option value="minimalist">📦 Minimalist (Only buy essentials, second-hand items)</option>
                <option value="average">🛍️ Average (Standard buying behavior, average packaging)</option>
                <option value="frequent">🏷️ Frequent (Regularly buy new clothes, tech, and fast-goods)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Targets */}
        {step === 5 && (
          <div className="animate-fade-in">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Let's establish your climate action target. We recommend starting with a 20% reduction target!
            </p>

            <div className="form-group" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--accent-green)' }}>
                {answers.reductionTarget}% Reduction
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Your target carbon footprint: <strong>{((currentBaseline.total * (100 - answers.reductionTarget)) / 100).toFixed(1)} tons</strong> / year
              </p>
              
              <input
                type="range"
                name="reductionTarget"
                min="5"
                max="50"
                step="5"
                value={answers.reductionTarget}
                onChange={handleChange}
                className="slider-input"
                style={{ marginTop: '20px' }}
              />
            </div>

            <div className="glass-panel" style={{ background: 'rgba(5, 6, 9, 0.3)', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Leaf size={24} color="var(--accent-green)" />
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>
                By achieving a <strong>{answers.reductionTarget}% reduction</strong>, you will save approximately <strong>{(currentBaseline.total * (answers.reductionTarget / 100)).toFixed(1)} metric tons</strong> of CO2e per year. This is equivalent to planting <strong>{Math.round((currentBaseline.total * 1000 * (answers.reductionTarget / 100)) / 22)} mature trees</strong>!
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', alignItems: 'center' }}>
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ animation: 'pulseGlow 2s infinite ease-in-out' }}>
              Calculate Footprint <Leaf size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Footprint Box */}
      <div className="glass-panel" style={{ marginTop: '20px', padding: '18px', borderStyle: 'dashed', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Estimated Current Annual Footprint: <strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>{currentBaseline.total} Tons CO2e</strong>
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          US average: ~16.0 tons | Global average: ~4.5 tons
        </p>
      </div>
    </div>
  );
}
