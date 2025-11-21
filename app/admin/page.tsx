'use client';

import { useState, useEffect } from 'react';
import {
  calculateAll,
  formatCurrency,
  type CalculationInputs,
} from '@/lib/calculations';
import { defaultSettings } from '@/lib/settings';

const ADMIN_PASSWORD = 'nI01weFvFuU!';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState<CalculationInputs>(defaultSettings);

  useEffect(() => {
    // Remove client-page class for admin styling
    document.body.classList.remove('client-page');
    
    // Check if already authenticated in sessionStorage
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    return () => {
      // Restore client-page class when leaving admin
      document.body.classList.add('client-page');
    };
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const updateInput = (key: keyof CalculationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ maxWidth: '400px' }}>
        <h1>🔒 Admin Access</h1>
        <form onSubmit={handlePasswordSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                style={{ paddingLeft: '15px' }}
                autoFocus
              />
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.9em', marginTop: '8px' }}>
                {error}
              </div>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Access Admin View
          </button>
        </form>
      </div>
    );
  }

  const results = calculateAll(inputs);

  return (
    <div className="container">
      <h1>💰 Retainer Calculator - Admin</h1>

      <div className="input-group">
        <label htmlFor="retainer">Basic Retainer Fee (per month)</label>
        <div className="input-wrapper">
          <span className="currency-symbol">€</span>
          <input
            type="number"
            id="retainer"
            value={inputs.retainer}
            onChange={(e) => updateInput('retainer', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="info-text">Fixed monthly payment regardless of hours</div>
      </div>

      <div className="input-group">
        <label htmlFor="hours">Number of Hours (per month)</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="hours"
            value={inputs.hours}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                updateInput('hours', value);
              }
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value) || value < 20) {
                updateInput('hours', 20);
              }
            }}
            min="20"
            step="0.1"
          />
        </div>
        <div className="info-text">Minimum 20 hours per month</div>
      </div>

      <div className="rate-section">
        <h2>Client Hourly Rates (Charged to Client)</h2>
        <div className="rate-tier">
          <span className="tier-label">0 - 20 hours:</span>
          <div className="tier-input-wrapper">
            <span className="currency-symbol">€</span>
            <input
              type="number"
              id="clientRate1"
              value={inputs.clientRate1}
              onChange={(e) =>
                updateInput('clientRate1', parseFloat(e.target.value) || 0)
              }
              min="0"
              step="0.01"
              className="tier-input"
            />
          </div>
        </div>
        <div className="rate-tier">
          <span className="tier-label">20 - 40 hours:</span>
          <div className="tier-input-wrapper">
            <span className="currency-symbol">€</span>
            <input
              type="number"
              id="clientRate2"
              value={inputs.clientRate2}
              onChange={(e) =>
                updateInput('clientRate2', parseFloat(e.target.value) || 0)
              }
              min="0"
              step="0.01"
              className="tier-input"
            />
          </div>
        </div>
        <div className="rate-tier">
          <span className="tier-label">Above 40 hours:</span>
          <div className="tier-input-wrapper">
            <span className="currency-symbol">€</span>
            <input
              type="number"
              id="clientRate3"
              value={inputs.clientRate3}
              onChange={(e) =>
                updateInput('clientRate3', parseFloat(e.target.value) || 0)
              }
              min="0"
              step="0.01"
              className="tier-input"
            />
          </div>
        </div>
      </div>

      <div className="developer-section-group">
        <div className="rate-section" style={{ background: 'transparent', padding: 0, marginBottom: '20px' }}>
          <h2>Developer Retainer (Fixed Cost)</h2>
          <div className="rate-tier">
            <span className="tier-label">Retainer Hours:</span>
            <div className="tier-input-wrapper">
              <input
                type="number"
                id="developerRetainerHours"
                value={inputs.developerRetainerHours}
                onChange={(e) =>
                  updateInput('developerRetainerHours', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.1"
                className="tier-input"
                style={{ paddingLeft: '15px' }}
              />
            </div>
          </div>
          <div className="rate-tier">
            <span className="tier-label">Retainer Rate:</span>
            <div className="tier-input-wrapper">
              <span className="currency-symbol">€</span>
              <input
                type="number"
                id="developerRetainerRate"
                value={inputs.developerRetainerRate}
                onChange={(e) =>
                  updateInput('developerRetainerRate', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
                className="tier-input"
              />
            </div>
          </div>
          <div className="retainer-cost-display">
            <span className="retainer-cost-label">Fixed Retainer Cost:</span>
            <span className="retainer-cost-value">
              {formatCurrency(results.developerRetainerCost)}
            </span>
          </div>
          <div className="info-text" style={{ marginTop: '10px' }}>
            Fixed monthly cost regardless of hours worked
          </div>
        </div>

        <div className="rate-section" style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
          <h2>Developer Hourly Rates (For Hours Beyond Retainer)</h2>
          <div className="rate-tier">
            <span className="tier-label">0 - 20 hours:</span>
            <div className="tier-input-wrapper">
              <span className="currency-symbol">€</span>
              <input
                type="number"
                id="developerRate1"
                value={inputs.developerRate1}
                onChange={(e) =>
                  updateInput('developerRate1', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
                className="tier-input"
              />
            </div>
          </div>
          <div className="rate-tier">
            <span className="tier-label">20 - 40 hours:</span>
            <div className="tier-input-wrapper">
              <span className="currency-symbol">€</span>
              <input
                type="number"
                id="developerRate2"
                value={inputs.developerRate2}
                onChange={(e) =>
                  updateInput('developerRate2', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
                className="tier-input"
              />
            </div>
          </div>
          <div className="rate-tier">
            <span className="tier-label">Above 40 hours:</span>
            <div className="tier-input-wrapper">
              <span className="currency-symbol">€</span>
              <input
                type="number"
                id="developerRate3"
                value={inputs.developerRate3}
                onChange={(e) =>
                  updateInput('developerRate3', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
                className="tier-input"
              />
            </div>
          </div>
          <div className="info-text" style={{ marginTop: '10px' }}>
            Applied to hours beyond retainer based on total hours worked
          </div>
        </div>
      </div>

      <div className="results">
        <div className="breakdown">
          <div className="breakdown-title">Hour Breakdown</div>
          <div className="breakdown-item">
            <span>0-20 hours:</span>
            <span>{results.hourBreakdown.tier1.toFixed(1)} hours</span>
          </div>
          <div className="breakdown-item">
            <span>20-40 hours:</span>
            <span>{results.hourBreakdown.tier2.toFixed(1)} hours</span>
          </div>
          <div className="breakdown-item">
            <span>Above 40 hours:</span>
            <span>{results.hourBreakdown.tier3.toFixed(1)} hours</span>
          </div>
        </div>
        <div className="result-item">
          <span className="result-label">Revenue from Hours</span>
          <span className="result-value">{formatCurrency(results.revenueFromHours)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Total Revenue</span>
          <span className="result-value">{formatCurrency(results.totalRevenue)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Total Cost</span>
          <span className="result-value">{formatCurrency(results.totalCost)}</span>
        </div>
        <div className="profit-highlight">
          <div className="result-item" style={{ borderBottom: 'none', padding: 0 }}>
            <span className="result-label">Profit</span>
            <span
              className={`result-value ${results.profit >= 0 ? 'positive' : 'negative'}`}
            >
              {formatCurrency(results.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

