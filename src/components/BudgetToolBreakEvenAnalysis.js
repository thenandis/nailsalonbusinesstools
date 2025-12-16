import React, { useState, useEffect } from 'react';
import { getNumericValue, formatCurrency } from '../utils/numericInputUtils.js';
import Tooltip from './common/Tooltip';
import servicesData from '../data/RevenueStreams.js';
import operatingCostsData from '../data/OperatingCosts.js';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function BudgetToolBreakEvenAnalysis({ 
  onDataChange, 
  breakEvenData,
  employeeType,
  wage,
  hours,
  supplementalCosts = [],
  enhancedEmployeeData = null
}) {
  const { translations: t } = useTranslationContext();
  
  // States for calculated values
  const [totalAnnualCosts, setTotalAnnualCosts] = useState(0);
  const [customersPerWeek, setCustomersPerWeek] = useState(0);
  const [averageServicePrice, setAverageServicePrice] = useState(0);
  const [totalAnnualRevenue, setTotalAnnualRevenue] = useState(0);
  
  // Get data from localStorage for operating costs and revenue
  const [operatingCosts, setOperatingCosts] = useState([]);
  const [revenueServices, setRevenueServices] = useState([]);

  // Load data from localStorage on component mount and when data changes
  useEffect(() => {
    const loadStoredData = () => {
      // Load operating costs (fall back to default data if none stored)
      const savedOperating = localStorage.getItem('operatingCosts');
      if (savedOperating) {
        try {
          setOperatingCosts(JSON.parse(savedOperating));
        } catch (e) {
          console.error('Error parsing operating costs:', e);
          setOperatingCosts([]);
        }
      } else {
        setOperatingCosts(operatingCostsData || []);
      }
      
      // Load revenue streams (fall back to default services if none stored)
      const savedRevenue = localStorage.getItem('revenueStreams');
      if (savedRevenue) {
        try {
          setRevenueServices(JSON.parse(savedRevenue));
        } catch (e) {
          console.error('Error parsing revenue streams:', e);
          setRevenueServices([]);
        }
      } else {
        // Use built-in sample services so break-even has meaningful defaults
        setRevenueServices(servicesData || []);
      }
    };
    
    loadStoredData();
    
    // Listen for storage changes (when other tabs update data)
    const handleStorageChange = () => {
      loadStoredData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when data is updated in other tabs
    const handleDataUpdate = () => {
      setTimeout(loadStoredData, 100); // Small delay to ensure data is saved
    };
    
    window.addEventListener('budgetDataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('budgetDataUpdated', handleDataUpdate);
    };
  }, []);

  // Calculate total annual costs from employee + supplemental + operating to keep consistent with breakdown
  useEffect(() => {
    let computedEmployeeCosts = 0;

    // Employee costs: prefer enhanced model-provided total if present
    if (enhancedEmployeeData && enhancedEmployeeData.totalAnnualLaborCost) {
      computedEmployeeCosts = getNumericValue(enhancedEmployeeData.totalAnnualLaborCost);
    } else if (enhancedEmployeeData && enhancedEmployeeData.modelType) {
      // Use simplified enhanced model calculations when provided
      const mt = enhancedEmployeeData.modelType;
      if (mt === 'break-even' || mt === 'comprehensive') {
        const totalHours = getNumericValue(enhancedEmployeeData.numTechnicians) * getNumericValue(enhancedEmployeeData.operationHours) * getNumericValue(enhancedEmployeeData.daysOpenPerMonth) * 12;
        const totalAppointments = getNumericValue(enhancedEmployeeData.appointmentsPerTechPerDay) * getNumericValue(enhancedEmployeeData.numTechnicians) * getNumericValue(enhancedEmployeeData.daysOpenPerMonth) * 12;
        if (enhancedEmployeeData.wageModel === 'Commission') {
          computedEmployeeCosts = totalAppointments * getNumericValue(enhancedEmployeeData.avgPricePerService) * (getNumericValue(enhancedEmployeeData.technicianSharePercent || enhancedEmployeeData.commissionPercent) / 100);
        } else {
          let laborCost = totalHours * getNumericValue(wage);
          if (employeeType === 'W2') {
            laborCost += laborCost * 0.0765 + laborCost * 0.02;
          }
          computedEmployeeCosts = laborCost;
        }
      } else {
        // basic / w2-vs-1099
        const weeklyWage = getNumericValue(wage) * getNumericValue(hours);
        const annualWage = weeklyWage * 52;
        // Employer burden intentionally excluded (handled via other cost categories)
        computedEmployeeCosts = annualWage;
      }
    } else {
      // Fallback basic calculation
      const weeklyWage = getNumericValue(wage) * getNumericValue(hours);
      const annualWage = weeklyWage * 52;
      // Employer burden intentionally excluded (handled via other cost categories)
      computedEmployeeCosts = annualWage;
    }

    // Supplemental costs (annualized)
    let computedSupplemental = 0;
    if (supplementalCosts && supplementalCosts.length > 0) {
      supplementalCosts.forEach(cost => {
        const amount = getNumericValue(cost.cost);
        const frequency = cost.frequency || 'monthly';
        switch(frequency) {
          case 'weekly': computedSupplemental += amount * 52; break;
          case 'monthly': computedSupplemental += amount * 12; break;
          case 'quarterly': computedSupplemental += amount * 4; break;
          case 'annual': computedSupplemental += amount; break;
          default: computedSupplemental += amount * 12;
        }
      });
    }

    // Operating costs (annual) loaded from localStorage/OperatingCost component
    let computedOperating = 0;
    if (operatingCosts && operatingCosts.length > 0) {
      operatingCosts.forEach(c => { computedOperating += getNumericValue(c.annualCost) || 0; });
    }

    const grandTotal = computedEmployeeCosts + computedSupplemental + computedOperating;
    setTotalAnnualCosts(grandTotal);
  }, [wage, hours, employeeType, supplementalCosts, operatingCosts, enhancedEmployeeData]);

  // Calculate average service price and customers per week from revenue streams
  useEffect(() => {
  if (revenueServices && revenueServices.length > 0) {
      let totalWeeklyRevenue = 0;
      let totalWeeklyServices = 0;
      
      revenueServices.forEach(service => {
        const price = getNumericValue(service.price) || 0;
        const count = getNumericValue(service.count) || 0;
        
        totalWeeklyRevenue += price * count;
        totalWeeklyServices += count;
      });
      
      setCustomersPerWeek(totalWeeklyServices);
      
      if (totalWeeklyServices > 0) {
        setAverageServicePrice(totalWeeklyRevenue / totalWeeklyServices);
      }
  // Update total annual revenue (weekly revenue × 52)
  setTotalAnnualRevenue(totalWeeklyRevenue * 52);
    } else {
      // Reset to zero if no revenue streams defined
      setCustomersPerWeek(0);
      setAverageServicePrice(0);
  setTotalAnnualRevenue(0);
    }
  }, [revenueServices]);

  // Notify parent when calculated data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange('breakeven', {
        totalAnnualCosts,
  totalAnnualRevenue,
        customersPerWeek,
        averageServicePrice,
        derivedFromOtherTabs: true
      });
    }
  }, [totalAnnualCosts, totalAnnualRevenue, customersPerWeek, averageServicePrice, onDataChange]);

  // Calculations based on derived data
  const servicesPerYear = getNumericValue(customersPerWeek) * 52;
  
  // Calculate break-even based on services and revenue
  const breakEvenPerService = servicesPerYear > 0 ? getNumericValue(totalAnnualCosts) / servicesPerYear : 0;
  const breakEvenRevenue = getNumericValue(totalAnnualCosts);
  const currentAnnualRevenue = getNumericValue(customersPerWeek) * getNumericValue(averageServicePrice) * 52;

  // Helpers for tooltip details
  const totalWeeklyRevenue = (revenueServices || []).reduce((sum, s) => sum + (getNumericValue(s.price) * getNumericValue(s.count)), 0);
  const totalWeeklyServices = (revenueServices || []).reduce((sum, s) => sum + getNumericValue(s.count), 0);

  // Calculate detailed cost breakdown for tooltips
  let employeeCosts = 0;
  let supplementalCostsTotal = 0;
  let operatingCostsTotal = 0;
  let employeeCostBreakdown = '';
  
  // Employee costs calculation
  if (enhancedEmployeeData && enhancedEmployeeData.totalAnnualLaborCost) {
    employeeCosts = getNumericValue(enhancedEmployeeData.totalAnnualLaborCost);
    employeeCostBreakdown = `Employee Costs: ${formatCurrency(employeeCosts)} (from enhanced model)`;
  } else if (wage && hours) {
    const weeklyWage = getNumericValue(wage) * getNumericValue(hours);
    const annualWage = weeklyWage * 52;
    // Employer burden intentionally excluded
    employeeCosts = annualWage;
    employeeCostBreakdown = `Employee Costs: ${formatCurrency(annualWage)} (annual wage).`;
  }
  
  // Supplemental costs calculation
  if (supplementalCosts && supplementalCosts.length > 0) {
    supplementalCosts.forEach(cost => {
      const amount = getNumericValue(cost.cost);
      const frequency = cost.frequency || 'monthly';
      let annualAmount = 0;
      switch(frequency) {
        case 'weekly': annualAmount = amount * 52; break;
        case 'monthly': annualAmount = amount * 12; break;
        case 'quarterly': annualAmount = amount * 4; break;
        case 'annual': annualAmount = amount; break;
        default: annualAmount = amount * 12;
      }
      supplementalCostsTotal += annualAmount;
    });
  }
  
  // Operating costs calculation
  if (operatingCosts && operatingCosts.length > 0) {
    operatingCosts.forEach(cost => {
      operatingCostsTotal += getNumericValue(cost.annualCost) || 0;
    });
  }
  
  // Create detailed breakdown text
  const costBreakdownText = `TOTAL ANNUAL COSTS BREAKDOWN:

${employeeCostBreakdown}
Supplemental Costs: ${formatCurrency(supplementalCostsTotal)} (from ${(supplementalCosts || []).length} items)
Operating Costs: ${formatCurrency(operatingCostsTotal)} (from ${(operatingCosts || []).length} categories)

TOTAL: ${formatCurrency(employeeCosts)} + ${formatCurrency(supplementalCostsTotal)} + ${formatCurrency(operatingCostsTotal)} = ${formatCurrency(totalAnnualCosts)}`;

  const breakEvenCalculationText = `BREAK-EVEN CALCULATION:

Total Annual Costs: ${formatCurrency(totalAnnualCosts)}
÷ Services per Year: ${servicesPerYear}
= Break-even Price per Service: ${formatCurrency(breakEvenPerService)}

This means you need to charge at least ${formatCurrency(breakEvenPerService)} per service to cover all costs.`;

  return (
    <div>
      <h2>{t.budgetTool.analysis.calculator}</h2>
      
      {/* Data Summary - Values derived from other Budget Tool tabs */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px' }}>
          📊 {t.budgetTool.analysis.calculatedFromBudgetToolData}
        </h3>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          {t.budgetTool.analysis.autoCalculatedDescription}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center', maxWidth: '600px' }}>
          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.analysis.totalAnnualRevenue}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
            <Tooltip text={`From Revenue Streams tab - Estimated Annual Revenue`}>
              <strong style={{ color: '#17a2b8' }}>{formatCurrency(totalAnnualRevenue)}</strong>
            </Tooltip>
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.analysis.totalAnnualCosts}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
            {/* Use the computed employeeCostBreakdown which includes per-employee multiplication when available */}
            <Tooltip text={`${employeeCostBreakdown} \nSupplemental: ${formatCurrency(supplementalCostsTotal)} + Operating: ${formatCurrency(operatingCostsTotal)} = ${formatCurrency(totalAnnualCosts)}`}>
              <strong style={{ color: '#28a745' }}>{formatCurrency(totalAnnualCosts)}</strong>
            </Tooltip>
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.analysis.servicesPerWeek}
          </label>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
            <Tooltip text={`Total weekly services from Revenue Streams: ${revenueServices.map(s => `${s.serviceName || s.name} (${getNumericValue(s.count)})`).join(' + ')} = ${customersPerWeek}; weekly revenue = ${formatCurrency(totalWeeklyRevenue)}`}>
              <strong style={{ color: '#007bff' }}>{customersPerWeek}</strong>
            </Tooltip>
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.analysis.averageServicePrice}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
            <span>$</span>
            <Tooltip text={`Total Weekly Revenue (${formatCurrency(totalWeeklyRevenue)}) ÷ Total Weekly Services (${totalWeeklyServices}) = ${formatCurrency(averageServicePrice)}`}>
              <strong style={{ color: '#17a2b8' }}>{formatCurrency(averageServicePrice).replace('$', '')}</strong>
            </Tooltip>
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.analysis.employeeType}
          </label>
          <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ccc' }}>
            <Tooltip text={`From Employee tab: ${employeeType} at $${wage}/hr for ${hours} hours/week`}>
              <strong>{employeeType || t.budgetTool.analysis.notSet}</strong>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Enhanced Employee Model Information */}
      {enhancedEmployeeData && enhancedEmployeeData.modelType && (
        <div style={{ marginBottom: '30px', backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', border: '1px solid #2196f3' }}>
          <h3 style={{ color: '#1976d2', marginTop: 0, marginBottom: '20px' }}>
            👥 {t.budgetTool.analysis.employeeModel} {enhancedEmployeeData.modelType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          
          {enhancedEmployeeData.modelType === 'basic' && (
            <div style={{ fontSize: '14px' }}>
              <p><strong>{t.budgetTool.analysis.basicCalculation}</strong> {t.budgetTool.analysis.basicCalculationDesc}</p>
              <ul style={{ marginLeft: '20px' }}>
                <li>{t.budgetTool.analysis.baseAnnualWage} ${((getNumericValue(wage) * getNumericValue(hours) * 52)).toFixed(2)}</li>
                <li>{t.budgetTool.analysis.employerBurden} ${employeeType === 'W2' ? ((getNumericValue(wage) * getNumericValue(hours) * 52) * 0.25).toFixed(2) : '0.00'}</li>
              </ul>
            </div>
          )}
          
          {enhancedEmployeeData.modelType === 'w2-vs-1099' && (
            <div style={{ fontSize: '14px' }}>
              <p><strong>{t.budgetTool.analysis.serviceBasedCalculation}</strong> {t.budgetTool.analysis.employmentCostAnalysis}</p>
              <ul style={{ marginLeft: '20px' }}>
                <li>{t.budgetTool.analysis.baseWage} ${(getNumericValue(wage) * getNumericValue(hours) * 52).toFixed(2)}</li>
                <li>{t.budgetTool.analysis.servicesPerShift} {enhancedEmployeeData.avgServicesPerShift}</li>
                <li>{t.budgetTool.analysis.pricePerService} ${getNumericValue(enhancedEmployeeData.avgPricePerService).toFixed(2)}</li>
                <li>{t.budgetTool.analysis.technicianShare} {enhancedEmployeeData.technicianSharePercent}%</li>
                {employeeType === 'W2' && (
                  <>
                    <li>{t.budgetTool.analysis.fica} ${((getNumericValue(wage) * getNumericValue(hours) * 52) * 0.0765).toFixed(2)}</li>
                    <li>{t.budgetTool.analysis.workersComp} ${((getNumericValue(wage) * getNumericValue(hours) * 52) * 0.02).toFixed(2)}</li>
                  </>
                )}
                <li><em>{t.budgetTool.analysis.additionalCostsNote}</em></li>
              </ul>
            </div>
          )}
          
          {enhancedEmployeeData.modelType === 'break-even' && (
            <div style={{ fontSize: '14px' }}>
              <p><strong>{t.budgetTool.analysis.breakEvenModel}</strong> {t.budgetTool.analysis.operationalEfficiencyCalc}</p>
              <ul style={{ marginLeft: '20px' }}>
                <li>{t.budgetTool.analysis.technicians} {enhancedEmployeeData.numTechnicians}</li>
                <li>{t.budgetTool.analysis.hoursPerDay} {enhancedEmployeeData.operationHours}</li>
                <li>{t.budgetTool.analysis.daysPerMonth} {enhancedEmployeeData.daysOpenPerMonth}</li>
                <li>{t.budgetTool.analysis.appointmentsPerTechPerDay} {enhancedEmployeeData.appointmentsPerTechPerDay}</li>
                <li>{t.budgetTool.analysis.wageModel} {enhancedEmployeeData.wageModel}</li>
                {enhancedEmployeeData.wageModel === 'Commission' && (
                  <li>{t.budgetTool.analysis.commissionRate} {enhancedEmployeeData.commissionPercent}%</li>
                )}
              </ul>
            </div>
          )}
          
          {enhancedEmployeeData.modelType === 'comprehensive' && (
            <div style={{ fontSize: '14px' }}>
              <p><strong>{t.budgetTool.analysis.comprehensiveModel}</strong> {t.budgetTool.analysis.comprehensiveModelDesc}</p>
              <ul style={{ marginLeft: '20px' }}>
                <li>{t.budgetTool.analysis.operationalParameters} {enhancedEmployeeData.numTechnicians} {t.budgetTool.analysis.techs} × {enhancedEmployeeData.operationHours} {t.budgetTool.analysis.hrs} × {enhancedEmployeeData.daysOpenPerMonth} {t.budgetTool.analysis.days}</li>
                <li>{t.budgetTool.analysis.wageStructure} {enhancedEmployeeData.wageModel} ({enhancedEmployeeData.wageModel === 'Commission' ? enhancedEmployeeData.commissionPercent + '%' : '$' + wage + '/hr'})</li>
                <li>{t.budgetTool.analysis.serviceParameters} {enhancedEmployeeData.avgServicesPerShift} {t.budgetTool.analysis.servicesShift} @ ${getNumericValue(enhancedEmployeeData.avgPricePerService).toFixed(2)}</li>
                <li><em>{t.budgetTool.analysis.additionalOverheadCosts}</em></li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Detailed Cost Breakdown Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '30px' }}>
        <h3 style={{ color: '#495057', marginTop: 0, marginBottom: '20px' }}>
          📋 Total Annual Costs Breakdown
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#007bff', fontSize: '14px' }}>💼 Employee Costs</h4>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
              {formatCurrency(employeeCosts)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {enhancedEmployeeData && enhancedEmployeeData.totalAnnualLaborCost ? 
                'From enhanced employee model' : 
                `$${wage || 0}/hr × ${hours || 0} hrs/wk × 52 wks${employeeType === 'W2' ? ' + 25% burden' : ''}`
              }
            </div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#6f42c1', fontSize: '14px' }}>📋 Supplemental Costs</h4>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f42c1' }}>
              {formatCurrency(supplementalCostsTotal)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {(supplementalCosts || []).length} items (insurance, marketing, etc.)
            </div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#fd7e14', fontSize: '14px' }}>🏢 Operating Costs</h4>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fd7e14' }}>
              {formatCurrency(operatingCostsTotal)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {(operatingCosts || []).length} categories (rent, utilities, etc.)
            </div>
          </div>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '6px', border: '2px solid #28a745' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
              📊 Total Annual Costs:
            </span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {formatCurrency(totalAnnualCosts)}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#495057', marginTop: '10px', textAlign: 'center' }}>
            {formatCurrency(employeeCosts)} + {formatCurrency(supplementalCostsTotal)} + {formatCurrency(operatingCostsTotal)} = {formatCurrency(totalAnnualCosts)}
          </div>
        </div>
      </div>



      {/* Results Section */}
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #007bff' }}>
        <h3 style={{ color: '#007bff', marginTop: 0, marginBottom: '20px' }}>
          📈 {t.budgetTool.analysis.resultsTitle}
        </h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <strong style={{ fontSize: '18px', color: '#28a745' }}>
              {t.budgetTool.analysis.breakEvenPricePerService} 
              <Tooltip text={breakEvenCalculationText}>
                {formatCurrency(breakEvenPerService)}
              </Tooltip>
            </strong>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              {t.budgetTool.analysis.currentAveragePrice} {formatCurrency(averageServicePrice)} 
              {averageServicePrice > breakEvenPerService ? 
                <span style={{ color: '#28a745', fontWeight: 'bold' }}> ✅ {t.budgetTool.analysis.aboveBreakEven}</span> : 
                <span style={{ color: '#dc3545', fontWeight: 'bold' }}> ⚠️ {t.budgetTool.analysis.belowBreakEven}</span>
              }
            </div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
            <strong style={{ fontSize: '18px', color: '#17a2b8' }}>
              {t.budgetTool.analysis.annualRevenueNeeded} 
              <Tooltip text={costBreakdownText}>
                {formatCurrency(breakEvenRevenue)}
              </Tooltip>
            </strong>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              {t.budgetTool.analysis.currentAnnualRevenue} {formatCurrency(currentAnnualRevenue)}
              {currentAnnualRevenue > breakEvenRevenue ? 
                <span style={{ color: '#28a745', fontWeight: 'bold' }}> ✅ {t.budgetTool.analysis.profitable}</span> : 
                <span style={{ color: '#dc3545', fontWeight: 'bold' }}> ⚠️ {t.budgetTool.analysis.operatingAtLoss}</span>
              }
            </div>
          </div>
          
          {servicesPerYear > 0 && (
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
              <strong style={{ fontSize: '16px', color: '#6f42c1' }}>
                {t.budgetTool.analysis.servicesPerYearLabel} {servicesPerYear.toLocaleString()}
              </strong>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                {t.budgetTool.analysis.basedOnServicesWeek} {customersPerWeek} {t.budgetTool.analysis.servicesPerWeek} × 52 {t.budgetTool.analysis.weeks}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginTop: '15px', textAlign: 'center' }}>
          💡 {t.budgetTool.analysis.adjustPricingAdvice}
        </div>
      </div>

      {/* Enhanced Break-Even Analysis - Similar to Break Even Model */}
      {enhancedEmployeeData && enhancedEmployeeData.numTechnicians && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff8e1', borderRadius: '8px', border: '2px solid #ff9800' }}>
          <h3 style={{ color: '#f57c00', marginTop: 0, marginBottom: '20px' }}>
            🎯 {t.budgetTool.analysis.operationalEfficiencyTitle}
          </h3>
          
          {(() => {
            // Enhanced calculations similar to Break Even Model
            const numTechs = getNumericValue(enhancedEmployeeData.numTechnicians);
            const opHours = getNumericValue(enhancedEmployeeData.operationHours);
            const daysOpen = getNumericValue(enhancedEmployeeData.daysOpenPerMonth);
            const apptPerTech = getNumericValue(enhancedEmployeeData.appointmentsPerTechPerDay);
            
            // Calculate for selected time frame
            const periodsPerYear = 12; // Monthly only
            const daysInPeriod = daysOpen;
            
            const totalAvailableHours = numTechs * opHours * daysInPeriod;
            const actualAppointments = apptPerTech * numTechs * daysInPeriod;
            const actualHoursBooked = actualAppointments * 1; // Assuming 1 hour per appointment
            const utilizationRate = totalAvailableHours > 0 ? (actualHoursBooked / totalAvailableHours) * 100 : 0;
            
            // Cost breakdown calculations
            const periodCosts = totalAnnualCosts / periodsPerYear;
            const avgPrice = getNumericValue(averageServicePrice) || 0;
            
            // Variable cost components (per appointment)
            const suppliesCostPerService = getNumericValue(enhancedEmployeeData?.avgSuppliesCostPerService) || 2.50;
            const laborCostPerAppointment = enhancedEmployeeData?.wageModel === 'Commission' 
              ? (avgPrice * (getNumericValue(enhancedEmployeeData?.technicianSharePercent) || 50) / 100) 
              : ((getNumericValue(enhancedEmployeeData?.wage) || 15) * 1); // Assume 1 hour per appointment
            const variableCostPerAppointment = (suppliesCostPerService || 0) + (laborCostPerAppointment || 0);
            
            // Fixed costs (estimated as portion of total costs minus variable costs)
            const totalVariableCosts = actualAppointments * variableCostPerAppointment;
            const fixedCosts = Math.max(0, periodCosts - totalVariableCosts);
            const fixedCostPerAppointment = actualAppointments > 0 ? fixedCosts / actualAppointments : 0;
            
            const costPerAppointment = (variableCostPerAppointment || 0) + (fixedCostPerAppointment || 0);
            
            // Revenue calculations
            const periodRevenue = (actualAppointments || 0) * (avgPrice || 0);
            const netProfit = (periodRevenue || 0) - (periodCosts || 0);
            const netMargin = periodRevenue > 0 ? ((netProfit || 0) / periodRevenue) * 100 : 0;
            
            // Break-even calculations  
            const contributionMargin = (avgPrice || 0) - (variableCostPerAppointment || 0);
            const breakEvenAppointments = contributionMargin > 0 ? Math.ceil((fixedCosts || 0) / contributionMargin) : 0;
            
            return (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  {/* Operational Metrics */}
                  <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ffcc02' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#f57c00' }}>📊 {t.budgetTool.analysis.operationalMetrics}</h4>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.totalAvailableHoursMonth}</span>
                        <strong>{Math.round(totalAvailableHours).toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.appointmentsMonth}</span>
                        <strong>{Math.round(actualAppointments).toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.hoursBookedMonth}</span>
                        <strong>{actualHoursBooked.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.utilizationRate}</span>
                        <strong style={{ color: utilizationRate >= 75 ? '#28a745' : utilizationRate >= 50 ? '#ffc107' : '#dc3545' }}>
                          {utilizationRate.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e74c3c' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#e74c3c' }}>📊 Cost Breakdown per Service</h4>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Variable Costs:</span>
                        <Tooltip text={`Supplies: ${formatCurrency(suppliesCostPerService)} + Labor: ${formatCurrency(laborCostPerAppointment)} = ${formatCurrency(variableCostPerAppointment)}`}>
                          <strong style={{ color: '#e74c3c' }}>{formatCurrency(variableCostPerAppointment)}</strong>
                        </Tooltip>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Fixed Costs:</span>
                        <Tooltip text={`Rent, utilities, insurance, and other fixed expenses allocated per service: ${formatCurrency(fixedCosts)} ÷ ${Math.round(actualAppointments)} services = ${formatCurrency(fixedCostPerAppointment)}`}>
                          <strong style={{ color: '#fd7e14' }}>{formatCurrency(fixedCostPerAppointment)}</strong>
                        </Tooltip>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderTop: '1px solid #dee2e6', paddingTop: '8px' }}>
                        <span><strong>Total Cost per Service:</strong></span>
                        <strong style={{ color: '#6c757d' }}>{formatCurrency(costPerAppointment)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Contribution Margin:</span>
                        <Tooltip text={`Average Service Price ${formatCurrency(avgPrice)} - Variable Cost ${formatCurrency(variableCostPerAppointment)} = ${formatCurrency(contributionMargin)} per service to cover fixed costs`}>
                          <strong style={{ color: contributionMargin > 0 ? '#28a745' : '#dc3545' }}>{formatCurrency(contributionMargin)}</strong>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Financial Performance */}
                  <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ffcc02' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#f57c00' }}>💰 {t.budgetTool.analysis.financialPerformance}</h4>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.monthlyRevenue}</span>
                        <strong>{formatCurrency(periodRevenue)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.monthlyCosts}</span>
                        <Tooltip text={`TOTAL MONTHLY EXPENSES BREAKDOWN:

VARIABLE COSTS (per service):
• Supplies: ${formatCurrency(suppliesCostPerService)} per service
• Labor: ${formatCurrency(laborCostPerAppointment)} per service (${enhancedEmployeeData?.wageModel === 'Commission' ? `${enhancedEmployeeData?.technicianSharePercent || 50}% commission on ${formatCurrency(avgPrice)}` : `${formatCurrency(enhancedEmployeeData?.wage || 15)}/hour × 1 hour`})
• Total Variable per Service: ${formatCurrency(variableCostPerAppointment)}
• Total Variable Costs: ${formatCurrency(variableCostPerAppointment)} × ${Math.round(actualAppointments)} services = ${formatCurrency(totalVariableCosts)}

FIXED COSTS (monthly):
• Employee Annual: ${formatCurrency(employeeCosts)} ÷ ${periodsPerYear} = ${formatCurrency(employeeCosts / periodsPerYear)}
• Operating Annual: ${formatCurrency(operatingCostsTotal)} ÷ ${periodsPerYear} = ${formatCurrency(operatingCostsTotal / periodsPerYear)}  
• Supplemental Annual: ${formatCurrency(supplementalCostsTotal)} ÷ ${periodsPerYear} = ${formatCurrency(supplementalCostsTotal / periodsPerYear)}
• Total Fixed Costs: ${formatCurrency(fixedCosts)}

TOTAL EXPENSES: ${formatCurrency(totalVariableCosts)} + ${formatCurrency(fixedCosts)} = ${formatCurrency(periodCosts)}`}>
                          <strong>{formatCurrency(periodCosts)}</strong>
                        </Tooltip>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.netProfit}</span>
                        <strong style={{ color: netProfit >= 0 ? '#28a745' : '#dc3545' }}>
                          ${netProfit.toFixed(2)}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.netMargin}</span>
                        <strong style={{ color: netMargin >= 10 ? '#28a745' : netMargin >= 0 ? '#ffc107' : '#dc3545' }}>
                          {netMargin.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Break-Even Analysis */}
                  <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ffcc02' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#f57c00' }}>⚖️ {t.budgetTool.analysis.breakEvenMetrics}</h4>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.costPerAppointment}</span>
                        <strong>${(costPerAppointment || 0).toFixed(2)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.avgServicePrice}</span>
                        <strong>${(avgPrice || 0).toFixed(2)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.contributionMargin}</span>
                        <strong style={{ color: contributionMargin > 0 ? '#28a745' : '#dc3545' }}>
                          ${(contributionMargin || 0).toFixed(2)}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{t.budgetTool.analysis.breakEvenAppointments}</span>
                        <strong>{(breakEvenAppointments || 0).toLocaleString()}/{t.budgetTool.analysis.month}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>💡 {t.budgetTool.analysis.performanceInsights}</h4>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {utilizationRate < 50 && (
                      <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.lowUtilizationAnalysis} ${utilizationRate.toFixed(1)}%, ${t.budgetTool.analysis.belowHealthyThreshold} ${actualHoursBooked} ÷ ${totalAvailableHours} × 100 = ${utilizationRate.toFixed(1)}%. ${t.budgetTool.analysis.tooManyTechnicians} (${enhancedEmployeeData.numTechnicians}) ${t.budgetTool.analysis.orInsufficientMarketing}`}>
                          ⚠️ <strong>{t.budgetTool.analysis.lowUtilization}</strong> {t.budgetTool.analysis.considerReducingTechnicians}
                        </Tooltip>
                      </div>
                    )}
                    {utilizationRate >= 50 && utilizationRate < 75 && (
                      <div style={{ color: '#ffc107', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.moderateUtilizationAnalysis} ${utilizationRate.toFixed(1)}%, ${t.budgetTool.analysis.acceptableRange} ${actualHoursBooked} ÷ ${totalAvailableHours} × 100 = ${utilizationRate.toFixed(1)}%. ${t.budgetTool.analysis.goodDemandBalance}`}>
                          ⚡ <strong>{t.budgetTool.analysis.moderateUtilization}</strong> {t.budgetTool.analysis.goodFoundation}
                        </Tooltip>
                      </div>
                    )}
                    {utilizationRate >= 75 && (
                      <div style={{ color: '#28a745', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.highUtilizationAnalysis} ${utilizationRate.toFixed(1)}%, ${t.budgetTool.analysis.excellentBenchmark} ${actualHoursBooked} ÷ ${totalAvailableHours} × 100 = ${utilizationRate.toFixed(1)}%. ${t.budgetTool.analysis.optimalStaffEfficiency} ${enhancedEmployeeData.numTechnicians} ${t.budgetTool.analysis.techniciansHandling} ${actualAppointments} ${t.budgetTool.analysis.appointmentsMonth}. ${t.budgetTool.analysis.considerExpansion}`}>
                          ✅ <strong>{t.budgetTool.analysis.highUtilization}</strong> {t.budgetTool.analysis.excellentEfficiency}
                        </Tooltip>
                      </div>
                    )}
                    {netMargin < 0 && (
                      <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.operatingLossAnalysis} ${netMargin.toFixed(1)}% ${t.budgetTool.analysis.negative}, ${t.budgetTool.analysis.costsExceedRevenue} (${formatCurrency(periodRevenue)} - ${formatCurrency(periodCosts)}) ÷ ${t.budgetTool.analysis.revenue} × 100 = ${netMargin.toFixed(1)}%. ${t.budgetTool.analysis.lossOf} ${formatCurrency(Math.abs(netProfit))}/${t.budgetTool.analysis.monthRequires} ${formatCurrency(Math.abs(netProfit) / actualAppointments)} ${t.budgetTool.analysis.priceIncreasePerService}`}>
                          📉 <strong>{t.budgetTool.analysis.operatingAtLoss}</strong> {t.budgetTool.analysis.increasePricesBy} ${(Math.abs(netProfit) / actualAppointments).toFixed(2)} {t.budgetTool.analysis.perServiceOrReduceCosts}
                        </Tooltip>
                      </div>
                    )}
                    {netMargin >= 0 && netMargin < 10 && (
                      <div style={{ color: '#ffc107', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.breakEvenAnalysisTooltip} ${netMargin.toFixed(1)}%, ${t.budgetTool.analysis.positiveBelowHealthy} (${formatCurrency(netProfit)} ÷ ${formatCurrency(periodRevenue)}) × 100 = ${netMargin.toFixed(1)}%. ${t.budgetTool.analysis.whileProfitable}`}>
                          📊 <strong>{t.budgetTool.analysis.breakEvenOperation}</strong> {t.budgetTool.analysis.focusOnCostOptimization}
                        </Tooltip>
                      </div>
                    )}
                    {netMargin >= 10 && (
                      <div style={{ color: '#28a745', marginBottom: '10px' }}>
                        <Tooltip text={`${t.budgetTool.analysis.profitableOperationAnalysis} ${netMargin.toFixed(1)}%, ${t.budgetTool.analysis.exceedsHealthyBenchmark} (${formatCurrency(netProfit)} ÷ ${formatCurrency(periodRevenue)}) × 100 = ${netMargin.toFixed(1)}%. ${t.budgetTool.analysis.strongProfitability} ${formatCurrency(netProfit)}/${t.budgetTool.analysis.monthProfit}`}>
                          💰 <strong>{t.budgetTool.analysis.profitableOperation}</strong> {t.budgetTool.analysis.strongPerformance}
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
