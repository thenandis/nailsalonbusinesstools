import React, { useState } from 'react';
import { getNumericValue, createNumericHandler, formatCurrency, createDecimalInputProps } from '../utils/numericInputUtils';
import { useSaveLoadManager, SaveLoadUI } from '../utils/saveLoadManager';
// import { createDaysInMonthHandler } from '../utils/dateValidationUtils'; // unused
import { downloadCSV } from '../utils/exportUtils.js';
import Tooltip from './common/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslationContext } from '../contexts/TranslationContext';
import operatingCostsData from '../data/OperatingCosts.js';
import supplementalCostsData from '../data/SupplementalCosts.js';
import minWageDataOriginal from '../data/minwage.json';
import MinWageUploader from './common/MinWageUploader';

export default function NailSalonW2vs1099Model() {
  // Calculate hoursPerWeek from daysOpenPerMonth for consistent use
  // Formula: hoursPerWeek = daysOpenPerMonth * 12 / 52
  // This assumes 12 months per year, 52 weeks per year
  // This value will be used instead of the user-editable state
  // If you want to keep the user-editable field, comment out the next line
  // Default values for all fields
  const defaultValues = {
    avgServicesPerShift: 5,
    avgPricePerService: 50,
    technicianSharePercent: 50,
    avgSuppliesCostPerService: 2.50,
    avgServiceTipPercent: 30,
    w2HourlyWage: 20,
    hoursPerWeek: 40,
    budgetSupplementalCosts: 0,
    budgetOperatingCosts: 0,
    monthlyRentPerTech: 300,
    timeFrame: 'monthly',
    wageModel: 'Commission',
    employmentType: 'W2',
    targetUtilizationRate: 75,
    numTechnicians: 3,
    operationHours: 8,
    daysOpenPerMonth: 26,
    daysOpenPerWeek: 6,
    appointmentsPerTechPerDay: 6,
    avgAppointmentDuration: 0.5,
    socialSecurityRate: 6.2,
    medicareRate: 1.45,
    futaRate: 1.5,
    sutaRate: 3.4,
    ettRate: 0.1,
    workersCompRate: 0.0,
    paidSickLeaveRate: 0.0
  };

  // Reset all fields to their default values
  const resetAllFields = () => {
  setAvgServicesPerShift(defaultValues.avgServicesPerShift);
  setAvgPricePerService(defaultValues.avgPricePerService);
  setTechnicianSharePercent(defaultValues.technicianSharePercent);
  setAvgSuppliesCostPerService(defaultValues.avgSuppliesCostPerService);
  setAvgServiceTipPercent(defaultValues.avgServiceTipPercent);
  setW2HourlyWage(defaultValues.w2HourlyWage);
  setHoursPerWeek(defaultValues.hoursPerWeek);
  setMonthlyRentPerTech(defaultValues.monthlyRentPerTech);
  // setTimeFrame(defaultValues.timeFrame); // Removed weekly/monthly toggle
  setWageModel(defaultValues.wageModel);
  setEmploymentType(defaultValues.employmentType);
  setTargetUtilizationRate(defaultValues.targetUtilizationRate);
  setNumTechnicians(defaultValues.numTechnicians);
  setOperationHours(defaultValues.operationHours);
  setDaysOpenPerMonth(defaultValues.daysOpenPerMonth);
  // setDaysOpenPerWeek(defaultValues.daysOpenPerWeek); // Removed weekly logic
  setAvgAppointmentDuration(defaultValues.avgAppointmentDuration);
  setSocialSecurityRate(defaultValues.socialSecurityRate);
  setMedicareRate(defaultValues.medicareRate);
  setFutaRate(defaultValues.futaRate);
  setSutaRate(defaultValues.sutaRate);
  setEttRate(defaultValues.ettRate);
  setWorkersCompRate(defaultValues.workersCompRate);
  setPaidSickLeaveRate(defaultValues.paidSickLeaveRate);
  // Reset locality selection
  setSelectedYear('2026');
  setSelectedLocality(minWageData.data['2026']?.[0]?.city || '');
  setLocalitySearchTerm('');
  setUseSmallEmployerRate(false);
    // Only clear model data, NOT budget tool values
    localStorage.removeItem('w2vs1099ModelData');
    // Trigger Budget Tool to reset and re-save its defaults
    window.dispatchEvent(new CustomEvent('budgetDataReset', {
      detail: { componentName: 'all', timestamp: Date.now() }
    }));
    // Wait for Budget Tool to update localStorage, then reload values
    setTimeout(() => {
      // Supplemental costs: prefer values from localStorage; if missing, fall back to the
      // built-in `SupplementalCosts` data file which lists items with cost and frequency.
      let supplemental = 0;
      const monthlySupplemental = localStorage.getItem('monthlySupplementalCosts');
      const totalAnnualSupplementalCosts = localStorage.getItem('totalAnnualSupplementalCosts');
      if (monthlySupplemental !== null && !isNaN(parseFloat(monthlySupplemental))) {
        supplemental = parseFloat(monthlySupplemental);
      } else if (totalAnnualSupplementalCosts !== null && !isNaN(parseFloat(totalAnnualSupplementalCosts))) {
        supplemental = parseFloat(totalAnnualSupplementalCosts) / 12;
      } else {
        // Compute from supplementalCostsData: convert annual/monthly entries to an annual sum,
        // then divide by 12 for monthly value.
        try {
          const annualFromData = supplementalCostsData.reduce((sum, cost) => {
            if (!cost || typeof cost.cost !== 'number') return sum;
            return sum + (cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost);
          }, 0);
          if (annualFromData > 0) {
            supplemental = annualFromData / 12;
            // store computed values to localStorage for consistency with Budget Tool behavior
            localStorage.setItem('totalAnnualSupplementalCosts', annualFromData.toString());
            localStorage.setItem('monthlySupplementalCosts', (annualFromData / 12).toString());
          }
        } catch (e) {
          // keep supplemental at 0 on error
          console.error('Error computing supplemental fallback from data file:', e);
        }
      }
      setBudgetSupplementalCosts(supplemental);

      let operating = 0;
      const monthlyOperating = localStorage.getItem('monthlyOperatingCosts');
      const totalAnnualOperatingCosts = localStorage.getItem('totalAnnualOperatingCosts');
      if (monthlyOperating !== null && !isNaN(parseFloat(monthlyOperating))) {
        operating = parseFloat(monthlyOperating);
      } else if (totalAnnualOperatingCosts !== null && !isNaN(parseFloat(totalAnnualOperatingCosts))) {
        operating = parseFloat(totalAnnualOperatingCosts) / 12;
      }
      setBudgetOperatingCosts(operating);
    }, 200);
  };
  const { language } = useLanguage();
  const { translations: t } = useTranslationContext();

  // Custom minimum wage data state - load from localStorage or use original
  const [minWageData, setMinWageData] = useState(() => {
    const storedData = localStorage.getItem('customMinWageData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        return minWageDataOriginal;
      }
    }
    return minWageDataOriginal;
  });

  // Handler for when new minimum wage data is uploaded
  const handleMinWageDataLoaded = (newData) => {
    setMinWageData(newData);
    localStorage.setItem('customMinWageData', JSON.stringify(newData));
    // Reset to first available year and locality after upload
    const firstYear = Object.keys(newData.data).sort((a, b) => b - a)[0];
    if (firstYear) {
      setSelectedYear(firstYear);
      const firstLocality = newData.data[firstYear]?.[0]?.city || '';
      setSelectedLocality(firstLocality);
    }
  };

  // Minimum Wage Selection State
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedLocality, setSelectedLocality] = useState(() => {
    const savedData = localStorage.getItem('w2vs1099ModelData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return parsedData.selectedLocality || (minWageData.data['2026']?.[0]?.city || '');
      } catch (e) {
        return minWageData.data['2026']?.[0]?.city || '';
      }
    }
    return minWageData.data['2026']?.[0]?.city || '';
  });
  const [localitySearchTerm, setLocalitySearchTerm] = useState('');
  const [isLocalityDropdownOpen, setIsLocalityDropdownOpen] = useState(false);
  const [useSmallEmployerRate, setUseSmallEmployerRate] = useState(() => {
    const savedData = localStorage.getItem('w2vs1099ModelData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return parsedData.useSmallEmployerRate || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  // Get selected minimum wage from minWageData
  const getSelectedMinWage = () => {
    const yearData = minWageData.data[selectedYear];
    if (!yearData) return 16.90; // fallback to CA state minimum
    const locality = yearData.find(loc => loc.city === selectedLocality);
    if (!locality) return 16.90;
    
    // Use small employer rate if checkbox is checked and rate is available
    if (useSmallEmployerRate && locality.smallEmployerRate) {
      return locality.smallEmployerRate;
    }
    return locality.minimumWage || 16.90;
  };

  const selectedMinWage = getSelectedMinWage();

  // Helper function to get initial value from localStorage or default
  const getInitialValue = (key, defaultValue) => {
    try {
      const savedData = localStorage.getItem('w2vs1099ModelData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const savedValue = parsedData[key];
        
        // Fix for legacy values that were set to 0 by old conditional logic
        if ((key === 'avgSuppliesCostPerService' || key === 'monthlyRentPerTech') && 
            (savedValue === 0 || savedValue === '0')) {
          return defaultValue;
        }
        
        return savedValue !== undefined ? savedValue : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  // Shared Business Parameters
  const [avgServicesPerShift, setAvgServicesPerShift] = useState(() => getInitialValue('avgServicesPerShift', 5));
  const [avgPricePerService, setAvgPricePerService] = useState(() => getInitialValue('avgPricePerService', 50));
  const [technicianSharePercent, setTechnicianSharePercent] = useState(() => getInitialValue('technicianSharePercent', 50));
  const [avgSuppliesCostPerService, setAvgSuppliesCostPerService] = useState(() => getInitialValue('avgSuppliesCostPerService', 2.50));
  const [avgServiceTipPercent, setAvgServiceTipPercent] = useState(() => getInitialValue('avgServiceTipPercent', 30));
    
  // Budget Tool Data - Employer Expenses (read-only)
  const [budgetSupplementalCosts, setBudgetSupplementalCosts] = useState(0);
  const [budgetOperatingCosts, setBudgetOperatingCosts] = useState(0);
  
  // Rent Parameters
  const [monthlyRentPerTech, setMonthlyRentPerTech] = useState(() => getInitialValue('monthlyRentPerTech', 300));

  // Time Frame and Business Model Selection Parameters
  const [timeFrame, setTimeFrame] = useState(() => getInitialValue('timeFrame', 'monthly'));
  const [wageModel, setWageModel] = useState(() => getInitialValue('wageModel', 'Commission'));
  const [employmentType, setEmploymentType] = useState(() => getInitialValue('employmentType', 'W2'));
  const [targetUtilizationRate, setTargetUtilizationRate] = useState(() => getInitialValue('targetUtilizationRate', 75));

  // Operational Efficiency Parameters
  const [numTechnicians, setNumTechnicians] = useState(() => getInitialValue('numTechnicians', 3));
  const [operationHours, setOperationHours] = useState(() => getInitialValue('operationHours', 8));
  const [daysOpenPerMonth, setDaysOpenPerMonth] = useState(() => getInitialValue('daysOpenPerMonth', 26));
  const [daysOpenPerWeek, setDaysOpenPerWeek] = useState(() => getInitialValue('daysOpenPerWeek', 6));
  // appointmentsPerTechPerDay is always equal to avgServicesPerShift
  const appointmentsPerTechPerDay = avgServicesPerShift;
  const [avgAppointmentDuration, setAvgAppointmentDuration] = useState(() => getInitialValue('avgAppointmentDuration', 0.5));

  // W2 Employee Model Parameters
  const [w2HourlyWage, setW2HourlyWage] = useState(() => getInitialValue('w2HourlyWage', 20));
  // Make hoursPerWeek editable and keep it in sync with daysOpenPerMonth.
  // We use a ref `lastEdited` to avoid feedback loops when updating one from the other.
  // Make hoursPerWeek fully user-controlled. Default to 40 if no saved value exists.
  const [hoursPerWeek, setHoursPerWeek] = useState(() => getInitialValue('hoursPerWeek', 40));
  const lastEdited = React.useRef(null); // 'hours' | 'days' | null



  // Employee Taxes and Expenses Parameters (W2 Employer Burden)
  const [socialSecurityRate, setSocialSecurityRate] = useState(() => getInitialValue('socialSecurityRate', 6.2));
  const [medicareRate, setMedicareRate] = useState(() => getInitialValue('medicareRate', 1.45));
  const [futaRate, setFutaRate] = useState(() => getInitialValue('futaRate', 1.5));
  const [sutaRate, setSutaRate] = useState(() => getInitialValue('sutaRate', 3.4));
  const [ettRate, setEttRate] = useState(() => getInitialValue('ettRate', 0.1));
  const [workersCompRate, setWorkersCompRate] = useState(() => getInitialValue('workersCompRate', 0.0));
  const [paidSickLeaveRate, setPaidSickLeaveRate] = useState(() => getInitialValue('paidSickLeaveRate', 0.0));

  // Note: Employer Payroll Taxes are calculated automatically based on mandatory rates

  // Collapsible sections state
  const [sectionsExpanded, setSectionsExpanded] = useState({
    minWageSection: true,
    businessModel: true,
    businessParams: true,
    operationalEfficiency: true,
    employeeTaxes: true,
    employerBenefits: true,
    employerExpenses: true,
    results: true
  });

  
  // Function to toggle individual sections
  const toggleSection = (sectionName) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Single toggle for expand/collapse all sections
  const areAllSectionsExpanded = Object.values(sectionsExpanded).every(Boolean);
  const toggleAllSections = () => {
    if (areAllSectionsExpanded) {
      setSectionsExpanded({
        minWageSection: false,
        businessModel: false,
        businessParams: false,
        operationalEfficiency: false,
        employeeTaxes: false,
        employerBenefits: false,
        employerExpenses: false,
        results: false
      });
    } else {
      setSectionsExpanded({
        minWageSection: true,
        businessModel: true,
        businessParams: true,
        operationalEfficiency: true,
        employeeTaxes: true,
        employerBenefits: true,
        employerExpenses: true,
        results: true
      });
    }
  };

  // Load budget tool data and listen for updates (robust, single useEffect)
  React.useEffect(() => {
    // Function to load budget data from localStorage with robust fallback
    const loadBudgetData = () => {
      try {
        // Supplemental Costs
        // Same fallback logic used on initial load: prefer localStorage values, else compute from data file
        let supplemental = 0;
        const monthlySupplemental = localStorage.getItem('monthlySupplementalCosts');
        const totalAnnualSupplementalCosts = localStorage.getItem('totalAnnualSupplementalCosts');
        if (monthlySupplemental !== null && !isNaN(parseFloat(monthlySupplemental))) {
          supplemental = parseFloat(monthlySupplemental);
        } else if (totalAnnualSupplementalCosts !== null && !isNaN(parseFloat(totalAnnualSupplementalCosts))) {
          supplemental = parseFloat(totalAnnualSupplementalCosts) / 12;
        } else {
          try {
            const annualFromData = supplementalCostsData.reduce((sum, cost) => {
              if (!cost || typeof cost.cost !== 'number') return sum;
              return sum + (cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost);
            }, 0);
            if (annualFromData > 0) {
              supplemental = annualFromData / 12;
              localStorage.setItem('totalAnnualSupplementalCosts', annualFromData.toString());
              localStorage.setItem('monthlySupplementalCosts', (annualFromData / 12).toString());
            }
          } catch (e) {
            console.error('Error computing supplemental fallback from data file:', e);
          }
        }
        setBudgetSupplementalCosts(supplemental);

        // Operating Costs: ensure defaults are present if missing
        let monthlyOperating = localStorage.getItem('monthlyOperatingCosts');
        let totalAnnualOperatingCosts = localStorage.getItem('totalAnnualOperatingCosts');
        if ((monthlyOperating === null || isNaN(parseFloat(monthlyOperating))) || (totalAnnualOperatingCosts === null || isNaN(parseFloat(totalAnnualOperatingCosts)))) {
          // Calculate defaults from data file
          const total = operatingCostsData.reduce((sum, cost) => sum + cost.annualCost, 0);
          localStorage.setItem('totalAnnualOperatingCosts', total.toString());
          localStorage.setItem('monthlyOperatingCosts', (total / 12).toString());
          monthlyOperating = (total / 12).toString();
          totalAnnualOperatingCosts = total.toString();
        }
        let operating = 0;
        if (monthlyOperating !== null && !isNaN(parseFloat(monthlyOperating))) {
          operating = parseFloat(monthlyOperating);
        } else if (totalAnnualOperatingCosts !== null && !isNaN(parseFloat(totalAnnualOperatingCosts))) {
          operating = parseFloat(totalAnnualOperatingCosts) / 12;
        }
        setBudgetOperatingCosts(operating);
      } catch (error) {
        setBudgetSupplementalCosts(0);
        setBudgetOperatingCosts(0);
        console.error('Error loading budget data:', error);
      }
    };

    // Load initial data
    loadBudgetData();

    // Listen for budget data updates from Budget Tool
    const handleBudgetDataUpdate = (event) => {
      if (!event.detail || event.detail.componentName === 'supplemental' || event.detail.componentName === 'operating') {
        loadBudgetData();
      }
    };

    window.addEventListener('budgetDataUpdated', handleBudgetDataUpdate);

    return () => {
      window.removeEventListener('budgetDataUpdated', handleBudgetDataUpdate);
    };
  }, []);

  // Save data to localStorage whenever values change (for Break-Even Model integration)
  React.useEffect(() => {
    // Note: hoursPerWeek is now fully user-controlled and is NOT auto-computed here.
    const w2vs1099ModelData = {
      avgServicesPerShift,
      avgPricePerService,
      technicianSharePercent,
      avgSuppliesCostPerService,
      avgServiceTipPercent,
      w2HourlyWage,
  hoursPerWeek,
      selectedLocality,
      selectedYear,
      useSmallEmployerRate,
      monthlyRentPerTech,
      // Budget Tool employer expenses
      budgetSupplementalCosts,
      budgetOperatingCosts,
      // New operational and business model parameters
      timeFrame,
      wageModel,
      employmentType,
      targetUtilizationRate,
      numTechnicians,
      operationHours,
      daysOpenPerMonth,
      daysOpenPerWeek,
  appointmentsPerTechPerDay: avgServicesPerShift,
      avgAppointmentDuration,
      // Employee Taxes and Expenses (W2 Employer Burden)
      socialSecurityRate,
      medicareRate,
      futaRate,
      sutaRate,
      ettRate,
      workersCompRate,
      paidSickLeaveRate,      
      // Note: Employer optional benefits removed
    };
    localStorage.setItem('w2vs1099ModelData', JSON.stringify(w2vs1099ModelData));
  }, [
    avgServicesPerShift, avgPricePerService, technicianSharePercent,
    avgSuppliesCostPerService, avgServiceTipPercent, w2HourlyWage,
    hoursPerWeek, budgetSupplementalCosts, budgetOperatingCosts,
    monthlyRentPerTech, timeFrame, wageModel, employmentType, targetUtilizationRate,
    numTechnicians, operationHours, daysOpenPerMonth, daysOpenPerWeek,
  appointmentsPerTechPerDay, avgAppointmentDuration,
    socialSecurityRate, medicareRate, futaRate, sutaRate, ettRate, workersCompRate, paidSickLeaveRate,
    selectedLocality, selectedYear, useSmallEmployerRate
  ]);

  // When hoursPerWeek changes (user edited hours), update daysOpenPerMonth accordingly.
  React.useEffect(() => {
    // daysOpenPerMonth = hoursPerWeek * 52 / (operationHours * 12)
    const opHours = getNumericValue(operationHours);
    if (opHours && opHours > 0) {
      const computedDays = getNumericValue(hoursPerWeek) * 52 / (opHours * 12);
      if (lastEdited.current !== 'days') {
        if (Math.abs(getNumericValue(daysOpenPerMonth) - computedDays) > 1e-6) {
          setDaysOpenPerMonth(computedDays);
        }
      }
    }
    // reset the lastEdited flag after automatic sync to allow further user edits
    const id = setTimeout(() => { lastEdited.current = null; }, 0);
    return () => clearTimeout(id);
  }, [hoursPerWeek, operationHours, daysOpenPerMonth]);

  // Update w2HourlyWage when minimum wage selection changes
  React.useEffect(() => {
    setW2HourlyWage(selectedMinWage);
  }, [selectedMinWage]);

  // Remove conditional logic - keep default values always available for Model 4 calculations

  // Export function for CSV export
  const exportW2vs1099Data = (key, loadDataFn) => {
    const data = loadDataFn(key);
    if (!data) {
      alert(t.common.noDataToExport);
      return;
    }

    const fileName = key.replace('nailsalon_w2vs1099_', '') || 'w2-vs-1099-model';
    
    // Create CSV content
    let csvContent = 'Nail Salon W2 vs 1099 Model Export\n';
    csvContent += `Exported on: ${new Date().toLocaleString()}\n`;
    csvContent += `Data Set: ${fileName}\n`;
    csvContent += `Original Save Date: ${data.savedAt ? new Date(data.savedAt).toLocaleString() : 'Unknown'}\n\n`;
    
    // Business Parameters
    csvContent += 'BUSINESS PARAMETERS\n';
    csvContent += 'Parameter,Value\n';
    csvContent += `Average Services per Shift,${data.avgServicesPerShift}\n`;
    csvContent += `Average Price per Service,$${data.avgPricePerService}\n`;
    csvContent += `Technician Share Percent,${data.technicianSharePercent}%\n`;
    csvContent += `Supplies Cost per Service,$${data.avgSuppliesCostPerService}\n`;
    csvContent += `Service Tip Percent,${data.avgServiceTipPercent}%\n\n`;
    
    // W2 Parameters
    csvContent += 'W2 EMPLOYEE PARAMETERS\n';
    csvContent += 'Parameter,Value\n';
    csvContent += `W2 Hourly Wage,$${data.w2HourlyWage}\n`;
    csvContent += `Hours per Week,${hoursPerWeek}\n`;
    csvContent += `Budget Tool Supplemental Costs (Monthly),$${data.budgetSupplementalCosts}\n`;
    csvContent += `Budget Tool Operating Costs (Monthly),$${data.budgetOperatingCosts}\n`;
    csvContent += `Monthly Rent per Tech,$${data.monthlyRentPerTech}\n\n`;
    
    // Calculate and add summary
    const dailyRev = data.avgServicesPerShift * data.avgPricePerService;
  const annualRev = dailyRev * (data.daysOpenPerMonth * 12);
  const annualW2Wage = data.w2HourlyWage * hoursPerWeek * 52;
    
    csvContent += 'CALCULATED SUMMARY\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Daily Revenue,$${dailyRev.toFixed(2)}\n`;
    csvContent += `Annual Revenue,$${annualRev.toFixed(2)}\n`;
    csvContent += `Annual W2 Wage,$${annualW2Wage.toFixed(2)}\n`;
    
    // Download the file
    downloadCSV(csvContent, `${fileName}-w2vs1099-export`);
  };

  // Setup save/load management
  const dataGetters = {
    avgServicesPerShift: () => avgServicesPerShift,
    avgPricePerService: () => avgPricePerService,
    technicianSharePercent: () => technicianSharePercent,
    avgSuppliesCostPerService: () => avgSuppliesCostPerService,
    avgServiceTipPercent: () => avgServiceTipPercent,
    w2HourlyWage: () => w2HourlyWage,
    hoursPerWeek: () => hoursPerWeek,
    budgetSupplementalCosts: () => budgetSupplementalCosts,
    budgetOperatingCosts: () => budgetOperatingCosts,
    monthlyRentPerTech: () => monthlyRentPerTech,
    // New operational parameters
    timeFrame: () => timeFrame,
    wageModel: () => wageModel,
    employmentType: () => employmentType,
    targetUtilizationRate: () => targetUtilizationRate,
    numTechnicians: () => numTechnicians,
    operationHours: () => operationHours,
    daysOpenPerMonth: () => daysOpenPerMonth,
    daysOpenPerWeek: () => daysOpenPerWeek,
  appointmentsPerTechPerDay: () => avgServicesPerShift,
    avgAppointmentDuration: () => avgAppointmentDuration,
    // Employee Taxes and Expenses (W2 Employer Burden)
    socialSecurityRate: () => socialSecurityRate,
    medicareRate: () => medicareRate,
    futaRate: () => futaRate,
    sutaRate: () => sutaRate,
    ettRate: () => ettRate,
    workersCompRate: () => workersCompRate,
    paidSickLeaveRate: () => paidSickLeaveRate
    // Note: Employer optional benefits removed
  };

  const dataSetters = {
    avgServicesPerShift: setAvgServicesPerShift,
    avgPricePerService: setAvgPricePerService,
    technicianSharePercent: setTechnicianSharePercent,
    avgSuppliesCostPerService: setAvgSuppliesCostPerService,
    avgServiceTipPercent: setAvgServiceTipPercent,
    w2HourlyWage: setW2HourlyWage,
    hoursPerWeek: setHoursPerWeek,
    budgetSupplementalCosts: setBudgetSupplementalCosts,
    budgetOperatingCosts: setBudgetOperatingCosts,
    monthlyRentPerTech: setMonthlyRentPerTech,
    // New operational parameters
    timeFrame: setTimeFrame,
    wageModel: setWageModel,
    employmentType: setEmploymentType,
    targetUtilizationRate: setTargetUtilizationRate,
    numTechnicians: setNumTechnicians,
    operationHours: setOperationHours,
    daysOpenPerMonth: setDaysOpenPerMonth,
    daysOpenPerWeek: setDaysOpenPerWeek,
  // appointmentsPerTechPerDay is not settable independently
    avgAppointmentDuration: setAvgAppointmentDuration,
    // Employee Taxes and Expenses (W2 Employer Burden)
    socialSecurityRate: setSocialSecurityRate,
    medicareRate: setMedicareRate,
    futaRate: setFutaRate,
    sutaRate: setSutaRate,
    ettRate: setEttRate,
    workersCompRate: setWorkersCompRate,
    paidSickLeaveRate: setPaidSickLeaveRate
    // Note: Employer optional benefits removed
  };

  const saveLoadManager = useSaveLoadManager(
    'nailsalon_w2vs1099_',
    dataGetters,
    dataSetters,
    exportW2vs1099Data
  );

  // Calculate daily and annual values
  const dailyRevenue = getNumericValue(avgServicesPerShift) * getNumericValue(avgPricePerService);
  const dailyTechnicianCommission = dailyRevenue * (getNumericValue(technicianSharePercent) / 100);
  
  // Different tip calculations for different models
  const dailyTipsCommission = dailyTechnicianCommission * (getNumericValue(avgServiceTipPercent) / 100); // For Models 1A, 1B
  const dailyTipsFullRevenue = dailyRevenue * (getNumericValue(avgServiceTipPercent) / 100); // For Model 2
  const dailyTipsW2NoCommission = dailyRevenue * (getNumericValue(avgServiceTipPercent) / 100); // For Model 3 (configurable tip % of total service cost)
  
  // Annual calculations (using user input for days open per month)
  const workingDaysPerYear = getNumericValue(daysOpenPerMonth) * 12;
  // Use hoursPerWeek state variable in all calculations. Do not reassign it.
  // Fix: Employer revenue should be only service revenue (no tips)
  const annualRevenue = dailyRevenue * workingDaysPerYear;
  const annualW2Wage = getNumericValue(w2HourlyWage) * getNumericValue(hoursPerWeek) * 52;
  // Minimum wage from selected locality
  const caMinWage = selectedMinWage;
  const minWageAnnual = caMinWage * getNumericValue(hoursPerWeek) * 52;
  const actualW2Pay = Math.max(annualW2Wage, minWageAnnual);
  //alert(` hours/week ${hoursPerWeek}`);

  // Tax calculations for each model
  const calculateTaxes = (income, isEmployee = true) => {
    try {
      const numericIncome = getNumericValue(income, 0);
      if (numericIncome < 0) return { socialSecurity: 0, medicare: 0, liabilityInsurance: 0, total: 0 };
      
      const socialSecurityRate = isEmployee ? 6.20 : 12.40;
      const medicareRate = isEmployee ? 1.45 : 2.90;
      const socialSecurityCap = 176100; // 2025 cap
      
      const socialSecurity = Math.min(numericIncome, socialSecurityCap) * (socialSecurityRate / 100);
      const medicare = numericIncome * (medicareRate / 100);
      const liabilityInsurance = isEmployee ? 0 : numericIncome * 0.03; // 3% for 1099
      
      return {
        socialSecurity: socialSecurity || 0,
        medicare: medicare || 0,
        liabilityInsurance: liabilityInsurance || 0,
        total: (socialSecurity + medicare + liabilityInsurance) || 0
      };
    } catch (error) {
      console.error('Error calculating taxes:', error);
      return { socialSecurity: 0, medicare: 0, liabilityInsurance: 0, total: 0 };
    }
  };
  
  // Note: Additional employer benefits removed - only mandatory payroll taxes are calculated
  const calculateAdditionalEmployerCosts = (wages, numEmployees = 1) => {
    // Return zero values since we removed all optional benefits
    return {
      liabilityInsurance: 0,
      healthInsurance: 0,
      dentalVisionInsurance: 0,
      match401k: 0,
      bonuses: 0,
      trainingCosts: 0,
      total: 0
    };
  };

  // Calculate employer burden for W2 (mandatory taxes)
  const calculateEmployerBurden = (wages) => {
    try {
      const numericWages = getNumericValue(wages, 0);
      if (numericWages < 0) return { socialSecurityEmployer: 0, medicareEmployer: 0, futa: 0, suta: 0, ett: 0, workersComp: 0, paidSickLeave: 0, total: 0 };
      
      const socialSecurityEmployer = Math.min(numericWages, 176100) * (getNumericValue(socialSecurityRate) / 100);
      const medicareEmployer = numericWages * (getNumericValue(medicareRate) / 100);
      const futa = Math.min(numericWages, 7000) * (getNumericValue(futaRate) / 100); // Federal unemployment
      const suta = Math.min(numericWages, 7000) * (getNumericValue(sutaRate) / 100); // State unemployment
      const ett = Math.min(numericWages, 7000) * (getNumericValue(ettRate) / 100); // Employment training tax
      const workersComp = numericWages * (getNumericValue(workersCompRate) / 100); // Workers compensation
      const paidSickLeave = numericWages * (getNumericValue(paidSickLeaveRate) / 100); // Paid sick leave
      
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

  // Model 1A: Commission W2 - Tips are 30% of commission amount
  const model1A_income_single = (dailyTechnicianCommission + dailyTipsCommission) * workingDaysPerYear;
  // aggregated total not needed for employee-level displays; use per-technician values instead
  const model1A_taxes = calculateTaxes(model1A_income_single, true);
  // per-technician net pay and aggregated net pay for all technicians
  const model1A_netPay_single = model1A_income_single - model1A_taxes.total;
  //const model1A_netPay = model1A_netPay_single * getNumericValue(numTechnicians);
  const model1A_employerBurden = calculateEmployerBurden(Math.max(model1A_income_single, minWageAnnual))
  const model1A_additionalCosts = calculateAdditionalEmployerCosts(Math.max(model1A_income_single, minWageAnnual), 1);
  // Monthly employer expenses from Budget Tool (supplemental + operating costs)
  const annualServices = getNumericValue(avgServicesPerShift) * workingDaysPerYear * getNumericValue(numTechnicians);
  const model1A_monthlyEmployerExpenses = getNumericValue(budgetSupplementalCosts) + getNumericValue(budgetOperatingCosts);
  const model1A_annualEmployerExpenses = model1A_monthlyEmployerExpenses * 12;
  // Only multiply income, taxes, and burden by numTechnicians, not employer expenses
  // Remove minimum wage condition
  //const model1A_totalEmployerCost = (Math.max(model1A_income_single, minWageAnnual) + model1A_employerBurden.total + model1A_additionalCosts.total) * getNumericValue(numTechnicians) + model1A_annualEmployerExpenses;
  const model1A_totalEmployerCost = (model1A_income_single + model1A_employerBurden.total + model1A_additionalCosts.total) * getNumericValue(numTechnicians) + model1A_annualEmployerExpenses;
  try {
    localStorage.setItem('model1A_totalEmployerCost', model1A_totalEmployerCost.toString());
  } catch (e) { /* ignore */ }

  // Model 1B: Commission 1099 - Tips are 30% of commission amount
  const model1B_income_single = (dailyTechnicianCommission + dailyTipsCommission) * workingDaysPerYear;
  const model1B_income = model1B_income_single * getNumericValue(numTechnicians);
  const model1B_taxes = calculateTaxes(model1B_income_single, false);
  const model1B_netPay_single = model1B_income_single - model1B_taxes.total;
  //const model1B_netPay = model1B_netPay_single * getNumericValue(numTechnicians);
  const model1B_monthlyEmployerExpenses = getNumericValue(budgetSupplementalCosts) + getNumericValue(budgetOperatingCosts);
  const model1B_annualEmployerExpenses = model1B_monthlyEmployerExpenses * 12;
  const model1B_suppliesCost = getNumericValue(avgSuppliesCostPerService) * getNumericValue(avgServicesPerShift) * workingDaysPerYear * getNumericValue(numTechnicians); // Supplies cost is employer's expense for commission 1099
  const model1B_variableBurden = model1B_annualEmployerExpenses + model1B_suppliesCost;
  const model1B_totalEmployerCost = model1B_income + model1B_variableBurden;
  try {
    localStorage.setItem('model1B_totalEmployerCost', model1B_totalEmployerCost.toString());
  } catch (e) { /* ignore */ }
  
  // Model 2: Independent Contractor 1099 - Takes 100% of earnings plus tips (Booth Rental)
  // Uses the actual values from business parameters (now always available)
  const model2_suppliesCost_single = getNumericValue(avgSuppliesCostPerService) * getNumericValue(avgServicesPerShift) * workingDaysPerYear;
  const model2_boothRentalCost_single = getNumericValue(monthlyRentPerTech) * 12;
  const model2_grossIncome_single = (dailyRevenue + dailyTipsFullRevenue) * workingDaysPerYear;
  const model2_income_single = model2_grossIncome_single - model2_suppliesCost_single - model2_boothRentalCost_single;
  // Define total values for use in JSX (for all technicians)
  const model2_suppliesCost = model2_suppliesCost_single * getNumericValue(numTechnicians);
  const model2_boothRentalCost = model2_boothRentalCost_single * getNumericValue(numTechnicians);
  // aggregated totals not required for employee-level displays; use per-technician values instead
  const model2_taxes = calculateTaxes(model2_income_single, false);
  const model2_netPay_single = model2_income_single - model2_taxes.total;
  const model2_netPay = model2_netPay_single * getNumericValue(numTechnicians);
  const model2_monthlyEmployerExpenses = getNumericValue(budgetSupplementalCosts) + getNumericValue(budgetOperatingCosts);
  const model2_annualEmployerExpenses = model2_monthlyEmployerExpenses * 12;
  const model2_variableBurden = model2_annualEmployerExpenses;
  const model2_totalEmployerCost = model2_variableBurden;
  try {
    localStorage.setItem('model2_totalEmployerCost', model2_totalEmployerCost.toString());
  } catch (e) { /* ignore */ }
  
  const model2_employerRevenue = getNumericValue(monthlyRentPerTech) * 12 * getNumericValue(numTechnicians); // Rent revenue only

  // Model 3: No Commission W2 - Tips are 20% of total service cost
  const model3_income_single = actualW2Pay + (dailyTipsW2NoCommission * workingDaysPerYear);
  // aggregated totals not required for employee-level displays; use per-technician values instead
  const model3_taxes = calculateTaxes(model3_income_single, true);
  const model3_netPay_single = model3_income_single - model3_taxes.total;
  //const model3_netPay = model3_netPay_single * getNumericValue(numTechnicians);
  const model3_employerBurden = calculateEmployerBurden(actualW2Pay);
  const model3_additionalCosts = calculateAdditionalEmployerCosts(actualW2Pay, 1);
  const model3_monthlyEmployerExpenses = getNumericValue(budgetSupplementalCosts) + getNumericValue(budgetOperatingCosts);
  const model3_annualEmployerExpenses = model3_monthlyEmployerExpenses * 12;
  const model3_totalEmployerCost = (actualW2Pay + model3_employerBurden.total + model3_additionalCosts.total) * getNumericValue(numTechnicians) + model3_annualEmployerExpenses;
  try {
    localStorage.setItem('model3_totalEmployerCost', model3_totalEmployerCost.toString());
  } catch (e) { /* ignore */ }
  
  // Calculate employer profits
  const employerRevenue = annualRevenue * getNumericValue(numTechnicians);
  // Save employerRevenue to localStorage for Tab 2 (Break Even Model)
  try {
    localStorage.setItem('employerRevenue', employerRevenue.toString());
  } catch (e) { /* ignore */ }
  const model1A_profit = employerRevenue - model1A_totalEmployerCost;
  const model1B_profit = employerRevenue - model1B_totalEmployerCost;
  const model2_profit = model2_employerRevenue - model2_totalEmployerCost;
  const model3_profit = employerRevenue - model3_totalEmployerCost;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>{t.w2vs1099.title}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={resetAllFields}
            style={{
              padding: '8px 28px',
              minWidth: '180px',
              whiteSpace: 'nowrap',
              backgroundColor: '#ffe5e5',
              color: '#dc3545',
              border: '1px solid #dc3545',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            title={t.w2vs1099.resetToDefaultTooltip || 'Reset To Default'}
          >
            ♻️ {t.w2vs1099.resetToDefault || 'Reset To Default'}
          </button>
          <button
            onClick={toggleAllSections}
            style={{
              padding: '8px 16px',
              backgroundColor: areAllSectionsExpanded ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            title={areAllSectionsExpanded ? (t.w2vs1099.collapseAllSections || 'Collapse All Sections') : (t.w2vs1099.expandAllSections || 'Mở rộng tất cả')}
          >
            {areAllSectionsExpanded ? (t.w2vs1099.collapseAllLabel || '📁 Collapse All Sections') : (t.w2vs1099.expandAllLabel || '📂 Mở rộng tất cả')}
          </button>
        </div>
      </div>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '20px' }}>
        {t.w2vs1099.description}
      </p>

      {/* Minimum Wage Selector */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          onClick={() => toggleSection('minWageSection')}
          style={{ 
            color: '#17a2b8', 
            borderBottom: '2px solid #17a2b8',
            paddingBottom: '10px',
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <span>💰 Minimum Wage Selection</span>
          <span style={{ fontSize: '16px' }}>{sectionsExpanded.minWageSection ? '▼' : '▶'}</span>
        </h3>
        
        {sectionsExpanded.minWageSection && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '8px', 
          border: '2px solid #17a2b8' 
        }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr auto 1fr auto', 
          alignItems: 'center',
          gap: '15px',
          fontSize: '14px'
        }}>
          <label style={{ fontWeight: 'bold' }}>Year:</label>
          <select 
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              // Reset to first locality when year changes
              const firstLocality = minWageData.data[e.target.value]?.[0]?.city || '';
              setSelectedLocality(firstLocality);
            }}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '100px'
            }}
          >
            {Object.keys(minWageData.data).sort((a, b) => b - a).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <label style={{ fontWeight: 'bold' }}>Locality:</label>
          <div style={{ position: 'relative', minWidth: '400px' }}>
            <input
              type="text"
              value={localitySearchTerm || selectedLocality}
              onChange={(e) => {
                setLocalitySearchTerm(e.target.value);
                setIsLocalityDropdownOpen(true);
              }}
              onFocus={() => setIsLocalityDropdownOpen(true)}
              placeholder="Search locality..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            {isLocalityDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '400px',
                overflowY: 'auto',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '2px',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {minWageData.data[selectedYear]
                  ?.filter(loc => 
                    loc.city.toLowerCase().includes((localitySearchTerm || '').toLowerCase())
                  )
                  .map((loc, idx) => {
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedLocality(loc.city);
                          setLocalitySearchTerm('');
                          setIsLocalityDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          backgroundColor: selectedLocality === loc.city ? '#e7f3ff' : 'white',
                          borderBottom: '1px solid #eee'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedLocality === loc.city ? '#e7f3ff' : 'white'}
                      >
                        <div style={{ fontWeight: 'bold' }}>{loc.city}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          ${loc.minimumWage}/hour
                          {loc.smallEmployerRate && ` | Small Employer: $${loc.smallEmployerRate}/hour`}
                        </div>
                        {loc.notes && (
                          <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>
                            {loc.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            color: '#17a2b8',
            padding: '8px 16px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '2px solid #17a2b8'
          }}>
            ${selectedMinWage}/hour
          </div>
        </div>
        
        {/* Small Employer Checkbox - Always visible section */}
        <div style={{ 
          marginTop: '15px', 
          padding: '12px', 
          backgroundColor: (() => {
            const yearData = minWageData.data[selectedYear];
            const locality = yearData?.find(loc => loc.city === selectedLocality);
            return locality?.smallEmployerRate ? '#fff9e6' : '#f0f0f0';
          })(), 
          borderRadius: '4px',
          border: (() => {
            const yearData = minWageData.data[selectedYear];
            const locality = yearData?.find(loc => loc.city === selectedLocality);
            return locality?.smallEmployerRate ? '2px solid #ffc107' : '1px solid #ccc';
          })()
        }}>
          {(() => {
            const yearData = minWageData.data[selectedYear];
            const locality = yearData?.find(loc => loc.city === selectedLocality);
            
            if (locality?.smallEmployerRate) {
              return (
                <>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#856404'
                  }}>
                    <input
                      type="checkbox"
                      checked={useSmallEmployerRate}
                      onChange={(e) => setUseSmallEmployerRate(e.target.checked)}
                      style={{ 
                        width: '18px', 
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    Use Small Employer Rate (${locality.smallEmployerRate}/hour)
                  </label>
                  <div style={{ 
                    marginTop: '5px', 
                    fontSize: '12px', 
                    color: '#856404',
                    marginLeft: '26px'
                  }}>
                    {locality.notes || 'Small employer rates typically apply to businesses with 25 or fewer employees.'}
                  </div>
                </>
              );
            } else {
              return (
                <div style={{ 
                  fontSize: '13px', 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  ℹ️ This locality does not have a separate small employer rate. Cities with small employer rates: Hayward, Novato, Sonoma.
                </div>
              );
            }
          })()}
        </div>
        
        {(() => {
          const yearData = minWageData.data[selectedYear];
          const locality = yearData?.find(loc => loc.city === selectedLocality);
          return locality?.notes && !locality?.smallEmployerRate && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: '#fff3cd', 
              borderRadius: '4px',
              fontSize: '12px',
              color: '#856404'
            }}>
              ℹ️ {locality.notes}
            </div>
          );
        })()}
        
        {/* Min Wage Data Upload/Download Tool */}
        <MinWageUploader 
          currentMinWageData={minWageData}
          onMinWageDataLoaded={handleMinWageDataLoaded}
        />
        </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isLocalityDropdownOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => {
            setIsLocalityDropdownOpen(false);
            setLocalitySearchTerm('');
          }}
        />
      )}

      {/* Analysis Configuration Section - Moved to top */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          onClick={() => toggleSection('businessModel')}
          style={{ 
            color: '#17a2b8', 
            borderBottom: '2px solid #17a2b8', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>⚙️ {t.w2vs1099.analysisConfiguration || 'Analysis Configuration'}</span>
          <span style={{ fontSize: '16px' }}>{sectionsExpanded.businessModel ? '▼' : '▶'}</span>
        </h3>
        
        {sectionsExpanded.businessModel && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '2px solid #dc3545', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#721c24' }}>💼 {t.w2vs1099.businessModelConfiguration || 'Business Model Configuration'}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '14px', flexWrap: 'wrap' }}>
              <label style={{ minWidth: '100px', fontWeight: 'bold' }}>{t.w2vs1099.employment || 'Employment'}:</label>
              <select 
                value={employmentType} 
                onChange={e => {
                  setEmploymentType(e.target.value);
                  // Reset payment model when employment type changes
                  if (e.target.value === 'W2') {
                    setWageModel('Commission'); // Default to Commission for W2
                  } else {
                    setWageModel('Commission'); // Default to Commission for 1099 too
                  }
                }}
                style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '120px' }}
              >
                <option value="W2">W2 Employee</option>
                <option value="1099">1099 Contractor</option>
              </select>

              <label style={{ minWidth: '110px', fontWeight: 'bold' }}>{t.w2vs1099.paymentModel || 'Payment Model'}:</label>
              <select 
                value={wageModel} 
                onChange={e => setWageModel(e.target.value)}
                style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '140px' }}
              >
                <option value="Commission">Commission</option>
                {employmentType === 'W2' && <option value="Hourly">No Commission</option>}
                {employmentType === '1099' && <option value="Hourly">Booth Rental</option>}
              </select>

              <label style={{ minWidth: '120px', fontWeight: 'bold' }}>{t.w2vs1099.targetUtilization || 'Target Utilization'}:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  type="number" 
                  value={targetUtilizationRate} 
                  onChange={createNumericHandler(setTargetUtilizationRate)}
                  style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px', width: '60px' }}
                />
                <span>%</span>
              </div>
            </div>
          </div>
  )}
      </div>

      {/* Business Parameters Section */}
      <div style={{ marginBottom: '30px'}}>
        <h3 
          onClick={() => toggleSection('businessParams')}
          style={{ 
            color: '#be3f04ff', 
            borderBottom: '2px solid #9b4e05ff', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{t.w2vs1099.businessParameters || 'Thông số kinh doanh'}</span>
          <span style={{ fontSize: '16px' }}>{sectionsExpanded.businessParams ? '▼' : '▶'}</span>
        </h3>
        
        {sectionsExpanded.businessParams && (
          <div className="business-params-grid">
          <div className="business-params-column">
            <label>{t.w2vs1099.avgW2HourlyWage}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>$</span>
              <input 
                {...createDecimalInputProps(w2HourlyWage, setW2HourlyWage, { style: { width: '100px' } })}
              />
            </div>
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>{t.w2vs1099.avgServicesPerShift}</label>
            <input 
              type="number" 
              value={avgServicesPerShift} 
              onChange={createNumericHandler(setAvgServicesPerShift)}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
            />
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>{t.w2vs1099.avgPricePerService}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>$</span>
              <input 
                {...createDecimalInputProps(avgPricePerService, setAvgPricePerService, { style: { width: '100px' } })}
              />
            </div>
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>{t.w2vs1099.technicianShare}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                {...createDecimalInputProps(technicianSharePercent, setTechnicianSharePercent, { style: { width: '80px' } })}
                title="Only when Payment Model = Commission."
              />
              <span>%</span>
            </div>
            
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>{t.w2vs1099.avgServiceTipPercent}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                {...createDecimalInputProps(avgServiceTipPercent, setAvgServiceTipPercent, { style: { width: '80px' } })}
              />
              <span>%</span>
            </div>
          </div>
          
          <div className="business-params-column">
            <label style={{ fontWeight: 'bold', textAlign: 'right' }}>{t.w2vs1099.hoursPerWeek}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                {...createDecimalInputProps(hoursPerWeek, setHoursPerWeek, { style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }                         
                        })}
              />
            </div>
            

            
            <div style={{ textAlign: 'right' }}>
              <label style={{ fontWeight: 'bold' }}>{t.w2vs1099.avgSuppliesCostPerService}</label>
              <br />
              <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
                (Employee pays for 1099 only)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>$</span>
              <input 
                {...createDecimalInputProps(avgSuppliesCostPerService, setAvgSuppliesCostPerService, { style: { width: '100px' } })}
              />
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <label style={{ fontWeight: 'bold' }}>{t.w2vs1099.monthlyRentPerTech}</label>
              <br />
              <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
                (Employee pays for 1099 only)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>$</span>
              <input 
                {...createDecimalInputProps(monthlyRentPerTech, setMonthlyRentPerTech, { style: { width: '100px' } })}
              />
              <span>/month</span>
            </div>
          </div>
        </div>
        )}
      </div>



      {/* Operational Efficiency Parameters */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          onClick={() => toggleSection('operationalEfficiency')}
          style={{ 
            color: '#007bff', 
            borderBottom: '2px solid #007bff', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>📊 {t.w2vs1099.operationalEfficiencyParameters || 'Thông số hiệu quả vận hành'}</span>
          <span style={{ fontSize: '16px' }}>{sectionsExpanded.operationalEfficiency ? '▼' : '▶'}</span>
        </h3>

        {sectionsExpanded.operationalEfficiency && (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Left Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '15px', alignItems: 'center' }}>
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Number of Technicians:</label>
              <input 
                type="number" 
                value={numTechnicians} 
                onChange={createNumericHandler(setNumTechnicians)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
              />
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Operation Hours per Day:</label>
              <input 
                type="number" 
                value={operationHours} 
                onChange={createNumericHandler(setOperationHours)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
              />
              
              {(
                <>
                  <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Days Open per Month:</label>
                  <input 
                    {...createDecimalInputProps(daysOpenPerMonth, () => {}, { style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px', backgroundColor: '#f0f0f0' }, min: 0, max: 31 })}
                    value={Number(getNumericValue(daysOpenPerMonth)).toFixed(2)}
                    readOnly
                    title="Days Open per Month: computed from Hours per Week"
                  />
                </>
              )}
            </div>
            
            {/* Right Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '15px', alignItems: 'center' }}>
              <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <label style={{ textAlign: 'right', fontWeight: 'bold', minWidth: 180 }}>Avg Appointment Duration:</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={avgAppointmentDuration} 
                  onChange={createNumericHandler(setAvgAppointmentDuration,true)}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>hours</span>
              </div>
              <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <label style={{ textAlign: 'right', fontWeight: 'bold', minWidth: 180 }}>Appointments per Tech per Day:</label>
                <input 
                  type="number" 
                  value={appointmentsPerTechPerDay} 
                  readOnly
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px', backgroundColor: '#f0f0f0' }}
                  title="This value comes from Avg Services Per Shift:"
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '6px', border: '1px solid #b8daff' }}>
            <h5 style={{ margin: '0 0 10px 0', color: '#004085', fontSize: '14px' }}>
              📋 These parameters will be used for break-even analysis in Tab 2
            </h5>
            <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
              All operational efficiency settings configured here will automatically flow to the Break-Even Analysis tab for consistent calculations.
            </p>
          </div>
          </div>
        )}
        

      </div>

      {/* Employee Taxes and Expenses Parameters */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          style={{ 
            color: '#dc3545', 
            borderBottom: '2px solid #dc3545', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('employeeTaxes')}
        >
          {/* Always show English by default, Vietnamese if selected */}
          🏢 {language === 'vi' ? (t.w2vs1099.employeePayrollTaxes || 'Employee Payroll Taxes (Mandatory):') : 'Employee Payroll Taxes (Mandatory):'}
          <span style={{ fontSize: '16px' }}>
            {sectionsExpanded.employeeTaxes ? '▼' : '▶'}
          </span>
        </h3>
        
        {sectionsExpanded.employeeTaxes && (
        
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Left Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="Social Security Rate (Employer Portion): The employer's contribution to Social Security. For 2025, the rate is 6.2% on wages up to $176,100. This matches the employee's contribution, totaling 12.4% combined.">
                  Social Security Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(socialSecurityRate, setSocialSecurityRate, { min: 0, max: 20, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="Medicare Rate (Employer Portion): The employer's contribution to Medicare. For 2025, the rate is 1.45% on all wages with no cap. This matches the employee's contribution, totaling 2.9% combined.">
                  Medicare Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(medicareRate, setMedicareRate, { min: 0, max: 10, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="FUTA Rate (Federal Unemployment Tax): Federal unemployment insurance tax paid by employers. For 2025, the rate is 1.5% on the first $7,000 of each employee's wages. This provides benefits for unemployed workers.">
                  FUTA Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(futaRate, setFutaRate, { min: 0, max: 10, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="SUTA Rate (State Unemployment Tax): California state unemployment insurance tax paid by employers. The rate varies by employer experience but averages 3.4% on the first $7,000 of each employee's wages. This provides state unemployment benefits.">
                  SUTA Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(sutaRate, setSutaRate, { min: 0, max: 10, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
            </div>
            
            {/* Right Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="ETT Rate (Employment Training Tax): California Employment Training Tax used to fund job training programs. The rate is 0.1% on the first $7,000 of each employee's wages. This supports workforce development programs.">
                  ETT Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(ettRate, setEttRate, { min: 0, max: 5, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="Workers' Compensation Rate: Insurance to cover work-related injuries and illnesses. Rates vary by industry and risk level. For nail salons, the rate is typically around 3% of total wages. This protects both employees and employers from workplace injury costs.">
                  Workers Comp Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(workersCompRate, setWorkersCompRate, { min: 0, max: 20, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
              
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <Tooltip text="Paid Sick Leave Rate: California requires employers to provide paid sick leave. The rate is approximately 2.15% of wages to cover the cost of accrued paid sick time. This ensures employees can take time off when ill without losing pay.">
                  Paid Sick Leave Rate:
                </Tooltip>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input 
                  {...createDecimalInputProps(paidSickLeaveRate, setPaidSickLeaveRate, { min: 0, max: 10, style: { width: '100px' } })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>%</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
            <h5 style={{ margin: '0 0 8px 0', color: '#856404', fontSize: '14px' }}>
              📋 These rates apply only to W2 employees
            </h5>
            <p style={{ margin: '0', fontSize: '12px', color: '#856404' }}>
              Default values reflect current California tax rates. Adjust rates as needed for your state or business requirements.
              These rates are used in all W2 employer burden calculations and will automatically update Tab 2 break-even analysis.
            </p>
          </div>
        </div>
        )}
      </div>

      {/* Employer Payroll Taxes */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          style={{ 
            color: '#6f42c1', 
            borderBottom: '2px solid #6f42c1', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('employerBenefits')}
        >
          🏢 {t.w2vs1099.employerPayrollTaxes || 'Thuế bảng lương chủ doanh nghiệp (Bắt buộc)'}
          <span style={{ fontSize: '16px' }}>
            {sectionsExpanded.employerBenefits ? '▼' : '▶'}
          </span>
        </h3>
        
        {sectionsExpanded.employerBenefits && (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '6px', border: '1px solid #b8daff' }}>
            <h5 style={{ margin: '0 0 8px 0', color: '#004085', fontSize: '14px' }}>
              📊 Payroll Tax Rates (Editable)
            </h5>
            <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
              These are mandatory employer payroll tax rates. You can update these values if rates change over time. 
              The total payroll tax burden is calculated and displayed in the "Employer Burden" section of the results.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Federal Taxes Column */}
            <div>
              <h5 style={{ color: '#6f42c1', marginBottom: '15px' }}>Federal Taxes:</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
                
                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Social Security Employer: Federal payroll tax for social security benefits. Applies to wages up to $176,100 (2025 limit). Both employer and employee pay this rate.">
                    Social Security:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="15"
                    value={socialSecurityRate} 
                    onChange={createNumericHandler(setSocialSecurityRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>% (up to $176,100)</span>
                </div>

                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Medicare Employer: Federal payroll tax for Medicare benefits. Applies to all wages with no cap. Both employer and employee pay this rate.">
                    Medicare:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="5"
                    value={medicareRate} 
                    onChange={createNumericHandler(setMedicareRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>%</span>
                </div>

                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Federal Unemployment (FUTA): Federal unemployment insurance tax paid by employer only. Applies to first $7,000 of each employee's wages per year.">
                    FUTA:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    value={futaRate} 
                    onChange={createNumericHandler(setFutaRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>% (up to $7,000)</span>
                </div>
              </div>
            </div>
            
            {/* State Taxes Column */}
            <div>
              <h5 style={{ color: '#6f42c1', marginBottom: '15px' }}>State Taxes (California):</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '15px', alignItems: 'center' }}>
                
                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="State Unemployment (SUTA): California state unemployment insurance tax paid by employer. Applies to first $7,000 of each employee's wages per year.">
                    SUTA:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    value={sutaRate} 
                    onChange={createNumericHandler(setSutaRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>% (up to $7,000)</span>
                </div>

                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Employment Training Tax (ETT): California tax to fund employment training programs. Applies to first $7,000 of each employee's wages per year.">
                    ETT:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={ettRate} 
                    onChange={createNumericHandler(setEttRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>% (up to $7,000)</span>
                </div>

                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Workers Compensation: California workers compensation insurance to cover workplace injuries. Rate varies by industry classification but typically 1-5% of payroll.">
                    Workers Comp:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    value={workersCompRate} 
                    onChange={createNumericHandler(setWorkersCompRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>%</span>
                </div>

                <label style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <Tooltip text="Paid Sick Leave: California paid sick leave tax to fund state sick leave benefits for employees. Applies to all wages with no cap.">
                    Paid Sick Leave:
                  </Tooltip>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="5"
                    value={paidSickLeaveRate} 
                    onChange={createNumericHandler(setPaidSickLeaveRate)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Employer Expenses Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 
          style={{ 
            color: '#28a745', 
            borderBottom: '2px solid #28a745', 
            paddingBottom: '10px', 
            marginBottom: '20px',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => toggleSection('employerExpenses')}
        >
          {t.w2vs1099.employerExpensesFromBudgetTool}
          <span style={{ fontSize: '16px' }}>
            {sectionsExpanded.employerExpenses ? '▼' : '▶'}
          </span>
        </h3>
        
        {sectionsExpanded.employerExpenses && (
        
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t.w2vs1099.monthlySupplementalCosts}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px', border: '1px solid #28a745' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  <Tooltip text={`Monthly Supplemental Costs from Budget Tool (Tab 3):
This includes marketing, training, insurance, and other business supplemental expenses calculated in the Budget Tool's Supplemental Costs section.

Data Source: Budget Tool → Supplemental Costs Tab → Total Monthly Costs
Value: ${formatCurrency(budgetSupplementalCosts)} per month

Click on the Budget Tool tab to view and modify these costs.`}>
                    {formatCurrency(budgetSupplementalCosts)}
                  </Tooltip>
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>/month</span>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                📊 Data from Budget Tool - Supplemental Costs
              </p>
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{t.w2vs1099.monthlyOperatingCosts}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px', border: '1px solid #28a745' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  <Tooltip text={`Monthly Operating Costs from Budget Tool (Tab 3):
This includes rent, utilities, equipment, supplies, and other operational expenses calculated in the Budget Tool's Operating Costs section.

Data Source: Budget Tool → Operating Costs Tab → Total Annual Costs ÷ 12
Value: ${formatCurrency(budgetOperatingCosts)} per month

Click on the Budget Tool tab to view and modify these costs.`}>
                    {formatCurrency(budgetOperatingCosts)}
                  </Tooltip>
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>/month</span>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                📊 Data from Budget Tool - Operating Costs
              </p>
            </div>
          </div>
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #b8daff' }}>
            <h5 style={{ margin: '0 0 8px 0', color: '#004085', fontSize: '14px' }}>
              🔗 Budget Tool Integration
            </h5>
            <p style={{ margin: '0', fontSize: '12px', color: '#004085' }}>
              These employer expense values are automatically imported from the Budget Tool (Tab 3). 
              To modify these costs, navigate to the Budget Tool tab and update the Supplemental Costs and Operating Costs sections. 
              Changes will automatically reflect here and in the Four Employment Model Comparison below.
            </p>
          </div>
        </div>
        )}
      </div>

      {/* Model Comparison Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ textAlign: 'center', color: '#e83e8c', marginBottom: '20px' }}>
          {t.w2vs1099.fourModelComparison}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Model 1: Commission W2 Employee */}
          <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px', border: '2px solid #dc3545' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#721c24', textAlign: 'center' }}>
              <div dangerouslySetInnerHTML={{__html: t.w2vs1099.commissionW2EmployeeSplit}} />
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.employeeIncome}</strong>
                <div>Commission: 
                  <Tooltip text={`${avgServicesPerShift} services × $${avgPricePerService} × ${technicianSharePercent}% share = $${dailyTechnicianCommission.toFixed(2)} per day (Hourly before taxes: $${(dailyTechnicianCommission / operationHours).toFixed(2)})`}>
                    ${dailyTechnicianCommission.toFixed(2)}/day 
                  </Tooltip>
                </div>
                <div>Tips: 
                  <Tooltip text={`Commission ($${dailyTechnicianCommission.toFixed(2)}) × ${getNumericValue(avgServiceTipPercent)}% tip rate = $${dailyTipsCommission.toFixed(2)} per day`}>
                    ${dailyTipsCommission.toFixed(2)}/day
                  </Tooltip>
                </div>
                <div>Daily Total: 
                  <Tooltip text={`Commission ($${dailyTechnicianCommission.toFixed(2)}) + Tips ($${dailyTipsCommission.toFixed(2)}) = $${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)} per day`}>
                    ${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)}
                  </Tooltip>
                </div>
                <div>Annual: 
                  <Tooltip text={`Daily total ($${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)}) × ${workingDaysPerYear} working days = ${formatCurrency(model1A_income_single)}`}>
                    {formatCurrency(model1A_income_single)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employeeTaxesAndExpenses}</strong>
                <div>{t.w2vs1099.socialSecurity}: 
                  <Tooltip text={`Social Security employee portion: ${formatCurrency(model1A_income_single)} × 6.2% = ${formatCurrency(model1A_taxes.socialSecurity, 0)}`}>
                    {formatCurrency(model1A_taxes.socialSecurity, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.medicare}: 
                  <Tooltip text={`Medicare employee portion: ${formatCurrency(model1A_income_single)} × 1.45% = ${formatCurrency(model1A_taxes.medicare, 0)}`}>
                    {formatCurrency(model1A_taxes.medicare, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.liabilityInsurance}: 
                  <Tooltip text="W2 employees typically covered under employer's liability insurance">
                    $0
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.totalTaxBurden}: 
                  <Tooltip text={`Total: Social Security (${formatCurrency(model1A_taxes.socialSecurity, 0)}) + Medicare (${formatCurrency(model1A_taxes.medicare, 0)}) = ${formatCurrency(model1A_taxes.total, 0)} (7.65% of income)`}>
                    {formatCurrency(model1A_taxes.total, 0)} (7.7%)
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.employeeNetTakeHome}</strong>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Annual: 
                  <Tooltip text={`Gross income (${formatCurrency(model1A_income_single)}) - Taxes (${formatCurrency(model1A_taxes.total, 0)}) = ${formatCurrency(model1A_netPay_single)} net annual pay`}>
                    {formatCurrency(model1A_netPay_single)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Hourly: 
                  <Tooltip text={`Annual net pay (${formatCurrency(model1A_netPay_single)}) ÷ (${getNumericValue(hoursPerWeek)} hours/week × 52 weeks) = ${formatCurrency(model1A_netPay_single / (getNumericValue(hoursPerWeek) * 52))} per hour`}>
                    {formatCurrency(model1A_netPay_single / (getNumericValue(hoursPerWeek) * 52))}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employerBurden} ({getNumericValue(numTechnicians)} technicians):</strong>
                <div>Payroll Taxes: 
                  <Tooltip text={`Employer portion: Social Security (${formatCurrency(model1A_income_single)} × 6.2%) + Medicare (${formatCurrency(model1A_income_single)} × 1.45%) + FUTA/SUTA ≈ ${formatCurrency(model1A_employerBurden.total, 0)}`}>
                    {formatCurrency(model1A_employerBurden.total, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.monthlyEmployerExpenses} 
                  <Tooltip text={`BUDGET TOOL EMPLOYER EXPENSES (Monthly):
• Supplemental Costs: ${formatCurrency(budgetSupplementalCosts)} (from Budget Tool - marketing, training, insurance, etc.)
• Operating Costs: ${formatCurrency(budgetOperatingCosts)} (from Budget Tool - rent, utilities, equipment, etc.)
• Total Monthly: ${formatCurrency(model1A_monthlyEmployerExpenses)}
• Annual Total: ${formatCurrency(model1A_annualEmployerExpenses)}

Data Source: Budget Tool (Tab 3) → Supplemental Costs + Operating Costs
These values automatically update when you modify costs in the Budget Tool.`}>
                    {formatCurrency(model1A_annualEmployerExpenses)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold' }}>Total Employer Cost: 
                  <Tooltip text={`Employee income (${formatCurrency(model1A_income_single)} × ${getNumericValue(numTechnicians)}) + Payroll taxes (${formatCurrency(model1A_employerBurden.total, 0)} × ${getNumericValue(numTechnicians)}) + Budget Tool expenses (${formatCurrency(model1A_annualEmployerExpenses)}) = ${formatCurrency(model1A_totalEmployerCost)} total employer cost`}>
                    {formatCurrency(model1A_totalEmployerCost)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{`Employer Revenue (${getNumericValue(numTechnicians)} technicians): `}
                  <Tooltip text={`${numTechnicians} number of employees × ${avgServicesPerShift} services × $${avgPricePerService} × ${workingDaysPerYear} working days = ${formatCurrency(employerRevenue)} annual revenue`}>
                    {formatCurrency(employerRevenue)}
                  </Tooltip>
                </strong>
                <div style={{ color: model1A_profit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  Net Profit: 
                  <Tooltip text={`Revenue (${formatCurrency(employerRevenue)}) - Total labor cost (${formatCurrency(model1A_totalEmployerCost)}) = ${formatCurrency(model1A_profit)} profit`}>
                    {formatCurrency(model1A_profit)}
                  </Tooltip>
                </div>                
              </div>
              <p style={{ fontWeight: 'bold', margin: '0', fontSize: '12px', color: '#dc3545' }}>
                <br></br>If employee wage before taxes (currently ${(dailyTechnicianCommission / operationHours).toFixed(2)}/hour) is less than minimum wage, employer should use model 2
              </p>
            </div>
          </div>

          {/* Model 2: No Commission W2 Employee */}
          <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '2px solid #0dcaf0' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#055160', textAlign: 'center' }}>
              <div dangerouslySetInnerHTML={{__html: t.w2vs1099.noCommissionW2EmployeeSplit}} />
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.employeeIncome}</strong>
                <div>Hourly: 
                  <Tooltip text={`Hourly wage: $${getNumericValue(w2HourlyWage).toFixed(2)} (California minimum wage: $${caMinWage})`}>
                    ${getNumericValue(w2HourlyWage).toFixed(2)} (min ${caMinWage})
                  </Tooltip>
                </div>
                <div>Daily Tips: 
                  <Tooltip text={`Revenue ($${dailyRevenue.toFixed(2)}) × ${getNumericValue(avgServiceTipPercent)}% tip rate = $${getNumericValue(dailyTipsW2NoCommission).toFixed(2)} per day`}>
                    ${getNumericValue(dailyTipsW2NoCommission).toFixed(2)}/day
                  </Tooltip>
                </div>
                <div>Daily Total: 
                  <Tooltip text={`Hourly wage ($${getNumericValue(w2HourlyWage).toFixed(2)} × 8 hours = $${(getNumericValue(w2HourlyWage) * 8).toFixed(2)}) + Tips ($${getNumericValue(dailyTipsW2NoCommission).toFixed(2)}) = $${(getNumericValue(w2HourlyWage) * 8 + getNumericValue(dailyTipsW2NoCommission)).toFixed(2)} per day`}>
                    ${(getNumericValue(w2HourlyWage) * 8 + getNumericValue(dailyTipsW2NoCommission)).toFixed(2)}
                  </Tooltip>
                </div>
                <div>Annual: 
                  <Tooltip text={`W2 wages ($${actualW2Pay.toFixed(0)}) + Annual tips ($${(getNumericValue(dailyTipsW2NoCommission) * workingDaysPerYear).toFixed(0)}) = ${formatCurrency(model3_income_single)} (per technician, incl. tips)`}>
                    {formatCurrency(model3_income_single)} (incl. tips)
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employeeTaxesAndExpenses}</strong>
                <div>{t.w2vs1099.socialSecurity}: 
                  <Tooltip text={`Social Security employee portion: ${formatCurrency(model3_income_single)} × 6.2% = ${formatCurrency(model3_taxes.socialSecurity, 0)}`}>
                    {formatCurrency(model3_taxes.socialSecurity, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.medicare}: 
                  <Tooltip text={`Medicare employee portion: ${formatCurrency(model3_income_single)} × 1.45% = ${formatCurrency(model3_taxes.medicare, 0)}`}>
                    {formatCurrency(model3_taxes.medicare, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.liabilityInsurance}: 
                  <Tooltip text="W2 employees typically covered under employer's liability insurance">
                    $0
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.totalTaxBurden}: 
                  <Tooltip text={`Total: Social Security (${formatCurrency(model3_taxes.socialSecurity, 0)}) + Medicare (${formatCurrency(model3_taxes.medicare, 0)}) = ${formatCurrency(model3_taxes.total, 0)} (7.65% of income)`}>
                    {formatCurrency(model3_taxes.total, 0)} (7.7%)
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.employeeNetTakeHome}</strong>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Annual: 
                  <Tooltip text={`Gross income (${formatCurrency(model3_income_single)}) - Taxes (${formatCurrency(model3_taxes.total, 0)}) = ${formatCurrency(model3_netPay_single)} net annual pay (per technician)`}>
                    {formatCurrency(model3_netPay_single)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Hourly: 
                  <Tooltip text={`Annual net pay (${formatCurrency(model3_netPay_single)}) ÷ (${getNumericValue(hoursPerWeek)} hours/week × 52 weeks) = $${(model3_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)} per hour`}>
                    {(model3_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employerBurden} ({getNumericValue(numTechnicians)} technicians):</strong>
                <div>Payroll Taxes: 
                  <Tooltip text={`Employer portion: Social Security (${formatCurrency(model3_income_single)} × 6.2%) + Medicare (${formatCurrency(model3_income_single)} × 1.45%) + FUTA/SUTA ≈ ${formatCurrency(model3_employerBurden.total, 0)}`}>
                    {formatCurrency(model3_employerBurden.total, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.monthlyEmployerExpenses} 
                  <Tooltip text={`Data from Budget Tool: Supplemental costs (${formatCurrency(budgetSupplementalCosts * 12)}/year) + Operating costs (${formatCurrency(budgetOperatingCosts * 12)}/year) = ${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)} annual employer expenses`}>
                    {formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold' }}>Total Employer Cost: 
                  <Tooltip text={`Employee income (${formatCurrency(model3_income_single)} × ${getNumericValue(numTechnicians)}) + Payroll taxes (${formatCurrency(model3_employerBurden.total, 0)} × ${getNumericValue(numTechnicians)}) + Budget Tool expenses (${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)}) = ${formatCurrency(model3_totalEmployerCost)} total employer cost for W2 employee`}>
                    {formatCurrency(model3_totalEmployerCost)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{`Employer Revenue (${getNumericValue(numTechnicians)} technicians): `}  
                  <Tooltip text={`${numTechnicians} number of employees × ${avgServicesPerShift} services × $${avgPricePerService} × ${workingDaysPerYear} working days = ${formatCurrency(employerRevenue)} annual revenue`}>
                    {formatCurrency(employerRevenue)}
                  </Tooltip>
                </strong>
                <div style={{ color: model3_profit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  Net Profit: 
                  <Tooltip text={`Revenue (${formatCurrency(employerRevenue)}) - Total labor cost (${formatCurrency(model3_totalEmployerCost)}) = ${formatCurrency(model3_profit)} profit`}>
                    {formatCurrency(model3_profit)}
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Model 3: Commission 1099 Contractor */}
          <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#155724', textAlign: 'center' }}>
              <div dangerouslySetInnerHTML={{__html: t.w2vs1099.commission1099ContractorSplit}} />
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.contractorIncome}</strong>
                <div>Commission: 
                  <Tooltip text={`${avgServicesPerShift} services × $${avgPricePerService} × ${technicianSharePercent}% share = $${dailyTechnicianCommission.toFixed(2)} per day`}>
                    ${dailyTechnicianCommission.toFixed(2)}/day
                  </Tooltip>
                </div>
                <div>Tips: 
                  <Tooltip text={`Commission ($${dailyTechnicianCommission.toFixed(2)}) × ${getNumericValue(avgServiceTipPercent)}% tip rate = $${dailyTipsCommission.toFixed(2)} per day`}>
                    ${dailyTipsCommission.toFixed(2)}/day
                  </Tooltip>
                </div>
                <div>Daily Total: 
                  <Tooltip text={`Commission ($${dailyTechnicianCommission.toFixed(2)}) + Tips ($${dailyTipsCommission.toFixed(2)}) = $${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)} per day`}>
                    ${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)}
                  </Tooltip>
                </div>
                <div>Annual: 
                  <Tooltip text={`Daily total ($${(dailyTechnicianCommission + dailyTipsCommission).toFixed(2)}) × ${workingDaysPerYear} working days = ${formatCurrency(model1B_income_single)}`}>
                    {formatCurrency(model1B_income_single)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.contractorTaxesAndExpenses}</strong>
                <div>{t.w2vs1099.socialSecurity}: 
                  <Tooltip text={`Self-employment Social Security: ${formatCurrency(model1B_income_single)} × 12.4% = ${formatCurrency(model1B_taxes.socialSecurity, 0)}`}>
                    {formatCurrency(model1B_taxes.socialSecurity, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.medicare}: 
                  <Tooltip text={`Self-employment Medicare: ${formatCurrency(model1B_income_single)} × 2.9% = ${formatCurrency(model1B_taxes.medicare, 0)}`}>
                    {formatCurrency(model1B_taxes.medicare, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.liabilityInsurance}: 
                  <Tooltip text={`Professional liability insurance for 1099 contractors: ${formatCurrency(model1B_income_single)} × 0.5% = ${formatCurrency(model1B_taxes.liabilityInsurance, 0)}`}>
                    {formatCurrency(model1B_taxes.liabilityInsurance, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.totalTaxBurden}: 
                  <Tooltip text={`Total: Social Security (${formatCurrency(model1B_taxes.socialSecurity, 0)}) + Medicare (${formatCurrency(model1B_taxes.medicare, 0)}) + Liability Insurance (${formatCurrency(model1B_taxes.liabilityInsurance, 0)}) = ${formatCurrency(model1B_taxes.total, 0)} (15.3% of income)`}>
                    {formatCurrency(model1B_taxes.total, 0)} (15.3%)
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.contractorNetTakeHome}</strong>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Annual: 
                  <Tooltip text={`Gross income (${formatCurrency(model1B_income_single)}) - Taxes (${formatCurrency(model1B_taxes.total, 0)}) = ${formatCurrency(model1B_netPay_single)} net annual pay`}>
                    {formatCurrency(model1B_netPay_single)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Hourly: 
                  <Tooltip text={`Annual net pay (${formatCurrency(model1B_netPay_single)}) ÷ (${getNumericValue(hoursPerWeek)} hours/week × 52 weeks) = $${(model1B_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)} per hour`}>
                    {(model1B_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employerBurden} ({getNumericValue(numTechnicians)} technicians):</strong>
                <div>Payroll Taxes: 
                  <Tooltip text="No payroll taxes for 1099 contractors - they are responsible for their own self-employment taxes">
                    $0
                  </Tooltip>
                </div>
                <div>Variable Costs: 
                  <Tooltip text={`Budget Tool expenses (${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)}) + Supplies: ${formatCurrency(avgSuppliesCostPerService)} per service × ${annualServices} services = ${formatCurrency(getNumericValue(avgSuppliesCostPerService) * annualServices)} (Employer pays for supplies in commission-based 1099)`}>
                    {formatCurrency(model1B_variableBurden)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold' }}>Total Labor Cost: 
                  <Tooltip text={`Contractor income (${formatCurrency(model1B_income_single)} per tech × ${getNumericValue(numTechnicians)}) + Budget Tool expenses (${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)}) + Supply costs (${formatCurrency(getNumericValue(avgSuppliesCostPerService) * annualServices)}) = ${formatCurrency(model1B_totalEmployerCost)} total employer cost`}>
                    {formatCurrency(model1B_totalEmployerCost)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{`Employer Revenue (${getNumericValue(numTechnicians)} technicians): `} 
                  <Tooltip text={`${numTechnicians} number of employees × ${avgServicesPerShift} services × $${avgPricePerService} × ${workingDaysPerYear} working days = ${formatCurrency(employerRevenue)} annual revenue`}>
                    {formatCurrency(employerRevenue)}
                  </Tooltip>
                </strong>
                <div style={{ color: model1B_profit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  Net Profit: 
                  <Tooltip text={`Revenue (${formatCurrency(employerRevenue)}) - Total labor cost (${formatCurrency(model1B_totalEmployerCost)}) = ${formatCurrency(model1B_profit)} profit`}>
                    {formatCurrency(model1B_profit)}
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Model 4: Independent Contractor (Booth Rental) */}
          <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#856404', textAlign: 'center' }}>
              <div dangerouslySetInnerHTML={{__html: t.w2vs1099.independentContractorSplit}} />
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.contractorIncome}</strong>
                <div>Revenue: 
                  <Tooltip text={`${avgServicesPerShift} services × $${avgPricePerService} = $${dailyRevenue.toFixed(2)} per day (100% of service revenue)`}>
                    ${dailyRevenue.toFixed(2)}/day (100%)
                  </Tooltip>
                </div>
                <div>Tips: 
                  <Tooltip text={`Revenue ($${dailyRevenue.toFixed(2)}) × ${getNumericValue(avgServiceTipPercent)}% tip rate = $${dailyTipsFullRevenue.toFixed(2)} per day`}>
                    ${dailyTipsFullRevenue.toFixed(2)}/day
                  </Tooltip>
                </div>
                <div>Daily Gross: 
                  <Tooltip text={`Revenue ($${dailyRevenue.toFixed(2)}) + Tips ($${dailyTipsFullRevenue.toFixed(2)}) = $${(dailyRevenue + dailyTipsFullRevenue).toFixed(2)} per day gross`}>
                    ${(dailyRevenue + dailyTipsFullRevenue).toFixed(2)}
                  </Tooltip>
                </div>
                <div>Annual Gross: 
                  <Tooltip text={`Daily gross (${(dailyRevenue + dailyTipsFullRevenue).toFixed(2)}) × ${workingDaysPerYear} working days = ${formatCurrency(model2_grossIncome_single)} annual gross income (per technician)`}>
                    {formatCurrency(model2_grossIncome_single)}
                  </Tooltip>
                </div>
                <div>Annual Net: 
                  <Tooltip text={`Gross income (${formatCurrency(model2_grossIncome_single)})
Supplies cost (${formatCurrency(model2_suppliesCost_single)})
Booth rental (${formatCurrency(model2_boothRentalCost_single)})
= ${formatCurrency(model2_income_single)} net annual income (per technician)`}>
                    {formatCurrency(model2_income_single)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.contractorTaxesAndExpenses}</strong>
                <div>{t.w2vs1099.socialSecurity}: 
                  <Tooltip text={`Self-employment Social Security: ${formatCurrency(model2_income_single)} × 12.4% = ${formatCurrency(model2_taxes.socialSecurity, 0)}`}>
                    {formatCurrency(model2_taxes.socialSecurity, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.medicare}: 
                  <Tooltip text={`Self-employment Medicare: ${formatCurrency(model2_income_single)} × 2.9% = ${formatCurrency(model2_taxes.medicare, 0)}`}>
                    {formatCurrency(model2_taxes.medicare, 0)}
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.liabilityInsurance}: 
                  <Tooltip text={`Professional liability insurance for 1099 contractors: ${formatCurrency(model2_income_single)} × 0.5% = ${formatCurrency(model2_taxes.liabilityInsurance, 0)}`}>
                    {formatCurrency(model2_taxes.liabilityInsurance, 0)}
                  </Tooltip>
                </div>
                <div>Supplies Cost: 
                  <Tooltip text={`Supplies cost paid by contractor: $${getNumericValue(avgSuppliesCostPerService).toFixed(2)} per service × ${avgServicesPerShift} services × ${workingDaysPerYear} working days × ${getNumericValue(numTechnicians)} employees = ${formatCurrency(model2_suppliesCost)} annually`}>
                    {formatCurrency(model2_suppliesCost)} annually
                  </Tooltip>
                </div>
                <div>Booth Rental: 
                  <Tooltip text={`Monthly booth rental paid by contractor: $${getNumericValue(monthlyRentPerTech)} per month × 12 months × ${getNumericValue(numTechnicians)} employees = ${formatCurrency(model2_boothRentalCost)} annually`}>
                    {formatCurrency(model2_boothRentalCost)} annually
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.totalTaxBurden}: 
                  <Tooltip text={`Tax Total: Social Security (${formatCurrency(model2_taxes.socialSecurity, 0)}) + Medicare (${formatCurrency(model2_taxes.medicare, 0)}) + Liability Insurance (${formatCurrency(model2_taxes.liabilityInsurance, 0)}) = ${formatCurrency(model2_taxes.total, 0)} (15.3% of net income)`}>
                    {formatCurrency(model2_taxes.total, 0)} (15.3%)
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{t.w2vs1099.contractorNetTakeHome}</strong>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Annual: 
                  <Tooltip text={`Net income after expenses (${formatCurrency(model2_income_single)}) - Taxes (${formatCurrency(model2_taxes.total, 0)}) = ${formatCurrency(model2_netPay_single)} net annual pay (per technician)`}>
                    {formatCurrency(model2_netPay_single)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold', color: '#28a745' }}>Hourly: 
                  <Tooltip text={`Annual net pay (${formatCurrency(model2_netPay_single)}) ÷ (${getNumericValue(hoursPerWeek)} hours/week × 52 weeks) = $${(model2_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)} per hour`}>
                    {(model2_netPay_single / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>{t.w2vs1099.employerBurden} ({getNumericValue(numTechnicians)} technicians):</strong>
                <div>Payroll Taxes: 
                  <Tooltip text="No payroll taxes for 1099 contractors - they are responsible for their own self-employment taxes">
                    $0
                  </Tooltip>
                </div>
                <div>{t.w2vs1099.monthlyEmployerExpenses} 
                  <Tooltip text={`Budget Tool expenses: Supplemental costs (${formatCurrency(budgetSupplementalCosts * 12)}/year) + Operating costs (${formatCurrency(budgetOperatingCosts * 12)}/year) = ${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)} annual expenses (not multiplied by number of employees). Supplies are paid by contractor (${formatCurrency(model2_suppliesCost)} for all employees). Booth rental (${formatCurrency(model2_boothRentalCost)} for all employees) shown as employer revenue.`}>
                    {formatCurrency(model2_variableBurden)}
                  </Tooltip>
                </div>
                <div style={{ fontWeight: 'bold' }}>Total Labor Cost: 
                  <Tooltip text={`Budget Tool expenses (${formatCurrency((budgetSupplementalCosts + budgetOperatingCosts) * 12)}) only - no contractor payments as they pay booth rental directly to salon`}>
                    {formatCurrency(model2_totalEmployerCost)}
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px' }}>
                <strong>{`Employer Revenue (${getNumericValue(numTechnicians)} technicians): `}
                  <Tooltip text={`Booth rental income: $${getNumericValue(monthlyRentPerTech)} × 12 months × ${getNumericValue(numTechnicians)} employees = ${formatCurrency(model2_employerRevenue)} annual revenue`}>
                    {formatCurrency(model2_employerRevenue)}
                  </Tooltip>
                </strong>
                <div style={{ color: model2_profit >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  Net Profit: 
                  <Tooltip text={`Booth rental revenue (${formatCurrency(model2_employerRevenue)}) - Total employer cost (${formatCurrency(model2_totalEmployerCost)}) = ${formatCurrency(model2_profit)} profit`}>
                    {formatCurrency(model2_profit)}
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Key Insights */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px', border: '1px solid #bee5eb' }}>
        <h3 style={{ color: '#0c5460', marginBottom: '15px' }}>
          {t.w2vs1099.keyInsights}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>Best Employee Income</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Model 2 (Independent Contractor) provides the highest take-home pay at $
              {(model2_netPay / (getNumericValue(hoursPerWeek) * 52)).toFixed(2)}/hour, but requires meeting 1099 compliance rules.
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>Best Employer Profit</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Model 1B (Commission 1099) provides the highest employer profit of {formatCurrency(model1B_profit)}, but carries misclassification risk.
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #b6e5f0' }}>
            <h4 style={{ color: '#0c5460', margin: '0 0 10px 0' }}>Compliance Balance</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Model 1A (Commission W2) offers the safest compliance approach while ensuring minimum wage 
              requirements are met (CA minimum: ${caMinWage}/hour).
            </p>
          </div>
        </div>
      </div>

      {/* Save/Load Data Section */}
      <SaveLoadUI 
        saveLoadManager={saveLoadManager}
        title={t.w2vs1099.saveLoadTitle}
        placeholder={t.w2vs1099.saveLoadPlaceholder}
        keyPrefix="nailsalon_w2vs1099_"
        buttonText={t.w2vs1099.saveButtonText}
      />

      {/* Legal Disclaimer */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          {t.w2vs1099.legalDisclaimer}
        </h4>
        <div style={{ fontSize: '14px', color: '#856404' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.w2vs1099.taxScheduleVerification}</strong> {t.w2vs1099.taxScheduleVerificationText}
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.w2vs1099.misclassificationPenalties}</strong> {t.w2vs1099.misclassificationPenaltiesText}
          </p>
          <p style={{ margin: '0' }}>
            <strong>{t.w2vs1099.professionalAdviceRequired}</strong> {t.w2vs1099.professionalAdviceRequiredText}
          </p>
        </div>
      </div>
    </div>
  );
}
