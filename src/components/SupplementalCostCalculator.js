import React, { useState } from 'react';
import supplementalCostsData from '../data/SupplementalCosts.js';
import { getNumericValue, createNumericHandler, formatCurrency } from '../utils/numericInputUtils.js';
import Tooltip from './common/Tooltip';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function SupplementalCosts({ costs, setCosts, onDataChange }) {
  const { translations: t } = useTranslationContext();
  // Use props if provided, otherwise use local state
  const [localCosts, setLocalCosts] = useState(supplementalCostsData);
  const [newCostItem, setNewCostItem] = useState('');
  const [newCostFrequency, setNewCostFrequency] = useState('monthly');
  const currentCosts = costs || localCosts;
  const currentSetCosts = setCosts || setLocalCosts;

  // Listen for a global reset event to re-save defaults for real-time sync
  React.useEffect(() => {
    const handleBudgetDataReset = (e) => {
      if (!e.detail || e.detail.componentName === 'all' || e.detail.componentName === 'supplemental') {
        currentSetCosts(supplementalCostsData);
      }
    };
    window.addEventListener('budgetDataReset', handleBudgetDataReset);
    return () => window.removeEventListener('budgetDataReset', handleBudgetDataReset);
  }, [currentSetCosts]);

  // On mount, always save default values to localStorage if not present
  // Notify parent when data changes
  React.useEffect(() => {
    const monthlySupplemental = localStorage.getItem('monthlySupplementalCosts');
    const totalAnnualSupplementalCosts = localStorage.getItem('totalAnnualSupplementalCosts');
    if (monthlySupplemental === null && totalAnnualSupplementalCosts === null) {
      const totalSupplementalCosts = currentCosts.reduce((sum, cost) => sum + (cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost), 0);
      localStorage.setItem('totalAnnualSupplementalCosts', totalSupplementalCosts.toString());
      localStorage.setItem('monthlySupplementalCosts', (totalSupplementalCosts / 12).toString());
      window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
        detail: { componentName: 'supplemental', timestamp: Date.now() }
      }));
    }
    if (onDataChange) {
      onDataChange('supplemental', { costs: currentCosts });
    }
  }, [currentCosts, onDataChange]);

  const handleCostChange = (index, value) => {
    const updatedCosts = [...currentCosts];
    updatedCosts[index].cost = getNumericValue(value);
    currentSetCosts(updatedCosts);
  };

  const addNewCostItem = () => {
    if (!newCostItem.trim()) {
      alert(t.budgetTool.supplemental.pleaseEnterCostItem);
      return;
    }
    
    const newCost = {
      item: newCostItem.trim(),
      frequency: newCostFrequency,
      cost: 0
    };
    
    currentSetCosts([...currentCosts, newCost]);
    setNewCostItem('');
  };

  const removeCostItem = (index) => {
    const updatedCosts = currentCosts.filter((_, idx) => idx !== index);
    currentSetCosts(updatedCosts);
  };

  const resetToDefaults = () => {
    if (window.confirm(t.common.resetConfirmMessage)) {
      currentSetCosts(supplementalCostsData);
      // Wait for state to update, then dispatch a real-time sync event to refresh budget tool values
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
          detail: { componentName: 'supplemental', timestamp: Date.now(), reset: true }
        }));
      }, 0);
    }
  };

  const calculateAnnualCost = (cost) => {
    if (cost.frequency === 'monthly') {
      return cost.cost * 12;
    }
    return cost.cost; // annual
  };

  const totalSupplementalCosts = currentCosts.reduce((sum, cost) => sum + calculateAnnualCost(cost), 0);

  // Save total and monthly to localStorage for W2 vs 1099 Model integration
  React.useEffect(() => {
    localStorage.setItem('totalAnnualSupplementalCosts', totalSupplementalCosts.toString());
    localStorage.setItem('monthlySupplementalCosts', (totalSupplementalCosts / 12).toString());
    // Dispatch a custom event for real-time sync
    window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
      detail: { componentName: 'supplemental', timestamp: Date.now() }
    }));
  }, [totalSupplementalCosts]);

  return (
    <div className="component-container">
      <h2>{t.budgetTool.supplemental.calculator}</h2>
      
      {/* Reset and Add New Section */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>{t.budgetTool.supplemental.manageSupplementalCosts}</h3>
          <button 
            onClick={resetToDefaults}
            style={{ 
              padding: '6px 12px', 
              backgroundColor: '#ffc107', 
              color: '#212529', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {t.common.resetToDefaults}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder={t.budgetTool.supplemental.enterCostItemPlaceholder}
            value={newCostItem}
            onChange={e => setNewCostItem(e.target.value)}
            style={{ minWidth: '200px' }}
          />
          <select
            value={newCostFrequency}
            onChange={e => setNewCostFrequency(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="monthly">{t.budgetTool.supplemental.monthlyFrequency}</option>
            <option value="annual">{t.budgetTool.supplemental.annualFrequency}</option>
          </select>
          <button onClick={addNewCostItem} style={{ padding: '8px 16px' }}>
            {t.budgetTool.supplemental.addCostItem}
          </button>
        </div>
      </div>

      {/* Cost Items List */}
      {currentCosts.map((cost, index) => (
        <div key={`${cost.item}-${index}`} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ margin: 0, fontWeight: 'bold' }}>
              {cost.item} ({cost.frequency}): $
            </label>
            <button 
              onClick={() => removeCostItem(index)}
              style={{ 
                padding: '4px 8px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {t.budgetTool.supplemental.removeCostItem}
            </button>
          </div>
          <input 
            type="number" 
            value={cost.cost} 
            onChange={createNumericHandler((value) => handleCostChange(index, value), true)}
            style={{ width: '100%', maxWidth: '200px', marginBottom: '5px' }}
          />
          <div style={{ fontSize: '14px', color: '#666' }}>
            {t.budgetTool.supplemental.annualCost}: 
            <Tooltip text={`${cost.item}: ${formatCurrency(getNumericValue(cost.cost))} ${cost.frequency} × ${cost.frequency === 'monthly' ? '12' : cost.frequency === 'weekly' ? '52' : '1'} = ${formatCurrency(calculateAnnualCost(cost))} annually`}>
              {formatCurrency(calculateAnnualCost(cost))}
            </Tooltip>
          </div>
        </div>
      ))}
      
      <hr />
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>
        <strong>{t.budgetTool.supplemental.totalAnnualSupplementalCosts}</strong> 
        <Tooltip text={`Sum of all supplemental costs: ${currentCosts.map(c => `${c.item} (${formatCurrency(calculateAnnualCost(c))})`).join(' + ')} = ${formatCurrency(totalSupplementalCosts)}`}>
          {formatCurrency(totalSupplementalCosts)}
        </Tooltip>
      </div>
    </div>
  );
}
