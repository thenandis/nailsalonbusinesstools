import React, { useState, useEffect } from 'react';
import servicesData from '../data/RevenueStreams.js';
import { getNumericValue, createNumericHandler } from '../utils/numericInputUtils.js';
import Tooltip from './common/Tooltip';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function RevenueStreams() {
  const { translations: t } = useTranslationContext();
  
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');

  // Load data on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('revenueStreams');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      setServices(servicesData);
    }
  }, []);

  // Save to localStorage whenever services change
  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem('revenueStreams', JSON.stringify(services));
      // Notify other components (Break-Even Analysis) that revenue data changed
      try {
        window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
          detail: { componentName: 'revenue', timestamp: Date.now() }
        }));
      } catch (e) {
        // ignore in environments without window or CustomEvent
      }
    }
  }, [services]);

  const handleChange = (idx, field, value) => {
    const updated = [...services];
    updated[idx][field] = value;
    setServices(updated);
  };

  const addNewService = () => {
    if (!newServiceName.trim()) {
      alert(t.budgetTool.revenue.pleaseEnterServiceName);
      return;
    }
    
    const newService = {
      name: newServiceName.trim(),
      price: 0,
      count: 0
    };
    
    setServices([...services, newService]);
    setNewServiceName('');
  };

  const removeService = (idx) => {
    const updated = services.filter((_, index) => index !== idx);
    setServices(updated);
  };

  const resetToDefaults = () => {
    if (window.confirm(t.common.resetConfirmMessage)) {
      setServices(servicesData);
      localStorage.removeItem('revenueStreams');
    }
  };

  const totalRevenue = services.reduce(
    (sum, s) => sum + (getNumericValue(s.price) * getNumericValue(s.count)),
    0
  );

  return (
    <div className="component-container">
      <h2>{t.budgetTool.revenue.revenueStreamsPricingStrategy}</h2>
      
      {/* Reset and Add New Service Section */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>{t.budgetTool.revenue.manageServices}</h3>
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
            placeholder={t.budgetTool.revenue.enterServiceNamePlaceholder}
            value={newServiceName}
            onChange={e => setNewServiceName(e.target.value)}
            style={{ minWidth: '200px' }}
          />
          <button onClick={addNewService} style={{ padding: '8px 16px' }}>
            {t.budgetTool.revenue.addService}
          </button>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>{t.budgetTool.revenue.service}</th>
              <th>{t.budgetTool.revenue.price}</th>
              <th>{t.budgetTool.revenue.servicesPerWeek}</th>
              <th>{t.budgetTool.revenue.weeklyRevenue}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, idx) => (
              <tr key={`${s.name}-${idx}`}>
                <td>{s.name}</td>
                <td>
                  <input
                    type="number"
                    value={s.price}
                    min={0}
                    onChange={createNumericHandler((value) => handleChange(idx, 'price', value), true)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={s.count}
                    min={0}
                    onChange={createNumericHandler((value) => handleChange(idx, 'count', value))}
                  />
                </td>
                <td>
                  <Tooltip text={`${s.serviceName}: $${getNumericValue(s.price).toFixed(2)} × ${getNumericValue(s.count)} services = $${(getNumericValue(s.price) * getNumericValue(s.count)).toFixed(2)} weekly revenue`}>
                    ${(getNumericValue(s.price) * getNumericValue(s.count)).toFixed(2)}
                  </Tooltip>
                </td>
                <td>
                  <button 
                    onClick={() => removeService(idx)}
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    {t.budgetTool.supplemental.removeCostItem}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {services.map((s, idx) => (
          <div key={`${s.name}-${idx}`} className="service-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{s.name}</h4>
              <button 
                onClick={() => removeService(idx)}
                style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
              >
                {t.budgetTool.supplemental.removeCostItem}
              </button>
            </div>
            <div className="card-row">
              <label>{t.budgetTool.revenue.price}:</label>
              <input
                type="number"
                value={s.price}
                min={0}
                onChange={createNumericHandler((value) => handleChange(idx, 'price', value), true)}
              />
            </div>
            <div className="card-row">
              <label>{t.budgetTool.revenue.servicesPerWeek}:</label>
              <input
                type="number"
                value={s.count}
                min={0}
                onChange={createNumericHandler((value) => handleChange(idx, 'count', value))}
              />
            </div>
            <div className="card-row">
              <label>{t.budgetTool.revenue.weeklyRevenue}:</label>
              <span className="value">
                <Tooltip text={`${s.serviceName}: $${getNumericValue(s.price).toFixed(2)} × ${getNumericValue(s.count)} services = $${(getNumericValue(s.price) * getNumericValue(s.count)).toFixed(2)} weekly revenue`}>
                  ${(getNumericValue(s.price) * getNumericValue(s.count)).toFixed(2)}
                </Tooltip>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="summary">
        <div>
          <strong>{t.budgetTool.revenue.totalWeeklyRevenue}</strong> 
          <Tooltip text={`Sum of all service revenues: ${services.map(s => `${s.serviceName} ($${(getNumericValue(s.price) * getNumericValue(s.count)).toFixed(2)})`).join(' + ')} = $${totalRevenue.toFixed(2)}`}>
            ${totalRevenue.toFixed(2)}
          </Tooltip>
        </div>
        <div>
          <strong>{t.budgetTool.revenue.estimatedAnnualRevenue}</strong> 
          <Tooltip text={`Weekly Revenue ($${totalRevenue.toFixed(2)}) × 52 weeks = $${(totalRevenue * 52).toFixed(2)} per year`}>
            ${(totalRevenue * 52).toFixed(2)}
          </Tooltip>
        </div>
        <div style={{ marginTop: '15px', fontStyle: 'italic', fontSize: '14px' }}>
          {t.budgetTool.revenue.comparePricesAdvice}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
          * {t.common.changesAutomaticallySaved}
        </div>
      </div>
    </div>
  );
}
