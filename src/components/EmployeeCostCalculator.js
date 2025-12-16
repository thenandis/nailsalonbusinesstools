import React, { useState, useEffect } from 'react';
import { FICA, WORKERS_COMP, employeeTypes } from '../data/EmployeeTypes.js';
import { getNumericValue, createNumericHandler, formatCurrency } from '../utils/numericInputUtils.js';
import Tooltip from './common/Tooltip';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function EmployeeCostCalculator({ 
  employeeType, 
  setEmployeeType, 
  wage, 
  setWage, 
  hours, 
  setHours,
  onDataChange 
}) {
  const { translations: t } = useTranslationContext();
  
  // Default to comprehensive model without user selection
  const modelType = 'comprehensive';
  
  // W2 vs 1099 Model Fields (from NailSalonW2vs1099Model.js) - keeping service-related fields only
  const [avgServicesPerShift, setAvgServicesPerShift] = useState(5);
  const [avgPricePerService, setAvgPricePerService] = useState(50);
  const [technicianSharePercent, setTechnicianSharePercent] = useState(50);
  const [avgSuppliesCostPerService, setAvgSuppliesCostPerService] = useState(2.50);
  const [avgServiceTipPercent, setAvgServiceTipPercent] = useState(30);
  // Removed: employeeInsurance, salonAmenities, suppliesCostAnnual, monthlyRentPerTech - these come from other tabs
  
  // Break Even Model Fields (from NailSalonBreakEvenModel.js)
  const [numTechnicians, setNumTechnicians] = useState(3);
  const [operationHours, setOperationHours] = useState(8);
  const [daysOpenPerMonth, setDaysOpenPerMonth] = useState(26);
  const [appointmentsPerTechPerDay, setAppointmentsPerTechPerDay] = useState(6);
  const [wageModel, setWageModel] = useState('Commission'); // 'Commission' or 'Hourly'
  const [targetUtilizationRate, setTargetUtilizationRate] = useState(75);
  // Load W2 vs 1099 data from localStorage if available
  useEffect(() => {
    const savedW2Data = localStorage.getItem('w2vs1099ModelData');
    if (savedW2Data) {
      try {
        const parsedData = JSON.parse(savedW2Data);
        setAvgServicesPerShift(parsedData.avgServicesPerShift || 5);
        setAvgPricePerService(parsedData.avgPricePerService || 50);
        setTechnicianSharePercent(parsedData.technicianSharePercent || 50);
        setAvgSuppliesCostPerService(parsedData.avgSuppliesCostPerService || 2.50);
        setAvgServiceTipPercent(parsedData.avgServiceTipPercent || 30);
        if (parsedData.w2HourlyWage) setWage(parsedData.w2HourlyWage);
        if (parsedData.hoursPerWeek) setHours(parsedData.hoursPerWeek);
      } catch (e) {
        console.log('Could not parse W2 vs 1099 data');
      }
    }
  }, [setWage, setHours]);

  // Notify parent when data changes - now includes all model data
  useEffect(() => {
    if (onDataChange) {
      const employeeData = {
        // Basic fields
        employeeType, wage, hours, modelType,
        // W2 vs 1099 fields (service-related only)
        avgServicesPerShift, avgPricePerService, technicianSharePercent,
        avgSuppliesCostPerService, avgServiceTipPercent,
        // Break Even fields
        numTechnicians, operationHours, daysOpenPerMonth, appointmentsPerTechPerDay,
        wageModel, targetUtilizationRate
      };
      onDataChange('employee', employeeData);
    }
  }, [employeeType, wage, hours, avgServicesPerShift, avgPricePerService, 
      technicianSharePercent, avgSuppliesCostPerService, avgServiceTipPercent,
      numTechnicians, operationHours, daysOpenPerMonth, appointmentsPerTechPerDay,
      wageModel, targetUtilizationRate, onDataChange]);

  // Enhanced calculation methods based on selected model
  const calculateBasicCost = () => {
    const base = getNumericValue(wage) * getNumericValue(hours) * 52;
    if (employeeType === 'W2') {
      return base + base * FICA + base * WORKERS_COMP;
    }
    return base;
  };

  const calculateW2vs1099Cost = () => {
    const baseWage = getNumericValue(wage) * getNumericValue(hours) * 52;
    
    if (employeeType === 'W2') {
      return baseWage + baseWage * FICA + baseWage * WORKERS_COMP;
    }
    return baseWage;
  };

  const calculateBreakEvenCost = () => {
    const totalHours = getNumericValue(numTechnicians) * getNumericValue(operationHours) * getNumericValue(daysOpenPerMonth) * 12;
    const totalAppointments = getNumericValue(appointmentsPerTechPerDay) * getNumericValue(numTechnicians) * getNumericValue(daysOpenPerMonth) * 12;
    
    let laborCost = 0;
    if (wageModel === 'Commission') {
      // Use technicianSharePercent instead of commissionPercent for consistency
      laborCost = totalAppointments * getNumericValue(avgPricePerService) * (getNumericValue(technicianSharePercent) / 100);
    } else {
      laborCost = totalHours * getNumericValue(wage);
      if (employeeType === 'W2') {
        laborCost += laborCost * FICA + laborCost * WORKERS_COMP;
      }
    }
    
    return laborCost;
  };

  const calculateComprehensiveCost = () => {
    // Use break-even operational calculation with proper tax burden
    return calculateBreakEvenCost();
  };

  const getCurrentCost = () => {
    switch (modelType) {
      case 'w2-vs-1099': return calculateW2vs1099Cost();
      case 'break-even': return calculateBreakEvenCost();
      case 'comprehensive': return calculateComprehensiveCost();
      default: return calculateBasicCost();
    }
  };

  return (
    <div>
      <h2>Employee Cost Calculator</h2>
      
      {/* Information Note */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#2e7d32' }}>
          <strong>💡 Note:</strong> All input fields below represent <strong>averages</strong> across all employees, services, appointments, and operational parameters. 
          Employee costs are calculated using these operational averages. Additional costs like insurance, amenities, and supplies are automatically included from the Supplemental and Operating Cost tabs.
        </p>
      </div>

      {/* Basic Fields - Always Shown */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>{t.budgetTool.employee.basicEmployeeInformation}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '15px', alignItems: 'center', maxWidth: '500px' }}>
          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.employee.employeeType}
          </label>
          <select 
            value={employeeType} 
            onChange={e => setEmployeeType(e.target.value)}
            style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {employeeTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.employee.hourlyWageField}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>$</span>
            <input 
              type="number" 
              value={wage} 
              onChange={createNumericHandler(setWage, true)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.budgetTool.employee.hoursPerWeekField}
          </label>
          <input 
            type="number" 
            value={hours} 
            onChange={createNumericHandler(setHours)}
            style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
          />
        </div>
      </div>

      {/* Service & Pricing Parameters */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ffcc02' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>{t.budgetTool.employee.servicePricingParameters}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '15px', alignItems: 'center', maxWidth: '500px' }}>
          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.w2vs1099.avgServicesPerShift}
          </label>
          <input 
            type="number" 
            value={avgServicesPerShift} 
            onChange={createNumericHandler(setAvgServicesPerShift)}
            style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
          />

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.w2vs1099.avgPricePerService}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>$</span>
            <input 
              type="number" 
              value={avgPricePerService} 
              onChange={createNumericHandler(setAvgPricePerService, true)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.w2vs1099.technicianShare}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
              type="number" 
              value={technicianSharePercent} 
              onChange={createNumericHandler(setTechnicianSharePercent)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />
            <span>%</span>
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.w2vs1099.avgSuppliesCostPerService}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>$</span>
            <input 
              type="number" 
              value={avgSuppliesCostPerService} 
              onChange={createNumericHandler(setAvgSuppliesCostPerService, true)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />
          </div>

          <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
            {t.w2vs1099.avgServiceTipPercent}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
              type="number" 
              value={avgServiceTipPercent} 
              onChange={createNumericHandler(setAvgServiceTipPercent)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />
            <span>%</span>
          </div>
        </div>
      </div>

      {/* Operational Parameters */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>{t.budgetTool.employee.operationalParameters}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '15px', alignItems: 'center', maxWidth: '500px' }}>
            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.budgetTool.employee.numberOfTechnicians}
            </label>
            <input 
              type="number" 
              value={numTechnicians} 
              onChange={createNumericHandler(setNumTechnicians)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />

            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.budgetTool.employee.operationHoursPerDay}
            </label>
            <input 
              type="number" 
              value={operationHours} 
              onChange={createNumericHandler(setOperationHours)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />

            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.budgetTool.employee.daysOpenPerMonth}
            </label>
            <input 
              type="number" 
              value={daysOpenPerMonth} 
              onChange={createNumericHandler(setDaysOpenPerMonth)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />

            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.budgetTool.employee.appointmentsPerTechPerDay}
            </label>
            <input 
              type="number" 
              value={appointmentsPerTechPerDay} 
              onChange={createNumericHandler(setAppointmentsPerTechPerDay)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
            />

            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.breakEven.wageModel}
            </label>
            <select 
              value={wageModel} 
              onChange={e => setWageModel(e.target.value)}
              style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="Hourly">{t.common.hourly}</option>
              <option value="Commission">{t.common.commission}</option>
            </select>



            <label style={{ textAlign: 'right', fontWeight: 'bold', margin: 0 }}>
              {t.budgetTool.employee.targetUtilizationRate}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                type="number" 
                value={targetUtilizationRate} 
                onChange={createNumericHandler(setTargetUtilizationRate)}
                style={{ padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
              />
              <span>%</span>
            </div>
          </div>
        </div>
        
      {/* Cost Summary */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #28a745' }}>
        <strong style={{ fontSize: '18px', color: '#28a745' }}>
          Total Annual Employee Cost: 
          <Tooltip text={`Calculated using operational parameters: ${wageModel === 'Commission' ? 
            `${technicianSharePercent}% commission on services` : 
            `$${wage}/hr wage`} for ${numTechnicians} technicians × ${operationHours} hrs/day × ${daysOpenPerMonth} days/month × 12 months. ${employeeType === 'W2' ? 'Includes FICA (7.65%) and Workers Comp (2%)' : ''}`}>
            {formatCurrency(getCurrentCost())}
          </Tooltip>
        </strong>
      </div>
    </div>
  );
}
