import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
const Onboarding = lazy(() => import('./components/Onboarding'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ActivityLogger = lazy(() => import('./components/ActivityLogger'));
const ActionCenter = lazy(() => import('./components/ActionCenter'));
const OffsetMarket = lazy(() => import('./components/OffsetMarket'));
const SandboxCalculator = lazy(() => import('./components/SandboxCalculator'));
const EcoChat = lazy(() => import('./components/EcoChat'));
const CarbonCalculator = lazy(() => import('./components/CarbonCalculator'));
const ThemeToggle = lazy(() => import('./components/ThemeToggle'));

import { Leaf, Award, Compass, MessageSquare, ShoppingBag, PlusCircle, LayoutDashboard, RefreshCw } from 'lucide-react';

export default function App() {
  const [baseline, setBaseline] = useState(null);
  const [target, setTarget] = useState(20);
  const [loggedActivities, setLoggedActivities] = useState([]);
  const [redeemedOffsets, setRedeemedOffsets] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedBaseline = localStorage.getItem('aether_baseline');
      const storedTarget = localStorage.getItem('aether_target');
      const storedActivities = localStorage.getItem('aether_activities');
      const storedRedeemed = localStorage.getItem('aether_redeemed');
      const storedPoints = localStorage.getItem('aether_points');
      const storedStreak = localStorage.getItem('aether_streak');

      if (storedBaseline) setBaseline(JSON.parse(storedBaseline));
      if (storedTarget) setTarget(parseInt(storedTarget, 10));
      if (storedActivities) setLoggedActivities(JSON.parse(storedActivities));
      if (storedRedeemed) setRedeemedOffsets(JSON.parse(storedRedeemed));
      if (storedPoints) setPoints(parseInt(storedPoints, 10));
      if (storedStreak) setStreak(parseInt(storedStreak, 10));
    } catch (e) {
      console.error('Failed to load storage details', e);
    }
    setLoading(false);
  }, []);

  // Save to LocalStorage helpers
  const saveBaseline = (base, tar) => {
    setBaseline(base);
    setTarget(tar);
    localStorage.setItem('aether_baseline', JSON.stringify(base));
    localStorage.setItem('aether_target', tar.toString());
  };

  const handleLogActivity = useCallback((activity) => {
    const updated = [activity, ...loggedActivities];
    setLoggedActivities(updated);
    localStorage.setItem('aether_activities', JSON.stringify(updated));

    const newPoints = points + activity.pointsEarned;
    setPoints(newPoints);
    localStorage.setItem('aether_points', newPoints.toString());

    if (loggedActivities.length === 0) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('aether_streak', newStreak.toString());
    }
  }, [loggedActivities, points, streak]);

  const handleDeleteActivity = useCallback((id) => {
    const actToDelete = loggedActivities.find(a => a.id === id);
    const updated = loggedActivities.filter(a => a.id !== id);
    setLoggedActivities(updated);
    localStorage.setItem('aether_activities', JSON.stringify(updated));

    if (actToDelete) {
      const newPoints = Math.max(0, points - actToDelete.pointsEarned);
      setPoints(newPoints);
      localStorage.setItem('aether_points', newPoints.toString());
    }
  }, [loggedActivities, points]);

  const handleRedeemOffset = useCallback((offset) => {
    const updatedRedeemed = [offset, ...redeemedOffsets];
    setRedeemedOffsets(updatedRedeemed);
    localStorage.setItem('aether_redeemed', JSON.stringify(updatedRedeemed));

    const newPoints = points - offset.cost;
    setPoints(newPoints);
    localStorage.setItem('aether_points', newPoints.toString());

    const offsetActivity = {
      id: offset.id,
      date: offset.date,
      category: 'consumption',
      activity: `Funded Project: ${offset.title}`,
      co2Impact: -offset.offsetKg,
      amount: 1,
      unit: 'project funded',
      pointsEarned: 0
    };
    const updatedActivities = [offsetActivity, ...loggedActivities];
    setLoggedActivities(updatedActivities);
    localStorage.setItem('aether_activities', JSON.stringify(updatedActivities));
  }, [redeemedOffsets, points, loggedActivities]);

  const handleReset = () => {
    if (window.confirm('Resetting your account will delete baseline metrics and logging histories. Continue?')) {
      setBaseline(null);
      setTarget(20);
      setLoggedActivities([]);
      setRedeemedOffsets([]);
      setPoints(0);
      setStreak(1);
      setActiveTab('dashboard');
      localStorage.clear();
    }
  };

  // Sum up savings (negative carbon values in activities)
  const totalSavingsKg = loggedActivities
    .filter(a => a.co2Impact < 0)
    .reduce((sum, a) => sum + Math.abs(a.co2Impact), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <Leaf className="glow-effect" size={48} color="var(--accent-green)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Premium Header Layout */}
      <header className="glass-panel" style={{
        margin: '20px',
        padding: '16px 32px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(12, 16, 29, 0.7)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{ background: 'var(--gradient-eco)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <Leaf size={20} color="#050609" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800', tracking: '-0.02em', background: 'var(--gradient-eco)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AetherEco
          </span>
        </div>

        {/* Action Panel: Reset & Points Indicator */}
        {baseline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ThemeToggle />
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset configuration baseline"
              aria-label="Reset configuration"
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>
        )}
      </header>

      {/* Primary Dashboard Content Area */}
      <main style={{ flexGrow: 1, padding: '0 20px 40px 20px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {!baseline ? (
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', fontWeight: '800' }}>
              Track. Reduce. Offset.
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>
              Calculate your current footprint baseline, implement habit changes, and redeem virtual offsets.
            </p>
            <Suspense fallback={<div>Loading...</div>}>
              <Onboarding onComplete={(base, answers) => saveBaseline(base, parseInt(answers.reductionTarget, 10))} />
            </Suspense>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Tabs Navigation Layout */}
            <div className="tab-nav">
              <button onClick={() => setActiveTab('dashboard')} className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Overview
              </button>
              <button onClick={() => setActiveTab('logger')} className={`tab-btn ${activeTab === 'logger' ? 'active' : ''}`}>
                <PlusCircle size={16} /> Log Activity
              </button>
              <button onClick={() => setActiveTab('action')} className={`tab-btn ${activeTab === 'action' ? 'active' : ''}`}>
                <Leaf size={16} /> Actions & Habits
              </button>
              <button onClick={() => setActiveTab('offsets')} className={`tab-btn ${activeTab === 'offsets' ? 'active' : ''}`}>
                <ShoppingBag size={16} /> Offsets Shop
              </button>
              <button onClick={() => setActiveTab('sandbox')} className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}>
                <Compass size={16} /> Sandbox Simulator
              </button>
              <button onClick={() => setActiveTab('calculator')} className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}>
                <Compass size={16} /> Carbon Calculator
              </button>
              <button onClick={() => setActiveTab('chat')} className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}>
                <MessageSquare size={16} /> EcoAI Assistant
              </button>
            </div>

            {/* Active components views */}
                savings={totalSavingsKg} 
                points={points} 
                streak={streak}
                loggedActivities={loggedActivities}
              />
            )}

            {activeTab === 'logger' && (
              <ActivityLogger 
                onLogActivity={handleLogActivity} 
                loggedActivities={loggedActivities}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {activeTab === 'action' && (
              <ActionCenter 
                baseline={baseline} 
                onLogHabit={handleLogActivity} 
                points={points}
              />
            )}

            {activeTab === 'offsets' && (
              <OffsetMarket 
                points={points} 
                onRedeemOffset={handleRedeemOffset}
                redeemedOffsets={redeemedOffsets}
              />
            )}

            {activeTab === 'calculator' && (
              <CarbonCalculator baseline={baseline} />
            )}

            {activeTab === 'chat' && (
              <EcoChat />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '24px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        color: 'var(--text-muted)',
        fontSize: '12px'
      }}>
        AetherEco Carbon Management Platform © 2026. Made with 🍃 for a Carbon Neutral future.
      </footer>
    </div>
  );
}
