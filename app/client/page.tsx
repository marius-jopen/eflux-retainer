'use client';

import { useState, useEffect } from 'react';
import {
  calculateAll,
  formatCurrency,
  type CalculationInputs,
} from '@/lib/calculations';
import { defaultSettings } from '@/lib/settings';

export default function ClientPage() {
  const [inputs, setInputs] = useState<CalculationInputs>(defaultSettings);

  useEffect(() => {
    document.body.classList.add('client-page');
    return () => {
      document.body.classList.remove('client-page');
    };
  }, []);

  const results = calculateAll(inputs);

  const updateInput = (key: keyof CalculationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="client-container">
      <div className="client-content">
        <h1 className="client-title">Retainer Costs</h1>

        <div className="client-section">
          <div className="client-input-group">
            <label htmlFor="hours" className="client-label">
              Number of Hours (per month)
            </label>
            <input
              type="number"
              id="hours"
              className="client-input"
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
        </div>

        <div className="client-section">
          <h2 className="client-section-title">Hourly Rates & Breakdown</h2>
          <table className="client-table">
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
                const first20HoursCost = inputs.retainer + (20 * inputs.clientRate1);
                const effectiveRateForFirst20 = first20HoursCost / 20;
                const actualTier1Cost = inputs.retainer + (results.hourBreakdown.tier1 * inputs.clientRate1);
                
                return (
                  <>
                    <tr>
                      <td>20 hours</td>
                      <td>{formatCurrency(effectiveRateForFirst20)}</td>
                      <td>{results.hourBreakdown.tier1.toFixed(1)} hours</td>
                      <td className="client-cost-cell">{formatCurrency(actualTier1Cost)}</td>
                    </tr>
                    <tr>
                      <td>20 - 40 hours</td>
                      <td>{formatCurrency(inputs.clientRate2)}</td>
                      <td>{results.hourBreakdown.tier2.toFixed(1)} hours</td>
                      <td className="client-cost-cell">{formatCurrency(results.hourBreakdown.tier2 * inputs.clientRate2)}</td>
                    </tr>
                    <tr>
                      <td>Above 40 hours</td>
                      <td>{formatCurrency(inputs.clientRate3)}</td>
                      <td>{results.hourBreakdown.tier3.toFixed(1)} hours</td>
                      <td className="client-cost-cell">{formatCurrency(results.hourBreakdown.tier3 * inputs.clientRate3)}</td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>

        <div className="client-section">
          <div className="client-total">
            <span className="client-total-label">Total Cost This Month</span>
            <span className="client-total-value">{formatCurrency(results.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

