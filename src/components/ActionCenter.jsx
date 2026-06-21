import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, AlertCircle, ShieldAlert, Award, Star } from 'lucide-react';

const ECO_CHALLENGES = [
  { id: 'h1', category: 'energy', label: 'Unplug Standby Devices', points: 15, co2: 0.2, desc: 'Prevents "vampire" draw from electronics on standby.' },
  { id: 'h2', category: 'energy', label: 'Use Cold Water for Laundry', points: 20, co2: 0.6, desc: '90% of laundry machine energy goes into heating water.' },
  { id: 'h3', category: 'transport', label: 'No Car Travel Day', points: 40, co2: 6.0, desc: 'Walk, cycle, or work from home to avoid driving entirely.' },
  { id: 'h4', category: 'diet', label: 'Meat-Free Day', points: 30, co2: 2.5, desc: 'Reduces impact substantially compared to standard meat diet.' },
  { id: 'h5', category: 'consumption', label: 'Zero Single-Use Plastics', points: 25, co2: 0.4, desc: 'Avoid plastic bottles, bags, and straws today.' },
  { id: 'h6', category: 'energy', label: 'Keep Thermostat 2° Cooler', points: 25, co2: 1.5, desc: 'Reduces heating or cooling electricity demand.' }
];

export default function ActionCenter({ baseline, onLogHabit, points }) {
  const [completedHabits, setCompletedHabits] = useState({});

  // Determine highest emissions category from baseline
  const getHighestCategory = () => {
    if (!baseline) return 'transport';
    const cats = [
      { key: 'transport', val: baseline.transport, label: 'Transportation' },
      { key: 'energy', val: baseline.energy, label: 'Home Energy' },
      { key: 'diet', val: baseline.diet, label: 'Dietary Choices' },
      { key: 'consumption', val: baseline.consumption, label: 'Consumption & Goods' }
    ];
    // Sort descending
    cats.sort((a, b) => b.val - a.val);
    return cats[0];
  };

  const highestSector = getHighestCategory();

  // Recommendations based on highest category
  const recommendations = {
    transport: [
      { title: 'Consider Hybrid or Electric Vehicles', text: 'Switching to an EV reduces mileage footprint by roughly 80% compared to gasoline cars.' },
      { title: 'Increase Public Transit & Carpooling', text: 'Commuting by rail or bus has a 75% lower footprint than single-occupancy driving.' },
      { title: 'Optimize Flight Schedules', text: 'Combine business trips and choose direct flights, as takeoffs produce the most emissions.' }
    ],
    energy: [
      { title: 'Switch to a Certified Green Tariff', text: 'Contact your utility provider to switch your plan to 100% renewable wind or solar sources.' },
      { title: 'Install Smart Thermostats', text: 'Saves an average of 10-15% on heating and cooling utility demands annually.' },
      { title: 'Upgrade insulation and seal gaps', text: 'Stopping drafts is the single most cost-effective way to trim home energy usage.' }
    ],
    diet: [
      { title: 'Incorporate Meatless Mondays', text: 'Skipping beef or lamb even once a week can save up to 400 kg of CO2e annually.' },
      { title: 'Reduce Household Food Waste', text: 'Buy groceries with a weekly meal list. Rotting organic food in landfills yields potent methane.' },
      { title: 'Choose Local, Seasonal Foods', text: 'Reduces heavy transport footprint (food miles) and packaging waste.' }
    ],
    consumption: [
      { title: 'Adopt a Circular Fashion Routine', text: 'Buy second-hand or trade apparel. The textile sector is a massive industrial emitter.' },
      { title: 'Unsubscribe & Declutter Purchases', text: 'Buying fewer physical appliances and tech gadgets directly scales down processing emissions.' },
      { title: 'Optimize Home Waste Recycling', text: 'Recycling aluminum, paper, and glass prevents raw smelting emissions.' }
    ]
  };

  const handleHabitToggle = (habit) => {
    if (completedHabits[habit.id]) return; // Cannot un-complete (simplifies gamification)

    setCompletedHabits(prev => ({ ...prev, [habit.id]: true }));
    onLogHabit({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      category: habit.category,
      activity: `Eco habit: ${habit.label}`,
      co2Impact: -habit.co2, // savings
      amount: 1,
      unit: 'completed',
      pointsEarned: habit.points
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="metric-grid">
      
      {/* Habits checklist */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="var(--accent-green)" /> Daily Eco-Habits Checklist
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
          Complete these simple daily practices to earn points and instantly lower your carbon footprint.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ECO_CHALLENGES.map(habit => {
            const isCompleted = completedHabits[habit.id];
            return (
              <div 
                key={habit.id}
                onClick={() => handleHabitToggle(habit)}
                style={{
                  background: isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${isCompleted ? 'var(--accent-green)' : 'var(--panel-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: isCompleted ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isCompleted ? 0.85 : 1
                }}
              >
                <div style={{ marginTop: '2px', color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                  {isCompleted ? <CheckCircle2 size={18} fill="currentColor" color="var(--bg-dark)" /> : <Circle size={18} />}
                </div>

                <div style={{ flexGrow: 1, textAlign: 'left' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: isCompleted ? 'var(--accent-green)' : 'var(--text-primary)',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {habit.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {habit.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-purple)' }}>
                    +{habit.points} pts
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--accent-green)' }}>
                    -{habit.co2} kg CO2e
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Recommendation Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Highest Sector Warning */}
        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.04)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ShieldAlert size={24} color="var(--accent-rose)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Primary Emission Driver
              </div>
              <h4 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                {highestSector.label} ({highestSector.val.toFixed(1)} Tons/yr)
              </h4>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'left' }}>
            Your highest emission sector is <strong>{highestSector.label}</strong>. Focus on the suggestions below to achieve the highest leverage reduction path.
          </p>
        </div>

        {/* Personalized recommendations list */}
        <div className="glass-panel" style={{ flexGrow: 1 }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--accent-blue)" /> Personalized Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {recommendations[highestSector.key]?.map((rec, idx) => (
              <div key={idx} style={{ paddingBottom: idx < 2 ? '14px' : '0', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                  <Star size={14} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
                  {rec.title}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', paddingLeft: '22px' }}>
                  {rec.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
