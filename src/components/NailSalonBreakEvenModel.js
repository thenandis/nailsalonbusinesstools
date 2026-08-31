import React, { useState, useEffect } from 'react';
import { getNumericValue, formatCurrency } from '../utils/numericInputUtils';
import { downloadCSV } from '../utils/exportUtils.js';
import Tooltip from './common/Tooltip';
import { useTranslationContext } from '../contexts/TranslationContext';
import minWageData from '../data/minwage.json';

export default function NailSalonBreakEvenModel() {
  const { translations: t } = useTranslationContext();

  // All parameters are now read from Tab 1 (W2 vs 1099 Model) - Tab 2 is analysis-only
  const [w2vs1099Data, setW2vs1099Data] = useState({
    // Business parameters
    avgServicesPerShift: 5,
    avgPricePerService: 50,
    technicianSharePercent: 50,
    avgSuppliesCostPerService: 0, // Updated to 0 by default, will be 2.5 only when hourly + 1099
    avgServiceTipPercent: 30,
    w2HourlyWage: 20,
    hoursPerWeek: 40,
    selectedYear: '2026',
    selectedLocality: '',
    employeeInsurance: 200,
    monthlyRentPerTech: 0,
    // Budget Tool costs from Tab 1
    budgetSupplementalCosts: 0,
    budgetOperatingCosts: 0,
    // Operational parameters (from Tab 1)
    //timeFrame: 'monthly',
    wageModel: 'Commission',
    employmentType: 'W2',
    targetUtilizationRate: 75,
    numTechnicians: 3,
    operationHours: 8,
    daysOpenPerMonth: 26,
    appointmentsPerTechPerDay: 6,
    avgAppointmentDuration: 0.5
  });
  
  // Extract read-only parameters from Tab 1 data
    //const timeFrame = w2vs1099Data.timeFrame;
    const wageModel = w2vs1099Data.wageModel;
    const employmentType = w2vs1099Data.employmentType;
    const targetUtilizationRate = w2vs1099Data.targetUtilizationRate;
  const numTechnicians = w2vs1099Data.numTechnicians || 3;
  const operationHours = w2vs1099Data.operationHours || 8;
  const daysOpenPerMonth = w2vs1099Data.daysOpenPerMonth || 31;
  const appointmentsPerTechPerDay = w2vs1099Data.appointmentsPerTechPerDay;
  const avgAppointmentDuration = w2vs1099Data.avgAppointmentDuration || 0.5;
  
  // Pricing and Costs State (derived from W2 vs 1099 data)
  const pricePerAppointment = getNumericValue(w2vs1099Data.avgPricePerService) || 0;
  const variableHourlyWage = getNumericValue(w2vs1099Data.w2HourlyWage) || 0;
  const commissionPercent = getNumericValue(w2vs1099Data.technicianSharePercent) || 0;
  const variableCostPerAppointment = getNumericValue(w2vs1099Data.avgSuppliesCostPerService) || 0;

  // Load W2 vs 1099 data from localStorage or saved data
  useEffect(() => {
    // Try to load from W2 vs 1099 saved data
    const loadW2vs1099Data = () => {
      const savedW2Data = localStorage.getItem('w2vs1099ModelData');
      if (savedW2Data) {
        try {
          const parsedData = JSON.parse(savedW2Data);
          setW2vs1099Data(parsedData);
        } catch (e) {
          console.log('Could not parse W2 vs 1099 data');
        }
      }
    };
    loadW2vs1099Data();
    // Listen for localStorage changes (real-time sync from Tab 1)
    const handleStorage = (event) => {
      if (event.key === 'w2vs1099ModelData') {
        loadW2vs1099Data();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Calculate employer burden (payroll taxes) for W2 employees - matches Tab 1 calculation
  const calculateEmployerBurden = (wages) => {
    try {
      const numericWages = getNumericValue(wages, 0);
      if (numericWages < 0) return { socialSecurityEmployer: 0, medicareEmployer: 0, futa: 0, suta: 0, ett: 0, workersComp: 0, paidSickLeave: 0, total: 0 };
      
      const socialSecurityEmployer = Math.min(numericWages, 176100) * 0.062;
      const medicareEmployer = numericWages * 0.0145;
      const futa = Math.min(numericWages, 7000) * 0.015; // Federal unemployment
      const suta = Math.min(numericWages, 7000) * 0.034; // State unemployment
      const ett = Math.min(numericWages, 7000) * 0.001; // Employment training tax
      const workersComp = numericWages * 0.03; // 3% workers compensation
      const paidSickLeave = numericWages * 0.0215; // 2.15% for paid sick leave
      
      return {
        socialSecurityEmployer: socialSecurityEmployer || 0,
        medicareEmployer: medicareEmployer || 0,
        futa: futa || 0,
        suta: suta || 0,
        ett: ett || 0,
        workersComp: workersComp || 0,
        paidSickLeave: paidSickLeave || 0,
        total: (socialSecurityEmployer + medicareEmployer + futa + suta + ett + workersComp + paidSickLeave) || 0
      };
    } catch (error) {
      console.error('Error calculating employer burden:', error);
      return { socialSecurityEmployer: 0, medicareEmployer: 0, futa: 0, suta: 0, ett: 0, workersComp: 0, paidSickLeave: 0, total: 0 };
    }
  };

  // Calculate employer costs monthly based on Budget Tool data from Tab 1 + payroll taxes
  const calculateEmployerCostsMonthly = () => {
    // Use Budget Tool costs from Tab 1 (W2 vs 1099 Model)
    const supplementalCosts = getNumericValue(w2vs1099Data.budgetSupplementalCosts); // Monthly supplemental costs from Budget Tool
    const operatingCosts = getNumericValue(w2vs1099Data.budgetOperatingCosts); // Monthly operating costs from Budget Tool
    
    // Calculate payroll taxes based on business model selection (matches Tab 1)
    let monthlyPayrollTaxes = 0;
    if (employmentType === 'W2') {
      // For W2 employees, calculate employer burden on annual wages
      let annualWages = 0;
      if (wageModel === 'Commission') {
        // Commission model: calculate based on commission income
        const dailyCommission = getNumericValue(pricePerAppointment) * (getNumericValue(commissionPercent) / 100);
        const annualCommission = dailyCommission * actualAppointmentsPerMonth * 12;
        annualWages = annualCommission;
      } else {
        // Hourly model: calculate based on hourly wage
        const annualHourlyWage = getNumericValue(variableHourlyWage) * getNumericValue(w2vs1099Data.hoursPerWeek) * 52;
        // Get minimum wage from saved locality data
        const getMinWage = () => {
          const yearData = minWageData.data[w2vs1099Data.selectedYear || '2026'];
          if (!yearData) return 16.90;
          const locality = yearData.find(loc => loc.city === w2vs1099Data.selectedLocality);
          return locality?.minimumWage || 16.90;
        };
        const caMinWage = getMinWage();
        const minWageAnnual = caMinWage * getNumericValue(w2vs1099Data.hoursPerWeek) * 52;
        annualWages = Math.max(annualHourlyWage, minWageAnnual);
      }
      
      const employerBurden = calculateEmployerBurden(annualWages);
      monthlyPayrollTaxes = employerBurden.total / 12; // Convert to monthly
    }
    // For 1099 contractors, no payroll taxes (they handle their own self-employment taxes)
    
    // Total monthly employer costs = Budget Tool costs + payroll taxes
    return (supplementalCosts || 0) + (operatingCosts || 0) + monthlyPayrollTaxes;
  };

  // Calculate appointment values needed for employer cost calculations
  const daysInPeriod = getNumericValue(daysOpenPerMonth);
  const periodsPerMonth = 1; // Removed weekly logic. This is kept to keep calcs from breaking
  const actualAppointmentsPerPeriod = getNumericValue(appointmentsPerTechPerDay) * getNumericValue(numTechnicians) * daysInPeriod;
  const actualAppointmentsPerMonth = actualAppointmentsPerPeriod * periodsPerMonth;

  // Use saved annual employer cost from Tab 1, divided by 12, based on model
  let employerCostsMonthly = 0;
  if (employmentType === 'W2' && wageModel === 'Commission') {
    employerCostsMonthly = parseFloat(localStorage.getItem('model1A_totalEmployerCost')) / 12 || 0;
  } else if (employmentType === '1099' && wageModel === 'Commission') {
    employerCostsMonthly = parseFloat(localStorage.getItem('model1B_totalEmployerCost')) / 12 || 0;
  } else if (employmentType === '1099' && wageModel === 'Hourly') {
    employerCostsMonthly = parseFloat(localStorage.getItem('model2_totalEmployerCost')) / 12 || 0;
  } else if (employmentType === 'W2' && wageModel === 'Hourly') {
    employerCostsMonthly = parseFloat(localStorage.getItem('model3_totalEmployerCost')) / 12 || 0;
  } else {
    employerCostsMonthly = calculateEmployerCostsMonthly();
  }

  // Export function for saving to CSV/Excel
  const exportBreakEvenData = () => {
    const data = [
      ['Nail Salon Break Even Analysis Report', ''],
      ['Generated on:', new Date().toLocaleString()],
      ['', ''],
      ['Operational Parameters', ''],
      ['Number of Technicians', numTechnicians],
      ['Operation Hours per Day', operationHours],
      ['Days Open per Month', daysOpenPerMonth],
      ['Appointments per Tech per Day', appointmentsPerTechPerDay],
      ['', ''],
      ['Pricing & Costs', ''],
      ['Price per Appointment', `$${pricePerAppointment}`],
      ['Variable Hourly Wage', `$${variableHourlyWage}`],
      ['Commission Percent', `${commissionPercent}%`],
      ['Variable Cost per Appointment', `$${variableCostPerAppointment}`],
      ['Budget Tool Supplemental Costs (Monthly)', `$${getNumericValue(w2vs1099Data.budgetSupplementalCosts).toFixed(2)}`],
      ['Budget Tool Operating Costs (Monthly)', `$${getNumericValue(w2vs1099Data.budgetOperatingCosts).toFixed(2)}`],
      ['Payroll Taxes (Monthly)', `$${employmentType === 'W2' ? (employerCostsMonthly - getNumericValue(w2vs1099Data.budgetSupplementalCosts) - getNumericValue(w2vs1099Data.budgetOperatingCosts)).toFixed(2) : '0.00'}`],
      ['Total Employer Costs Monthly', `$${employerCostsMonthly.toFixed(2)}`],
      ['', ''],
      ['Model Configuration', ''],
      ['Wage Model', wageModel === 'Commission' ? 'Commission Based' : 'No Commission / Hourly Wage / Booth Rental'],
      ['Employment Type', employmentType],
      ['Target Utilization Rate', `${targetUtilizationRate}%`],
      ['', ''],
      ['Calculated Results', ''],
      ['Total Available Hours', totalAvailableHours.toLocaleString()],
      ['Actual Appointments per Month', actualAppointmentsPerMonth.toLocaleString()],
      ['Actual Hours Booked', actualHoursBooked.toLocaleString()],
      ['Current Utilization Rate', `${utilizationRate.toFixed(1)}%`],
      ['Labor Cost per Appointment', `$${laborCostPerAppointment.toFixed(2)}`],      
      ['Total Revenue', `$${totalRevenue.toFixed(2)}`],
      ['Total Expenses', `$${totalExpenses.toFixed(2)}`],
      ['Net Profit', `$${netProfit.toFixed(2)}`],
      ['Net Margin', `${netMargin.toFixed(1)}%`]
    ];
    
    const csvContent = data.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(',')
    ).join('\n');
    
    downloadCSV(csvContent, 'break_even_analysis');
  };

  // Calculated Values (supporting monthly time frames)
  const totalAvailableHours = getNumericValue(numTechnicians) * getNumericValue(operationHours) * daysInPeriod;
  const actualHoursBooked = actualAppointmentsPerPeriod * getNumericValue(avgAppointmentDuration);
  //const actualHoursBooked = actualAppointmentsPerPeriod;
  const utilizationRate = totalAvailableHours > 0 ? (actualHoursBooked / totalAvailableHours) * 100 : 0;
  
  // Convert to monthly values for consistent reporting
  const totalAvailableHoursMonthly = totalAvailableHours * periodsPerMonth;
  const actualHoursBookedMonthly = actualHoursBooked * periodsPerMonth;
  
  // Cost Calculations - Remove old FICA estimates since we now use exact payroll tax calculations
  const laborCostPerAppointment = wageModel === 'Commission' 
    ? (getNumericValue(pricePerAppointment) * getNumericValue(commissionPercent) / 100)
    : getNumericValue(variableHourlyWage) * getNumericValue(avgAppointmentDuration); // Use exact wage without estimates
     
  // Revenue and Profit Calculations
  // Use totalRevenue from Tab 1 (employerRevenue in localStorage)
  const totalRevenue = parseFloat(localStorage.getItem('employerRevenue')) / 12 || 0;
  const totalExpenses = getNumericValue(employerCostsMonthly);
  const netProfit = totalRevenue - totalExpenses;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  // 📊 Break-Even Appointments Analysis  
  const breakEvenAppointments = (wageModel === 'Hourly' && employmentType === '1099')
    ? 0  // Not applicable - break-even is immediate with rent payments
    : Math.ceil(getNumericValue(employerCostsMonthly) / getNumericValue(pricePerAppointment));
  
  // Pricing Strategy Analysis
  const desiredAppointmentsMonthly = (getNumericValue(targetUtilizationRate) / 100) * totalAvailableHoursMonthly / getNumericValue(avgAppointmentDuration);
  const requiredPriceForTarget = desiredAppointmentsMonthly > 0 
    ? (getNumericValue(employerCostsMonthly)) / desiredAppointmentsMonthly
    : getNumericValue(pricePerAppointment);

  // Tab 2 is now analysis-only - no save/load needed as all parameters come from Tab 1
  // Export functionality is still available for analysis results

  // Rent Revenue (for reference in tooltips and analysis)
  const rentRevenue = (wageModel === 'Hourly' && employmentType === '1099') 
    ? (w2vs1099Data.monthlyRentPerTech * numTechnicians) 
    : 0;

  return (
    <div>
      <h2>{t.breakEven.title}</h2>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '30px' }}>
        {t.breakEven.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Left Column - Input Parameters */}
        <div>
          {/* Configuration Status - Read-only display from Tab 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '15px', marginBottom: '20px' }}>
            {/* Current Business Model */}
            <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '2px solid #dc3545' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#721c24' }}>💼 {t.w2vs1099?.businessModelConfiguration || 'Business Model Configuration'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ minWidth: '100px', fontWeight: 'bold' }}>{t.w2vs1099?.employment || 'Employment'}:</label>
                  <span style={{ fontWeight: 'bold', color: '#721c24' }}>
                    {employmentType === 'W2' ? 'W2 Employee' : '1099 Contractor'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ minWidth: '100px', fontWeight: 'bold' }}>{t.w2vs1099?.paymentModel || 'Payment Model'}:</label>
                  <span style={{ fontWeight: 'bold', color: '#721c24' }}>
                    {wageModel === 'Commission' ? 'Commission' : 
                     (employmentType === 'W2' ? 'No Commission' : 'Booth Rental')}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ minWidth: '100px', fontWeight: 'bold' }}>{t.w2vs1099?.targetUtilization || 'Target Utilization'}:</label>
                  <span style={{ fontWeight: 'bold', color: '#721c24' }}>{targetUtilizationRate}%</span>
                </div>
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#721c24', fontStyle: 'italic' }}>
                ⚙️ Configured in Tab 1 - W2 vs 1099 Model
              </p>
            </div>
          </div>

          <h3 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
            � Operational Parameters (from Tab 1)
          </h3>
          
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>{t.breakEven.numberOfTechnicians}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{numTechnicians}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>technicians</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>{t.breakEven.operationHoursPerDay}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{operationHours}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>hours/day</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                {t.breakEven.daysOpenPerMonth}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                  {daysOpenPerMonth.toFixed(2)}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  days/{'month'}
                </span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>{t.breakEven.avgAppointmentDuration}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{avgAppointmentDuration}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>hours</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>{t.breakEven.appointmentsPerTechPerDay}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{appointmentsPerTechPerDay}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>appointments/tech/day</span>
              </div>
            </div>
            
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #b8daff' }}>
              <h5 style={{ margin: '0 0 5px 0', color: '#004085', fontSize: '14px' }}>
                ⚙️ Configuration Source: Tab 1 - W2 vs 1099 Model
              </h5>
              <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
                To modify these parameters, please go to Tab 1. Changes will automatically update this analysis.
              </p>
            </div>
          </div>

          <h3 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
            💰 Pricing & Cost Parameters (from W2 vs 1099 Model)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
            <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Price/Appointment:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <span>$</span>
              <span style={{ fontWeight: 'bold' }}>{pricePerAppointment}</span>
            </div>
            
            <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
              {wageModel === 'Hourly' ? 'Hourly Wage:' : 'Variable Hourly Wage:'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: wageModel === 'Hourly' ? '#fff3cd' : '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <span>$</span>
              <span style={{ fontWeight: 'bold' }}>{variableHourlyWage}</span>
              {wageModel === 'Hourly' && <span style={{ fontSize: '12px', color: '#856404', marginLeft: '5px' }}>per hour</span>}
            </div>
            
            <label style={{ textAlign: 'right', fontWeight: 'bold', color: wageModel === 'Commission' ? 'inherit' : '#999' }}>
              Commission:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: wageModel === 'Commission' ? '#d4edda' : '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6', opacity: wageModel === 'Commission' ? 1 : 0.6 }}>
              <span style={{ fontWeight: 'bold' }}>{commissionPercent}</span>
              <span>%</span>
              {wageModel === 'Hourly' && <span style={{ fontSize: '12px', color: '#999', marginLeft: '5px' }}>(not used)</span>}
            </div>
            
            <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Avg Supplies Cost/Service:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <span>$</span>
              <span style={{ fontWeight: 'bold' }}>{variableCostPerAppointment}</span>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #b8daff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#004085', fontSize: '14px' }}>
              🔗 Data Source: W2 vs 1099 Model
            </h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
              Pricing and cost parameters are automatically imported from the W2 vs 1099 Model page. 
              To modify these values, please update them in the W2 vs 1099 Model tab.
            </p>
          </div>



        </div>

        {/* Right Column - Results and Analysis */}
        <div>
          <h3 style={{ color: '#6f42c1', borderBottom: '2px solid #6f42c1', paddingBottom: '10px' }}>
            📈 {t.breakEven.operationalEfficiencyAnalysis}
          </h3>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div><strong>{t.breakEven.calculationPeriod}</strong></div>
              <div style={{ fontWeight: 'bold', color: '#6f42c1' }}>
                {t.breakEven.monthly}
              </div>
              
              <div><strong>{t.breakEven.totalAvailableHours}/{t.breakEven.monthly}:</strong></div>
              <div>
                <Tooltip text={`Total Available Hours = Number of Technicians × Operation Hours per Day × Days Open per Month\n= ${numTechnicians} × ${operationHours} × ${daysOpenPerMonth} = ${totalAvailableHours.toLocaleString()} hours (per month)`}>
                  {totalAvailableHours.toLocaleString()}
                </Tooltip>
              </div>
              
              <div>
                  <strong>{t.breakEven.actualHoursBooked}/{t.breakEven.monthly}:</strong>
              </div>
              <div>
                <Tooltip text={`Actual Hours Booked = Appointments × Appointment Duration\n= ${actualAppointmentsPerPeriod.toLocaleString()} × ${avgAppointmentDuration} hours = ${actualHoursBooked.toLocaleString()} hours (per month)`}>
                  {actualHoursBooked.toLocaleString()}
                </Tooltip>
              </div>
              
              <div><strong>{t.breakEven.currentUtilizationRate}</strong></div>
              <div style={{ color: utilizationRate >= 75 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                <Tooltip text={`Calculated as: (Actual Hours Booked ÷ Total Available Hours) × 100 = (${actualHoursBooked.toFixed(1)} ÷ ${totalAvailableHours.toFixed(1)}) × 100 = ${utilizationRate.toFixed(1)}%`}>
                  {utilizationRate.toFixed(1)}%
                </Tooltip>
              </div>

              <div><strong>Desired { t.breakEven.appointments}/{t.breakEven.monthly}:</strong></div>
              <div>
                <Tooltip text={`Desired Appointments per Month = (Target Utilization Rate × Total Available Hours) ÷ Appointment Duration\n= (${targetUtilizationRate}% × ${totalAvailableHoursMonthly.toLocaleString()} hours) ÷ ${avgAppointmentDuration} hours = ${desiredAppointmentsMonthly.toLocaleString()} appointments (per month)`}>
                  {desiredAppointmentsMonthly.toLocaleString()}
                </Tooltip>
              </div>
              <div>
                  <strong>{t.breakEven.monthlyAppointmentsForAnalysis}</strong>
              </div>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                <Tooltip text={`Current Monthly Appointments = Appointments per Tech per Day × Number of Technicians × Days Open per Month\n= ${appointmentsPerTechPerDay} × ${numTechnicians} × ${daysOpenPerMonth} = ${actualAppointmentsPerMonth.toLocaleString()} appointments (per month)`}>
                  {actualAppointmentsPerMonth.toLocaleString()}
                </Tooltip>
              </div>
            </div>
          </div>

          <h3 style={{ color: '#6f42c1', borderBottom: '2px solid #6f42c1', paddingBottom: '10px' }}>
            📊 {wageModel === 'Hourly' && employmentType === '1099' ? 'Break-Even Analysis (Booth Rental Model)' : 'Break-Even Appointments Analysis'}
          </h3>
          
          {wageModel === 'Hourly' && employmentType === '1099' ? (
            // Booth Rental Model - Different analysis
            <div style={{ marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#d1ecf1', padding: '20px', borderRadius: '8px', border: '2px solid #17a2b8' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0c5460', textAlign: 'center' }}>
                  💰 Booth Rental Break-Even Analysis
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
                  <div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Monthly Rent Revenue:</strong>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c5460' }}>
                        ${rentRevenue.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ${w2vs1099Data.monthlyRentPerTech} × {numTechnicians} technicians
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Monthly Employer Costs:</strong>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c5460' }}>
                        <Tooltip text={`Total Employer Costs (matches Tab 1): $${employerCostsMonthly.toFixed(2)} per month

Breakdown:
• Supplemental Costs: $${getNumericValue(w2vs1099Data.budgetSupplementalCosts).toFixed(2)} (marketing, training, insurance)
• Operating Costs: $${getNumericValue(w2vs1099Data.budgetOperatingCosts).toFixed(2)} (rent, utilities, equipment)
• Payroll Taxes: $0 (1099 contractors - no payroll taxes)

Data Source: Budget Tool (Tab 1) → W2 vs 1099 Model`}>
                          ${employerCostsMonthly.toLocaleString()}
                        </Tooltip>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Total employer expenses (matches Tab 1)
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Monthly Profit:</strong>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: netProfit >= 0 ? '#28a745' : '#dc3545' }}>
                        ${netProfit.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Rent Revenue - Fixed Costs
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Break-Even Status:</strong>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: rentRevenue >= employerCostsMonthly ? '#28a745' : '#dc3545' }}>
                        {rentRevenue >= employerCostsMonthly ? '✅ PROFITABLE' : '❌ OPERATING AT LOSS'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {rentRevenue >= employerCostsMonthly 
                          ? 'Rent covers all employer costs with profit'
                          : `Need $${(employerCostsMonthly - rentRevenue).toFixed(0)} more monthly revenue`
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '6px', border: '1px solid #bee5eb' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0c5460' }}>💡 Booth Rental Model Insights:</h5>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#0c5460' }}>
                    <li>Technicians are independent contractors who pay monthly booth rent</li>
                    <li>Employer has no appointment volume risk - revenue is guaranteed monthly rent</li>
                    <li>Break-even is immediate once technicians pay their monthly rent</li>
                    <li>Profit margin: {netMargin.toFixed(1)}% on rent revenue</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Standard Service-Based Model
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Monthly Break-Even */}
              <div style={{ backgroundColor: '#f8f5ff', padding: '15px', borderRadius: '8px', border: '2px solid #6f42c1' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#6f42c1', textAlign: 'center' }}>
                  📅 Monthly Break-Even
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Break-Even Appointments:</strong></span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6f42c1' }}>
                      <Tooltip text={`Monthly break-even calculation (updated):\n\nTotal Monthly Expenses: $${totalExpenses.toFixed(2)}\nPrice Per Appointment: $${pricePerAppointment.toFixed(2)}\n\nBreak-Even: $${totalExpenses.toFixed(2)} ÷ $${pricePerAppointment.toFixed(2)} = ${(totalExpenses / pricePerAppointment).toFixed(0)} appointments needed monthly`}>
                        {Math.ceil(totalExpenses / pricePerAppointment).toLocaleString()}
                      </Tooltip>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Current Monthly:</strong></span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: actualAppointmentsPerMonth >= breakEvenAppointments ? '#28a745' : '#dc3545' }}>
                      {actualAppointmentsPerMonth.toFixed(0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Gap to Break-Even:</strong></span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: actualAppointmentsPerMonth >= breakEvenAppointments ? '#28a745' : '#dc3545' }}>
                      <Tooltip text={`Current appointments (${actualAppointmentsPerMonth.toFixed(0)}) - Break-even appointments (${breakEvenAppointments}) = ${actualAppointmentsPerMonth >= breakEvenAppointments ? 'surplus of' : 'deficit of'} ${Math.abs(actualAppointmentsPerMonth - breakEvenAppointments).toFixed(0)} appointments`}>
                        {actualAppointmentsPerMonth >= breakEvenAppointments ? '+' : ''}{(actualAppointmentsPerMonth - breakEvenAppointments).toFixed(0)}
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}


          <h3 style={{ color: '#20c997', borderBottom: '2px solid #20c997', paddingBottom: '10px' }}>
            💼 {t.breakEven.profitMarginAnalysis}
          </h3>
          
          {wageModel === 'Hourly' && employmentType === '1099' && rentRevenue > 0 && (
            <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#d1ecf1', borderRadius: '6px', border: '2px solid #20c997' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0c5460', fontSize: '14px' }}>
                💰 Booth Rental Revenue Model
              </h4>
              <p style={{ margin: '0', fontSize: '13px', color: '#0c5460' }}>
                Total revenue includes <strong>booth rental fees</strong> (${formatCurrency(w2vs1099Data.monthlyRentPerTech)} × {numTechnicians} = {formatCurrency(rentRevenue)}/month) 
                plus service revenue. Technicians work as independent contractors paying for booth space.
              </p>
            </div>
          )}
          
          <div style={{ backgroundColor: netProfit >= 0 ? '#d4edda' : '#f8d7da', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div><strong>{t.breakEven.totalMonthlyRevenue}</strong></div>
              <div>
                <Tooltip text={`Total Monthly Revenue is calculated as: (Total Employer Revenue from Tab 1) ÷ 12.\n\nThis ensures the monthly revenue matches your annual employer revenue divided evenly across the year.`}>
                  {totalRevenue.toFixed(2)}
                </Tooltip>
              </div>
              <br></br>
              <div><strong>{t.breakEven.totalMonthlyExpenses}</strong></div>
              <div>
                <Tooltip 
                  text={`Total Monthly Expenses is calculated as: (Total Employer Cost from Tab 1) ÷ 12.\n\nThis ensures the monthly cost matches your annual employer cost divided evenly across the year.`}>
                  {totalExpenses.toFixed(2)}
                </Tooltip>
              </div>
              <br></br>
              <div><strong>Net Profit:</strong></div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: netProfit >= 0 ? '#28a745' : '#dc3545' }}>
                <Tooltip text={`Total Revenue ($${totalRevenue.toFixed(2)}) - Total Expenses ($${totalExpenses.toFixed(2)}) = $${netProfit.toFixed(2)}`}>
                  {netProfit.toFixed(2)}
                </Tooltip>
              </div>
              <br></br>
              <div><strong>Net Margin:</strong></div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: netMargin >= 0 ? '#28a745' : '#dc3545' }}>
                <Tooltip text={`Net Profit ($${netProfit.toFixed(2)}) ÷ Total Revenue ($${totalRevenue.toFixed(2)}) × 100 = ${netMargin.toFixed(1)}%`}>
                  {netMargin.toFixed(1)}%
                </Tooltip>
              </div>
              <div></div>
            </div>
          </div>


          <h3 style={{ color: '#e83e8c', borderBottom: '2px solid #e83e8c', paddingBottom: '10px' }}>
            {t.breakEven.pricingStrategyRecommendations}
          </h3>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Strategic Analysis:</strong>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                {utilizationRate < targetUtilizationRate 
                  ? `Current Utilization is ${(targetUtilizationRate - utilizationRate).toFixed(1)}% lower than Target Utilization. This suggests lower pricing or enhanced marketing to attract sufficient bookings.`
                  : utilizationRate > targetUtilizationRate
                  ? `Current Utilization is ${(utilizationRate - targetUtilizationRate).toFixed(1)}% higher than Target Utilization. This indicates strong demand that supports premium pricing or capacity expansion.`
                  : "Your utilization matches your target - optimal operational efficiency achieved. Monitor market conditions for strategic adjustments."
                }
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px' }}>
              <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e83e8c' }}>
                <div><strong>Strategic Price for Target:</strong></div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e83e8c', marginTop: '5px' }}>
                  <Tooltip text={`Price to break even: (Employer Costs: $${employerCostsMonthly.toFixed(2)}) ÷ ${desiredAppointmentsMonthly.toFixed(0)} desired appointments = $${requiredPriceForTarget.toFixed(2)}`}>
                    ${requiredPriceForTarget.toFixed(2)}
                  </Tooltip>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  For desired {desiredAppointmentsMonthly} appointments
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#17a2b8', marginTop: '5px' }}>  
                  <Tooltip text={`Price Adjustment Formula:\nPrice per appointment $${pricePerAppointment.toFixed(2)} × [1 + 
                  (Current Utilization Rate ${utilizationRate.toFixed(2)}% – Target Utilization Rate ${targetUtilizationRate}%)]\n
                  This formula estimates a price adjustment based on the difference between your current and target utilization rates. 
                  If your utilization is above target, you may be able to increase prices; if below, consider lowering prices.`}>
                    ${(pricePerAppointment * (1 + ((utilizationRate - targetUtilizationRate) / 100))).toFixed(2)}
                  </Tooltip>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  For {targetUtilizationRate}% utilization
                </div>
              </div>
              
              <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #17a2b8' }}>
                <div><strong>Price Adjustment Strategy:</strong></div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px', color: requiredPriceForTarget > pricePerAppointment ? '#e83e8c' : '#e83e8c' }}>
                  <Tooltip text={`Price adjustment based on break-even ($${requiredPriceForTarget.toFixed(2)}) - Current market price ($${pricePerAppointment.toFixed(2)}) = ${requiredPriceForTarget > pricePerAppointment ? '+' : ''}$${(requiredPriceForTarget - pricePerAppointment).toFixed(2)}`}>
                    {requiredPriceForTarget > pricePerAppointment ? '+' : ''}
                    ${(requiredPriceForTarget - pricePerAppointment).toFixed(2)}
                  </Tooltip>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {requiredPriceForTarget > pricePerAppointment ? 'Premium pricing opportunity exists' : 'Possible competitive pricing adjustment'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px', color: requiredPriceForTarget > pricePerAppointment ? '#17a2b8' : '#17a2b8' }}>
                  <Tooltip text={`Price adjustment based on utilization ($${(pricePerAppointment * (1 + ((utilizationRate - targetUtilizationRate) / 100))).toFixed(2)}) - Current market price ($${pricePerAppointment.toFixed(2)}) = ${requiredPriceForTarget > pricePerAppointment ? '+' : ''}$${(requiredPriceForTarget - pricePerAppointment).toFixed(2)}`}>
                    {requiredPriceForTarget > pricePerAppointment ? '+' : ''}
                    ${(pricePerAppointment * (1 + ((utilizationRate - targetUtilizationRate) / 100)) - pricePerAppointment).toFixed(2)}
                  </Tooltip>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {requiredPriceForTarget > pricePerAppointment ? 'Premium pricing opportunity exists' : 'Possible competitive pricing adjustment'}
                </div>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ffc107' }}>
                <div><strong>Market Competitiveness:</strong></div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px', color: '#856404' }}>
                  <Tooltip text={`Market Competitiveness Categories:\n\n• Premium Market (85%+ utilization): High demand, supports premium pricing.\n• Competitive Market (70-84%): Strong demand, competitive pricing.\n• Price-Sensitive Market (50-69%): Moderate demand, price-sensitive customers.\n• Value Market (<50%): Low demand, focus on value and promotions.\n\nCategory is based on your current utilization rate: ${utilizationRate.toFixed(1)}%.`}>
                    {utilizationRate >= 85 ? 'Premium Market' : 
                     utilizationRate >= 70 ? 'Competitive Market' :
                     utilizationRate >= 50 ? 'Price-Sensitive Market' : 'Value Market'}
                  </Tooltip>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Based on current utilization
                </div>
              </div>
            </div>

            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '6px', border: '1px solid #bee5eb' }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#0c5460' }}>📊 Strategic Pricing Recommendations:</h5>
              <div style={{ fontSize: '13px', color: '#0c5460' }}>
                {utilizationRate < 50 ? 
                  '• Focus on value proposition and competitive pricing to increase market penetration\n• Consider promotional pricing or package deals to drive initial bookings\n• Ensure service quality justifies pricing to build customer loyalty' :
                utilizationRate < 70 ?
                  '• Maintain competitive pricing while improving service differentiation\n• Test modest price increases in peak time slots\n• Develop premium service tiers for higher-value customers' :
                utilizationRate < 85 ?
                  '• Good market position supports strategic price testing\n• Consider peak/off-peak pricing strategy\n• Develop premium service packages to increase average transaction value' :
                  '• Strong demand supports premium pricing strategy\n• Focus on service excellence to justify higher prices\n• Consider expanding capacity rather than raising prices if growth is the goal'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Section */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f1f3f4', borderRadius: '8px', border: '2px solid #6c757d' }}>
        <h3 style={{ textAlign: 'center', color: '#6c757d', marginBottom: '15px' }}>
          📋 Executive Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', textAlign: 'center' }}>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
            <Tooltip text={`Utilization Rate = (Actual Hours Booked ÷ Total Available Hours) × 100\n= (${actualHoursBookedMonthly.toFixed(1)} ÷ ${totalAvailableHours.toFixed(1)}) × 100 = ${utilizationRate.toFixed(1)}%`}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: utilizationRate >= 75 ? '#28a745' : '#dc3545', cursor: 'help' }}>
                {utilizationRate.toFixed(1)}%
              </div>
            </Tooltip>
            <div style={{ fontSize: '12px', color: '#666' }}>Current Utilization</div>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
            <Tooltip text={wageModel === 'Hourly' && employmentType === '1099' 
              ? 'Booth Rental Model: No break-even appointment calculation needed. Employer receives fixed rent.'
              : `Break-Even Appointments = Total Monthly Employer Costs ÷ Price per appointment\n= $${employerCostsMonthly.toFixed(2)} = ${breakEvenAppointments} appointments needed monthly to break even`}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14', cursor: 'help' }}>
                {wageModel === 'Hourly' && employmentType === '1099' ? 'N/A' : breakEvenAppointments}
              </div>
            </Tooltip>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {wageModel === 'Hourly' && employmentType === '1099' ? 'Booth Rental Model' : 'Break-Even Appointments'}
            </div>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
            <Tooltip text={`Net Profit = Total Revenue - Total Expenses\n= $${totalRevenue.toFixed(2)} - $${totalExpenses.toFixed(2)} = $${netProfit.toFixed(2)} per month`}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: netProfit >= 0 ? '#28a745' : '#dc3545', cursor: 'help' }}>
                ${Math.abs(netProfit).toFixed(2)}
              </div>
            </Tooltip>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {netProfit >= 0 ? 'Monthly Profit' : 'Monthly Loss'}
            </div>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
            <Tooltip text={`Recommended Price = Employer Costs ÷ (Target Appointments × (1 - Target Margin %))\nThis is the minimum price per service needed to reach your target profit margin, based on your cost structure and utilization goal.`}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e83e8c', cursor: 'help' }}>
                ${requiredPriceForTarget.toFixed(0)}
              </div>
            </Tooltip>
            <div style={{ fontSize: '12px', color: '#666' }}>Recommended Price</div>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px', border: '1px solid #bee5eb' }}>
        <h3 style={{ color: '#0c5460', marginBottom: '15px' }}>
          💡 Key Business Insights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>
            
<Tooltip text={`
**Region Analysis:**

🟡 San Francisco & Los Angeles -

    Estimated Utilization Rate: 70-80%

    Key Characteristics: High salon density, strong demand, premium salons often fully booked on weekends

🟡 Westminster & Fountain Valley -

    Estimated Utilization Rate: 65-75%

    Key Characteristics: High concentration of Vietnamese-owned salons, extended hours, competitive pricing

🟡 Alameda & Santa Clara -

    Estimated Utilization Rate: 60-70%

    Key Characteristics: Suburban markets, spikes evenings/weekends, tech-driven booking apps boost utilization
`}>

              Capacity Analysis
</Tooltip>
            </h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              You have {totalAvailableHoursMonthly.toFixed(0)} hours of capacity per month. 
              {utilizationRate < 85 
                ? ` You're using ${utilizationRate.toFixed(1)}% - there's room to grow without adding staff.`
                : ` You're highly utilized at ${utilizationRate.toFixed(1)}% - consider expanding capacity.`
              }
            </p>
          </div>
          {/* <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>Revenue Opportunity</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              At full capacity, you could serve {Math.floor(totalAvailableHoursMonthly / avgAppointmentDuration)} appointments monthly, 
              generating ${(totalAvailableHoursMonthly / avgAppointmentDuration * pricePerAppointment).toFixed(2)} in revenue 
              ({((totalAvailableHoursMonthly / avgAppointmentDuration * pricePerAppointment - totalRevenue) / 1000).toFixed(0)}k more than current).
            </p>
          </div> */}
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>Pricing Impact</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              A $5 price increase would generate ${(actualAppointmentsPerMonth * 5).toFixed(2)} additional monthly revenue. A $5 decrease might attract more bookings but reduce margin by 
              ${(actualAppointmentsPerMonth * 5).toFixed(2)}.
            </p>
          </div>
        </div>
      </div>



      {/* Enhanced Utilization Guidance Section */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #6c757d' }}>
        <h3 style={{ color: '#495057', borderBottom: '2px solid #6c757d', paddingBottom: '10px' }}>
          🎯 {t.breakEven.strategicUtilizationGuidance}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4 style={{ color: '#495057', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '18px' }}>📊</span>
              Current Performance
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Utilization Rate:</strong> 
                <Tooltip text={`Utilization Rate = (Actual Hours Booked ÷ Total Available Hours) × 100\n= (${actualHoursBookedMonthly.toFixed(1)} ÷ ${totalAvailableHours.toFixed(1)}) × 100 = ${utilizationRate.toFixed(1)}%`}>
                  <span style={{ color: utilizationRate >= 75 ? '#28a745' : utilizationRate >= 50 ? '#ffc107' : '#dc3545', fontWeight: 'bold', marginLeft: 4, cursor: 'help' }}>
                    {utilizationRate.toFixed(1)}%
                  </span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Efficiency Level:</strong> 
                <Tooltip text={`Efficiency Level is based on Utilization Rate calculation: (Actual Hours Booked ÷ Total Available Hours) × 100. 

Levels:
🟢 High (85%+): Excellent efficiency - consider premium pricing or expansion
🟡 Good (70-84%): Strong performance - optimize for growth
🟠 Moderate (50-69%): Room for improvement - focus on marketing & scheduling
🔴 Low (<50%): Underutilized - reduce costs or increase demand

Current: ${utilizationRate.toFixed(1)}% = ${actualHoursBookedMonthly.toFixed(0)} hours booked ÷ ${totalAvailableHours.toFixed(0)} available hours`}>
                  <span style={{ marginLeft: '5px', cursor: 'help' }}>
                    {utilizationRate >= 85 ? '🟢 High' :
                     utilizationRate >= 70 ? '🟡 Good' :
                     utilizationRate >= 50 ? '🟠 Moderate' : '🔴 Low'}
                  </span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Appointments per Day:</strong> 
                <Tooltip text={`Appointments per Day = Total Appointments per Month ÷ Days in Month\n= ${actualAppointmentsPerMonth.toFixed(0)} ÷ ${daysInPeriod} = ${(actualAppointmentsPerMonth / daysInPeriod).toFixed(1)}`}> 
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{(actualAppointmentsPerMonth / daysInPeriod).toFixed(1)}</span>
                </Tooltip>
              </div>
              <div>
                <strong>Revenue per Hour:</strong> 
                <Tooltip text={`Revenue per Hour = Total Revenue ÷ Actual Hours Booked\n= ${formatCurrency(totalRevenue)} ÷ ${actualHoursBookedMonthly.toFixed(1)} = $${(totalRevenue / actualHoursBookedMonthly).toFixed(0)}`}> 
                  <span style={{ marginLeft: 4, cursor: 'help' }}>${(totalRevenue / actualHoursBookedMonthly).toFixed(0)}</span>
                </Tooltip>
              </div>
            </div>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4 style={{ color: '#495057', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '18px' }}>🎯</span>
              Target vs Current
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Target Utilization:</strong> 
                <Tooltip text={`Target Utilization is your goal for how much of your available time should be booked. Set in the configuration above.`}>
                  <span style={{ color: '#17a2b8', fontWeight: 'bold', marginLeft: 4, cursor: 'help' }}>{targetUtilizationRate}%</span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Gap to Target:</strong> 
                <Tooltip text={`Gap to Target = Utilization Rate - Target Utilization\n= ${utilizationRate.toFixed(1)}% - ${targetUtilizationRate}% = ${(utilizationRate - targetUtilizationRate).toFixed(1)}%`}> 
                  <span style={{ color: utilizationRate >= targetUtilizationRate ? '#28a745' : '#dc3545', fontWeight: 'bold', marginLeft: 4, cursor: 'help' }}>
                    {utilizationRate >= targetUtilizationRate ? '+' : ''}{(utilizationRate - targetUtilizationRate).toFixed(1)}%
                  </span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Target Appointments:</strong> 
                <Tooltip text={`Target Appointments = Number of appointments needed to reach your target utilization.\n= ${desiredAppointmentsMonthly.toFixed(0)} per month`}>
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{desiredAppointmentsMonthly.toFixed(0)} monthly</span>
                </Tooltip>
              </div>
              <div>
                <strong>Appointments Needed:</strong> 
                <Tooltip text={`Appointments Needed = Target Appointments - Actual Appointments\n= ${desiredAppointmentsMonthly.toFixed(0)} - ${actualAppointmentsPerMonth.toFixed(0)} = ${(desiredAppointmentsMonthly - actualAppointmentsPerMonth).toFixed(0)}${desiredAppointmentsMonthly - actualAppointmentsPerMonth > 0 ? ' more monthly' : ' (Target exceeded)'}`}> 
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{desiredAppointmentsMonthly - actualAppointmentsPerMonth > 0 ? `${(desiredAppointmentsMonthly - actualAppointmentsPerMonth).toFixed(0)} more monthly` : 'Target exceeded ✅'}</span>
                </Tooltip>
              </div>
            </div>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4 style={{ color: '#495057', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '18px' }}>⚡</span>
              Operational Metrics
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Capacity Used:</strong> 
                <Tooltip text={`Capacity Used = Actual Appointments per Month of Maximum Possible\n= ${actualAppointmentsPerMonth.toFixed(0)} of ${Math.floor(totalAvailableHoursMonthly / avgAppointmentDuration)} possible appointments`}>
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{actualAppointmentsPerMonth.toFixed(0)} of {Math.floor(totalAvailableHoursMonthly / avgAppointmentDuration)} possible</span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Avg Service Time:</strong> 
                <Tooltip text={`Average Service Time = Appointment Duration × 60\n= ${avgAppointmentDuration} hours × 60 = ${(avgAppointmentDuration * 60).toFixed(0)} minutes`}>
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{(avgAppointmentDuration * 60).toFixed(0)} minutes</span>
                </Tooltip>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Daily Capacity:</strong> 
                <Tooltip text={`Daily Capacity = Operation Hours ÷ Appointment Duration\n= ${operationHours} ÷ ${avgAppointmentDuration} = ${Math.floor(operationHours / avgAppointmentDuration)} appointments per tech per day`}>
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{Math.floor(operationHours / avgAppointmentDuration)} appointments/tech</span>
                </Tooltip>
              </div>
              <div>
                <strong>Time Frame:</strong> 
                <Tooltip text={`Time Frame is set in the configuration above.\n${'Monthly Analysis: All calculations are for a typical month.'}`}> 
                  <span style={{ marginLeft: 4, cursor: 'help' }}>{'Monthly Analysis'}</span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px', border: '1px solid #adb5bd' }}>
          <h4 style={{ color: '#495057', margin: '0 0 15px 0' }}>📋 Strategic Action Plan:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {utilizationRate < 50 && (
              <div style={{ padding: '10px', backgroundColor: '#fff5f5', borderRadius: '6px', borderLeft: '4px solid #dc3545' }}>
                <strong style={{ color: '#dc3545' }}>🚨 Critical Priority:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Focus on marketing campaigns, customer retention, and service optimization to significantly increase bookings.
                </p>
              </div>
            )}
            
            {utilizationRate >= 50 && utilizationRate < 70 && (
              <div style={{ padding: '10px', backgroundColor: '#fff8e1', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
                <strong style={{ color: '#856404' }}>⚠️ Growth Opportunity:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Implement retention strategies, optimize scheduling efficiency, and consider targeted marketing campaigns.
                </p>
              </div>
            )}
            
            {utilizationRate >= 70 && utilizationRate < 85 && (
              <div style={{ padding: '10px', backgroundColor: '#f0f8f0', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
                <strong style={{ color: '#28a745' }}>✅ Optimize Operations:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Fine-tune scheduling, consider premium service offerings, and prepare for potential capacity expansion.
                </p>
              </div>
            )}
            
            {utilizationRate >= 85 && (
              <div style={{ padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '6px', borderLeft: '4px solid #17a2b8' }}>
                <strong style={{ color: '#0c5460' }}>🚀 Scale Strategy:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  Consider expanding capacity, implementing premium pricing strategies, or exploring additional service locations.
                </p>
              </div>
            )}
            
            <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #6c757d' }}>
              <strong style={{ color: '#495057' }}>{t.breakEven.pricingStrategyRecommendations}:</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                {utilizationRate < targetUtilizationRate ? 
                  'Consider competitive pricing or promotional offers to increase bookings.' :
                  'Your utilization supports premium pricing. Test gradual price increases.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Export */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📊 Export Analysis Results</h4>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#495057' }}>
          Export your break-even analysis results to CSV for further analysis or record keeping.
        </p>
        <button 
          onClick={exportBreakEvenData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📥 Download Analysis Results
        </button>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          {t.breakEven.legalDisclaimer}
        </h4>
        <div style={{ fontSize: '14px', color: '#856404' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.breakEven.financialProjections}</strong> {t.breakEven.financialProjectionsText}
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.breakEven.businessModelValidation}</strong> {t.breakEven.businessModelValidationText}
          </p>
          <p style={{ margin: '0' }}>
            <strong>{t.breakEven.professionalAdviceRequired}</strong> {t.breakEven.professionalAdviceRequiredText}
          </p>
        </div>
      </div>
    </div>
  );
}
