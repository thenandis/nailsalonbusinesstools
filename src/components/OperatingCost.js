import React, { useState, useEffect } from 'react';
import operatingCostsData from '../data/OperatingCosts.js';
import { getNumericValue, createNumericHandler, formatCurrency } from '../utils/numericInputUtils.js';
import Tooltip from './common/Tooltip';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function OperatingCosts() {
  const { translations: t } = useTranslationContext();
  
  const [costs, setCosts] = useState([]);
  const [newCostCategory, setNewCostCategory] = useState('');

  // Load data on component mount
  useEffect(() => {
    const savedCosts = localStorage.getItem('operatingCosts');
    if (savedCosts) {
      setCosts(JSON.parse(savedCosts));
    } else {
      setCosts(operatingCostsData);
      // Always save defaults to localStorage if not present
      localStorage.setItem('operatingCosts', JSON.stringify(operatingCostsData));
      // Also save total and monthly for W2 vs 1099 Model integration
      const total = operatingCostsData.reduce((sum, cost) => sum + cost.annualCost, 0);
      localStorage.setItem('totalAnnualOperatingCosts', total.toString());
      localStorage.setItem('monthlyOperatingCosts', (total / 12).toString());
      // Dispatch a custom event for real-time sync
      window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
        detail: { componentName: 'operating', timestamp: Date.now() }
      }));
    }
  }, []);

  // Save to localStorage whenever costs change
  useEffect(() => {
    if (costs.length > 0) {
      localStorage.setItem('operatingCosts', JSON.stringify(costs));
    }
  }, [costs]);

  const handleCostChange = (index, value) => {
    const updatedCosts = [...costs];
    updatedCosts[index].annualCost = getNumericValue(value);
    setCosts(updatedCosts);
  };

  const addNewCostCategory = () => {
    if (!newCostCategory.trim()) {
      alert(t.budgetTool.operating.pleaseEnterCostCategory);
      return;
    }
    
    const newCost = {
      category: newCostCategory.trim(),
      annualCost: 0
    };
    
    setCosts([...costs, newCost]);
    setNewCostCategory('');
  };

  const removeCostCategory = (index) => {
    const updatedCosts = costs.filter((_, idx) => idx !== index);
    setCosts(updatedCosts);
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset to new realistic California industry standard defaults?\n\nThis will replace your current costs with updated realistic values:\n• Total Annual Operating Costs: ~$103,000 (down from ~$555,000)\n• Supplies: $12,000 • Rent: $48,000 • Office: $2,400\n\nClick OK to proceed.")) {
      setCosts(operatingCostsData);
      localStorage.removeItem('operatingCosts');
      alert("✅ Operating costs reset to realistic California industry standards!\n\nYour break-even analysis now shows achievable targets.");
    }
  };

  const totalOperatingCosts = costs.reduce((sum, cost) => sum + cost.annualCost, 0);

  // Save total and monthly to localStorage for W2 vs 1099 Model integration
  useEffect(() => {
    localStorage.setItem('totalAnnualOperatingCosts', totalOperatingCosts.toString());
    localStorage.setItem('monthlyOperatingCosts', (totalOperatingCosts / 12).toString());
    // Dispatch a custom event for real-time sync
    window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
      detail: { componentName: 'operating', timestamp: Date.now() }
    }));
  }, [totalOperatingCosts]);

  return (
    <div className="component-container">
      <h2>{t.budgetTool.operating.calculator}</h2>
      
      {/* Reset and Add New Section */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>{t.budgetTool.operating.manageCostCategories}</h3>
          <button 
            onClick={resetToDefaults}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            🔄 {t.common.resetToDefaults}
          </button>
        </div>
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          borderRadius: '4px', 
          padding: '8px', 
          marginBottom: '10px',
          fontSize: '12px',
          color: '#155724'
        }}>
          💡 <strong>Click "Reset to Defaults" to load default values. This will remove your added items and values.</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder={t.budgetTool.operating.enterCostCategoryPlaceholder}
            value={newCostCategory}
            onChange={e => setNewCostCategory(e.target.value)}
            style={{ minWidth: '200px' }}
          />
          <button onClick={addNewCostCategory} style={{ padding: '8px 16px' }}>
            {t.budgetTool.operating.addCategory}
          </button>
        </div>
      </div>

      {/* Cost Categories List */}
      {costs.map((cost, index) => (
        <div key={`${cost.category}-${index}`} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ margin: 0, fontWeight: 'bold' }}>
              {cost.category} (annual): $
            </label>
            <button 
              onClick={() => removeCostCategory(index)}
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
            value={cost.annualCost} 
            onChange={createNumericHandler((value) => handleCostChange(index, value), true)}
            style={{ width: '100%', maxWidth: '200px' }}
          />
        </div>
      ))}
      
      <hr />
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>
        <strong>{t.budgetTool.operating.totalAnnualOperatingCosts}</strong> 
        <Tooltip text={`Sum of all annual operating expenses: ${costs.map(c => `${c.category} (${formatCurrency(getNumericValue(c.annualCost))})`).join(' + ')} = ${formatCurrency(totalOperatingCosts)}`}>
          {formatCurrency(totalOperatingCosts)}
        </Tooltip>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
        * {t.common.changesAutomaticallySaved}
      </div>
    </div>
  );
}
