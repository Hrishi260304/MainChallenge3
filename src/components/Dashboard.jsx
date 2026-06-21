import React from 'react';
import { Leaf, Flame, ShieldAlert, Award, Compass, TrendingDown, ArrowUpRight } from 'lucide-react';
import { getVisualEquivalents } from '../utils/carbonMath';

export default function Dashboard({ baseline, target, savings = 0, points = 0, streak = 0, loggedActivities = [] }) {
  // Calculations
  const targetReduction = baseline ? (baseline.total * (target / 100)) : 0;
  const targetFootprint = baseline ? (baseline.total - targetReduction) : 0;
  const currentEstFootprint = baseline ? Math.max(0, baseline.total - (savings / 1000)) : 0;
  
  // Calculate progress percent towards reduction target
  // e.g. If target reduction is 2 tons, and savings is 0.5 tons, they are 25% complete.
  const savingsInTons = savings / 1000;
  const reductionProgressPercent = targetReduction > 0 
    ? Math.min(100, Math.round((savingsInTons / targetReduction) * 100))
    : 0;

  // Category values (tons CO2e)
  const categories = baseline ? [
    { name: 'Transportation', value: baseline.transport, color: 'var(--accent-blue)', percent: Math.round((baseline.transport / baseline.total) * 100) },
    { name: 'Home Energy', value: baseline.energy, color: 'var(--accent-purple)', percent: Math.round((baseline.energy / baseline.total) * 100) },
    { name: 'Diet Choice', value: baseline.diet, color: 'var(--accent-orange)', percent: Math.round((baseline.diet / baseline.total) * 100) },
    { name: 'Consumption & Goods', value: baseline.consumption, color: 'var(--accent-rose)', percent: Math.round((baseline.consumption / baseline.total) * 100) }
  ] : [];

  const equivalents = getVisualEquivalents(savings);

  // SVG Area Chart points generator
  // We'll plot 6 data points showing a projected reduction path vs actual footprint
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;
  
  // Simulated historic tracking points (e.g. Month 1 to Month 6)
  const baselineVal = baseline ? baseline.total : 15;
  const targetVal = targetFootprint;
  
  // Actual monthly footprint values showing decline based on logged savings
  const actualPoints = [
    baselineVal,
    baselineVal * 0.98,
    baselineVal * 0.95 - (savingsInTons * 0.2),
    baselineVal * 0.92 - (savingsInTons * 0.5),
    baselineVal * 0.88 - (savingsInTons * 0.8),
    currentEstFootprint
  ];

  // Convert points to SVG coordinates
  const getCoordinates = (pointsArray) => {
    const stepX = (chartWidth - padding * 2) / (pointsArray.length - 1);
    const maxVal = Math.max(...pointsArray, baselineVal) * 1.1;
    const minVal = Math.min(...pointsArray, targetVal) * 0.9;
    const range = maxVal - minVal;
    
    return pointsArray.map((val, idx) => {
      const x = padding + idx * stepX;
      // invert Y since SVG coordinates start at top left
      const y = chartHeight - padding - ((val - minVal) / range) * (chartHeight - padding * 2);
      return { x, y, value: val };
    });
  };

  const lineCoords = getCoordinates(actualPoints);
  const targetLineCoords = getCoordinates([baselineVal, baselineVal * 0.96, baselineVal * 0.92, baselineVal * 0.88, baselineVal * 0.84, targetVal]);

  // Create SVG path string
  const createPathString = (coords) => {
    if (coords.length === 0) return '';
    return `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
  };

  // Create SVG Area path string
  const createAreaPathString = (coords) => {
    if (coords.length === 0) return '';
    const linePath = createPathString(coords);
    return `${linePath} L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${coords[0].x} ${chartHeight - padding} Z`;
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top Welcome Panel */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Your Ecological Profile <Leaf size={24} color="var(--accent-green)" />
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track details, log eco-habits, and redeem rewards points to plant trees.
          </p>
        </div>
        
        {/* Streak & Score pill */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.2)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Streak</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'rgb(251, 146, 60)' }}>{streak} Days</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>
            <Award size={20} color="var(--accent-purple)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Eco Points</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-purple)' }}>{points} pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="metric-grid">
        <div className="glass-panel metric-card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Baseline Footprint</div>
          <div className="metric-value">{baseline?.total}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tons CO2e / year</div>
        </div>
        
        <div className="glass-panel metric-card blue">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Target Footprint</div>
          <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>{targetFootprint.toFixed(1)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({target}% reduction goal)</div>
        </div>

        <div className="glass-panel metric-card purple">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Estimate</div>
          <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>{currentEstFootprint.toFixed(2)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tons CO2e (adjusted)</div>
        </div>

        <div className="glass-panel metric-card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Carbon Offset</div>
          <div className="metric-value" style={{ color: 'var(--accent-green)' }}>{savings.toFixed(1)} kg</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {reductionProgressPercent}% of annual target
          </div>
        </div>
      </div>

      {/* Grid: Chart & Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', margin: '24px 0' }} className="metric-grid">
        
        {/* Chart Column */}
        <div className="glass-panel" style={{ minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown size={18} color="var(--accent-green)" /> Footprint Reduction Timeline
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'rgba(16,185,129,0.3)', borderRadius: '25%' }} /> Actual
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'rgba(59,130,246,0.3)', border: '1px dashed var(--accent-blue)', borderRadius: '25%' }} /> Target Pathway
              </span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
              {/* Grids */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.08)" />

              {/* Target Line (Dashed) */}
              <path
                d={createPathString(targetLineCoords)}
                fill="none"
                stroke="var(--accent-blue)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Actual Area */}
              <path
                d={createAreaPathString(lineCoords)}
                fill="url(#areaGrad)"
              />

              {/* Actual Line */}
              <path
                d={createPathString(lineCoords)}
                fill="none"
                stroke="var(--accent-green)"
                strokeWidth="2.5"
              />

              {/* Coordinates Markers / Dots */}
              {lineCoords.map((c, i) => (
                <g key={i}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4"
                    fill="var(--bg-dark)"
                    stroke="var(--accent-green)"
                    strokeWidth="2"
                  />
                  {i === lineCoords.length - 1 && (
                    <text x={c.x - 20} y={c.y - 10} fill="var(--text-primary)" fontSize="9" fontWeight="600">
                      {c.value.toFixed(1)}t
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', padding: '0 10px' }}>
            <span>Month 1</span>
            <span>Month 2</span>
            <span>Month 3</span>
            <span>Month 4</span>
            <span>Month 5</span>
            <span>Current</span>
          </div>
        </div>

        {/* Categories Breakdown Column */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Baseline Breakdown</h3>
          
          {categories.map((cat, idx) => (
            <div key={idx} className="progress-container">
              <div className="progress-header">
                <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                <span style={{ fontWeight: '600' }}>{cat.value.toFixed(1)} Tons ({cat.percent}%)</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${cat.percent}%`, 
                    backgroundColor: cat.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Equivalents Grid */}
      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🍃 Your Ecological Footprint Offset Impact
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Through daily logged habits, you have prevented <strong>{savings.toFixed(1)} kg</strong> of carbon from entering the atmosphere. Here is what your cumulative savings represent:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.04)', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
            <span style={{ fontSize: '32px' }}>🌳</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tree Absorption</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-green)' }}>{equivalents.trees} Trees</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>for a full year</div>
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'rgba(59, 130, 246, 0.04)', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
            <span style={{ fontSize: '32px' }}>🚘</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Car Emissions Avoided</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-blue)' }}>{equivalents.miles} Miles</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>of typical gas driving</div>
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'rgba(139, 92, 246, 0.04)', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
            <span style={{ fontSize: '32px' }}>⚡</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Smartphone Charges</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-purple)' }}>{equivalents.charges.toLocaleString()} Charges</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>energy equivalent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
