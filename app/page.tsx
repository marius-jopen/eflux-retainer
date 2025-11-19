'use client';

import { useState } from 'react';
import {
  calculateAll,
  formatCurrency,
  type CalculationInputs,
} from '@/lib/calculations';
import { defaultSettings } from '@/lib/settings';

export default function Home() {
  const [inputs, setInputs] = useState<CalculationInputs>(defaultSettings);

  const results = calculateAll(inputs);

  const updateInput = (key: keyof CalculationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container">
      <h1>💰 Your Retainer Costs</h1>

      <div className="input-group" style={{ 
        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #667eea40',
        marginBottom: '30px'
      }}>
        <label htmlFor="hours" style={{ fontSize: '1.1em', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
          ⚡ Number of Hours (per month)
        </label>
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
            style={{
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              fontSize: '1.1em',
              fontWeight: '500'
            }}
          />
        </div>
        <div className="info-text" style={{ marginTop: '8px', fontSize: '0.9em' }}>
          💡 Change this number to see how it affects your costs. Minimum 20 hours per month.
        </div>
      </div>

      <div className="rate-section">
        <h2>Hourly Rates & Breakdown</h2>
        <table className="rates-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Rate per Hour</th>
              <th>Hours Used</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Calculate combined cost for first 20 hours (retainer + 20 hours × rate)
              const first20HoursCost = inputs.retainer + (20 * inputs.clientRate1);
              const effectiveRateForFirst20 = first20HoursCost / 20;
              // Actual cost for tier1 hours used (retainer + actual hours × rate)
              const actualTier1Cost = inputs.retainer + (results.hourBreakdown.tier1 * inputs.clientRate1);
              
              return (
                <>
                  <tr>
                    <td>20 hours</td>
                    <td>{formatCurrency(effectiveRateForFirst20)}</td>
                    <td>{results.hourBreakdown.tier1.toFixed(1)} hours</td>
                    <td className="cost-cell">{formatCurrency(actualTier1Cost)}</td>
                  </tr>
                  <tr>
                    <td>20 - 40 hours</td>
                    <td>{formatCurrency(inputs.clientRate2)}</td>
                    <td>{results.hourBreakdown.tier2.toFixed(1)} hours</td>
                    <td className="cost-cell">{formatCurrency(results.hourBreakdown.tier2 * inputs.clientRate2)}</td>
                  </tr>
                  <tr>
                    <td>Above 40 hours</td>
                    <td>{formatCurrency(inputs.clientRate3)}</td>
                    <td>{results.hourBreakdown.tier3.toFixed(1)} hours</td>
                    <td className="cost-cell">{formatCurrency(results.hourBreakdown.tier3 * inputs.clientRate3)}</td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
      </div>

      <div className="results">
        <div className="profit-highlight">
          <div className="result-item" style={{ borderBottom: 'none', padding: 0 }}>
            <span className="result-label">Total Cost This Month</span>
            <span className="result-value">{formatCurrency(results.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

