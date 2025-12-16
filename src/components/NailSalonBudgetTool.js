import React, { useState, useCallback } from 'react';
import TranslationUploader from './common/TranslationUploader';
import EmployeeCostCalculator from './EmployeeCostCalculator';
import SupplementalCostCalculator from './SupplementalCostCalculator';
import OperatingCost from './OperatingCost';
import RevenueStreams from './RevenueStreams';
import BudgetToolBreakEvenAnalysis from './BudgetToolBreakEvenAnalysis';
import { saveData, loadData, getAllSavedSets, deleteData } from '../utils/storage.js';
import { downloadCSV } from '../utils/exportUtils.js';
import supplementalCostsData from '../data/SupplementalCosts.js';
import { useTranslationContext } from '../contexts/TranslationContext';

export default function NailSalonBudgetTool() {
  const { translations: t, setCustomTranslations } = useTranslationContext();

  // Employee Cost Calculator state
  const [employeeType, setEmployeeType] = useState('W2');
  const [wage, setWage] = useState(15);
  const [hours, setHours] = useState(40);
  
  // Supplemental Costs state
  const [supplementalCosts, setSupplementalCosts] = useState(supplementalCostsData);
  
  // Break Even Analysis state
  const [breakEvenData, setBreakEvenData] = useState({});
  
  // Operating Costs and Revenue Streams reload triggers
  const [operatingReloadKey, setOperatingReloadKey] = useState(0);
  const [revenueReloadKey, setRevenueReloadKey] = useState(0);
  
  // Central save/load state
  const [savedSets, setSavedSets] = useState([]);
  const [setName, setSetName] = useState('');
  const [allData, setAllData] = useState({});
  // Default to the first visible tab now that Employee and Break Even tabs are hidden
  const [activeTab, setActiveTab] = useState('supplemental');
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);

  // Load saved sets on component mount
  React.useEffect(() => {
    const sets = getAllSavedSets().filter(key => key.includes('nailsalon_budgettool_'));
    setSavedSets(sets);
  }, []);

  const handleDataChange = useCallback((componentName, data) => {
    setAllData(prev => ({
      ...prev,
      [componentName]: data
    }));
    // Save supplemental costs to localStorage for W2 vs 1099 Model integration
    if (componentName === 'supplemental' && data.costs) {
      localStorage.setItem('supplementalCosts', JSON.stringify(data.costs));
    }
    // Dispatch custom event to notify other components of data changes
    window.dispatchEvent(new CustomEvent('budgetDataUpdated', {
      detail: { componentName, data }
    }));
  }, []);
  
  // Add effects to dispatch events when employee or supplemental data changes
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('budgetDataUpdated', { 
      detail: { componentName: 'employee', data: { employeeType, wage, hours } } 
    }));
  }, [employeeType, wage, hours]);
  
  React.useEffect(() => {
    // Save supplemental costs to localStorage for W2 vs 1099 Model integration
    localStorage.setItem('supplementalCosts', JSON.stringify(supplementalCosts));
    
    window.dispatchEvent(new CustomEvent('budgetDataUpdated', { 
      detail: { componentName: 'supplemental', data: { costs: supplementalCosts } } 
    }));
  }, [supplementalCosts]);

  const saveAllData = () => {
    if (!setName.trim()) {
      alert(t.common.pleaseEnterName);
      return;
    }
    
    // Get data from localStorage for components that use it
    const operatingCosts = localStorage.getItem('operatingCosts');
    const revenueStreams = localStorage.getItem('revenueStreams');
    
    const completeData = {
      employee: allData.employee || { employeeType, wage, hours },
      supplemental: { costs: supplementalCosts },
      operating: { costs: operatingCosts ? JSON.parse(operatingCosts) : [] },
      revenue: { services: revenueStreams ? JSON.parse(revenueStreams) : [] },
      breakeven: allData.breakeven || {},
      savedAt: new Date().toISOString()
    };
    
    const key = `nailsalon_budgettool_${setName}`;
    if (saveData(key, completeData)) {
      alert(t.common.allDataSavedSuccessfully);
      // Update the saved sets list immediately
      const updatedSets = getAllSavedSets().filter(key => key.includes('nailsalon_budgettool_'));
      setSavedSets(updatedSets);
      setSetName('');
    } else {
      alert('Error saving data');
    }
  };

  const loadAllData = (key) => {
    const data = loadData(key);
    if (data) {
      // Load employee data
      if (data.employee) {
        setEmployeeType(data.employee.employeeType);
        setWage(data.employee.wage);
        setHours(data.employee.hours);
        // Enhanced employee data will be handled by the EmployeeCostCalculator component
      }
      
      // Load supplemental data
      if (data.supplemental && data.supplemental.costs) {
        setSupplementalCosts(data.supplemental.costs);
        localStorage.setItem('supplementalCosts', JSON.stringify(data.supplemental.costs));
      }
      
      // Load operating costs data to localStorage
      if (data.operating && data.operating.costs) {
        localStorage.setItem('operatingCosts', JSON.stringify(data.operating.costs));
        setOperatingReloadKey(prev => prev + 1); // Force OperatingCost to reload
      }
      
      // Load revenue streams data to localStorage
      if (data.revenue && data.revenue.services) {
        localStorage.setItem('revenueStreams', JSON.stringify(data.revenue.services));
        setRevenueReloadKey(prev => prev + 1); // Force RevenueStreams to reload
      }
      
      // Load break even data
      if (data.breakeven) {
        setBreakEvenData(data.breakeven);
      }
      
      // Set all data for other components
      setAllData(data);
      
      alert('All data loaded successfully!');
    }
  };

  const deleteAllData = (key) => {
    if (deleteData(key)) {
      setSavedSets(savedSets.filter(s => s !== key));
      alert('Data deleted successfully!');
    }
  };

  const exportToExcel = (key) => {
    const data = loadData(key);
    if (!data) {
      alert(t.noDataToExport);
      return;
    }

    const fileName = key.replace('nailsalon_budgettool_', '') || 'nail-salon-data';
    
    // Create CSV content
    let csvContent = 'Nail Salon Budget Data Export\n';
    csvContent += `Exported on: ${new Date().toLocaleString()}\n`;
    csvContent += `Data Set: ${fileName}\n`;
    csvContent += `Original Save Date: ${data.savedAt ? new Date(data.savedAt).toLocaleString() : 'Unknown'}\n\n`;
    
    // Employee Data
    if (data.employee) {
      csvContent += 'EMPLOYEE COSTS\n';
      csvContent += 'Category,Value\n';
      csvContent += `Employee Type,${data.employee.employeeType}\n`;
      csvContent += `Hourly Wage,$${data.employee.wage}\n`;
      csvContent += `Hours per Week,${data.employee.hours}\n\n`;
    }
    
    // Supplemental Costs
    if (data.supplemental && data.supplemental.costs) {
      csvContent += 'SUPPLEMENTAL COSTS\n';
      csvContent += 'Item,Frequency,Cost,Annual Cost\n';
      data.supplemental.costs.forEach(cost => {
        const annualCost = cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost;
        csvContent += `"${cost.item}",${cost.frequency},$${cost.cost},$${annualCost}\n`;
      });
      csvContent += '\n';
    }
    
    // Operating Costs
    if (data.operating && data.operating.costs) {
      csvContent += 'OPERATING COSTS\n';
      csvContent += 'Category,Annual Cost\n';
      data.operating.costs.forEach(cost => {
        csvContent += `"${cost.category}",$${cost.annualCost}\n`;
      });
      csvContent += '\n';
    }
    
    // Revenue Streams
    if (data.revenue && data.revenue.services) {
      csvContent += 'REVENUE STREAMS\n';
      csvContent += 'Service,Price,Services per Week,Weekly Revenue,Annual Revenue\n';
      data.revenue.services.forEach(service => {
        const weeklyRevenue = service.price * service.count;
        const annualRevenue = weeklyRevenue * 52;
        csvContent += `"${service.name}",$${service.price},${service.count},$${weeklyRevenue},$${annualRevenue}\n`;
      });
      csvContent += '\n';
    }
    
    // Break Even Data
    if (data.breakeven) {
      csvContent += 'BREAK EVEN ANALYSIS\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Annual Costs,$${data.breakeven.totalAnnualCosts || 0}\n`;
      csvContent += `Customers per Week,${data.breakeven.customersPerWeek || 0}\n`;
      csvContent += `Number of Workers,${data.breakeven.workers || 0}\n`;
      csvContent += `Hours per Day,${data.breakeven.hoursPerDay || 0}\n`;
      csvContent += `Work Days per Year,${data.breakeven.workDaysPerYear || 0}\n\n`;
    }
    
    // Calculate totals
    let totalAnnualCosts = 0;
    let totalAnnualRevenue = 0;
    
    // Add employee costs
    if (data.employee) {
      const weeklyWage = (data.employee.wage || 0) * (data.employee.hours || 0);
      const annualWage = weeklyWage * 52;
      const employerBurden = data.employee.employeeType === 'W2' ? annualWage * 0.25 : 0;
      totalAnnualCosts += annualWage + employerBurden;
    }
    
    if (data.supplemental?.costs) {
      totalAnnualCosts += data.supplemental.costs.reduce((sum, cost) => {
        const annual = cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost;
        return sum + annual;
      }, 0);
    }
    
    if (data.operating?.costs) {
      totalAnnualCosts += data.operating.costs.reduce((sum, cost) => sum + cost.annualCost, 0);
    }
    
    if (data.revenue?.services) {
      totalAnnualRevenue = data.revenue.services.reduce((sum, service) => {
        return sum + (service.price * service.count * 52);
      }, 0);
    }
    
    csvContent += 'SUMMARY\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Annual Costs,$${totalAnnualCosts.toFixed(2)}\n`;
    csvContent += `Total Annual Revenue,$${totalAnnualRevenue.toFixed(2)}\n`;
    csvContent += `Net Profit,$${(totalAnnualRevenue - totalAnnualCosts).toFixed(2)}\n`;
    
    // Download the file
    downloadCSV(csvContent, `${fileName}-budget-export`);
  };

  const exportAllDataSets = () => {
    if (savedSets.length === 0) {
      alert(t.noSavedDataSetsToExport);
      return;
    }

    let allCsvContent = 'NAIL SALON BUDGET TOOL - ALL DATA SETS EXPORT\n';
    allCsvContent += `Exported on: ${new Date().toLocaleString()}\n`;
    allCsvContent += `Total Data Sets: ${savedSets.length}\n\n`;
    
    savedSets.forEach((key, index) => {
      const data = loadData(key);
      if (data) {
        const fileName = key.replace('nailsalon_budgettool_', '');
        allCsvContent += `========== DATA SET ${index + 1}: ${fileName.toUpperCase()} ==========\n`;
        allCsvContent += `Save Date: ${data.savedAt ? new Date(data.savedAt).toLocaleString() : 'Unknown'}\n\n`;
        
        // Add the same data format as individual export
        if (data.employee) {
          allCsvContent += 'Employee Type,' + data.employee.employeeType + '\n';
          allCsvContent += 'Hourly Wage,$' + data.employee.wage + '\n';
          allCsvContent += 'Hours per Week,' + data.employee.hours + '\n\n';
        }
        
        if (data.supplemental?.costs) {
          allCsvContent += 'SUPPLEMENTAL COSTS\n';
          data.supplemental.costs.forEach(cost => {
            const annualCost = cost.frequency === 'monthly' ? cost.cost * 12 : cost.cost;
            allCsvContent += `"${cost.item}",${cost.frequency},$${cost.cost},$${annualCost}\n`;
          });
          allCsvContent += '\n';
        }
        
        allCsvContent += '\n';
      }
    });
    
    // Download the combined file
    downloadCSV(allCsvContent, 'nail-salon-all-data-export');
  };

  // Create tabs array that updates when language changes
  // Hide 'Employee Costs' and 'Break Even Analysis' tabs per request by omitting them here
  const tabs = React.useMemo(() => [
    { id: 'supplemental', label: t.budgetTool.supplementalCosts },
    { id: 'operating', label: t.budgetTool.operatingCosts },
    { id: 'revenue', label: t.budgetTool.revenueStreams }
  ], [t]);



  return (
    <div>
      {/* Remove the h1 since it's now handled by MainAppRouter */}
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              marginRight: '5px',
              backgroundColor: activeTab === tab.id ? '#007bff' : '#f8f9fa',
              color: activeTab === tab.id ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '0 8px 8px 8px' }}>
  {tabs.find(tab => tab.id === 'employee') && activeTab === 'employee' && (
          <EmployeeCostCalculator
            employeeType={employeeType}
            setEmployeeType={setEmployeeType}
            wage={wage}
            setWage={setWage}
            hours={hours}
            setHours={setHours}
            onDataChange={handleDataChange}
          />
        )}
        
        {activeTab === 'supplemental' && (
          <SupplementalCostCalculator 
            costs={supplementalCosts}
            setCosts={setSupplementalCosts}
            onDataChange={handleDataChange}
          />
        )}
        
        {activeTab === 'operating' && (
          <OperatingCost key={operatingReloadKey} />
        )}
        
        {activeTab === 'revenue' && (
          <RevenueStreams key={revenueReloadKey} />
        )}
        
  {tabs.find(tab => tab.id === 'breakeven') && activeTab === 'breakeven' && (
          <BudgetToolBreakEvenAnalysis 
            key={`${JSON.stringify(breakEvenData)}-${employeeType}-${wage}-${hours}-${JSON.stringify(supplementalCosts)}-${JSON.stringify(allData.employee)}`}
            onDataChange={handleDataChange}
            breakEvenData={breakEvenData}
            employeeType={employeeType}
            wage={wage}
            hours={hours}
            supplementalCosts={supplementalCosts}
            enhancedEmployeeData={allData.employee}
          />
        )}
      </div>

      {/* Global Save/Load Section - Moved to Bottom */}
      <div style={{ marginTop: '30px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <div style={{ padding: '15px', borderBottom: isSaveLoadOpen ? '1px solid #ddd' : 'none' }}>
          <h3 
            onClick={() => setIsSaveLoadOpen(!isSaveLoadOpen)}
            style={{ 
              margin: 0, 
              color: '#007bff', 
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 0'
            }}
          >
            <span>Save/Load Budget Tool Data</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {isSaveLoadOpen ? t.common.hide : t.common.show}
            </span>
          </h3>
        </div>
        
        {isSaveLoadOpen && (
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter name for this budget scenario"
                value={setName}
                onChange={e => setSetName(e.target.value)}
                style={{ padding: '8px', minWidth: '300px' }}
              />
              <button 
                onClick={saveAllData}
                style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Save Budget Tool Data
              </button>
              {savedSets.length > 0 && (
                <button 
                  onClick={exportAllDataSets}
                  style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  📊 {t.common.exportAllToExcel}
                </button>
              )}
            </div>
            
            {savedSets.length > 0 && (
              <div>
                <h4 style={{ color: '#333' }}>{t.common.savedDataSets}:</h4>
                <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>
                  💡 {t.common.exportInstructions}
                </div>
                {savedSets.map(key => {
                  const savedData = loadData(key);
                  const savedDate = savedData?.savedAt ? new Date(savedData.savedAt).toLocaleDateString() : t.common.unknownDate;
                  
                  return (
                    <div key={key} style={{ margin: '5px 0', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: '200px' }}>
                        <div style={{ color: '#333' }}><strong>{key.replace('nailsalon_budgettool_', '')}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{t.common.saved} {savedDate}</div>
                      </div>
                      <button 
                        onClick={() => loadAllData(key)}
                        style={{ padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        {t.common.load}
                      </button>
                      <button 
                        onClick={() => exportToExcel(key)}
                        style={{ padding: '4px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        📊 {t.common.export}
                      </button>
                      <button 
                        onClick={() => deleteAllData(key)}
                        style={{ padding: '4px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        {t.common.delete}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legal Disclaimer */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          {t.budgetTool.legalDisclaimer}
        </h4>
        <div style={{ fontSize: '14px', color: '#856404' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.budgetTool.budgetEstimates}</strong> {t.budgetTool.budgetEstimatesText}
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>{t.budgetTool.dataAccuracy}</strong> {t.budgetTool.dataAccuracyText}
          </p>
          <p style={{ margin: '0' }}>
            <strong>{t.budgetTool.professionalAdviceRequired}</strong> {t.budgetTool.professionalAdviceRequiredText}
          </p>
        </div>
      </div>

      {/* Translation Uploader - only show on Operating Costs tab, below disclaimer */}
      {activeTab === 'operating' && (
        <div style={{ marginTop: '20px' }}>
          <TranslationUploader onTranslationsLoaded={setCustomTranslations} />
        </div>
      )}
    </div>
  );
}