import React, { useState } from 'react';
import { saveData, loadData, getAllSavedSets, deleteData } from './storage.js';
import { useTranslationContext } from '../contexts/TranslationContext';

/**
 * Custom hook for managing save/load functionality across components
 * @param {string} keyPrefix - Prefix for localStorage keys (e.g., 'nailsalon_breakeven_')
 * @param {object} dataGetters - Object containing functions that return current state values
 * @param {object} dataSetters - Object containing setter functions for state updates
 * @param {function} exportFunction - Optional function to export data to CSV
 * @returns {object} - Save/load management functions and state
 */
export const useSaveLoadManager = (keyPrefix, dataGetters, dataSetters, exportFunction = null) => {
  const { translations: t } = useTranslationContext();
  const [savedSets, setSavedSets] = useState([]);
  const [setName, setSetName] = useState('');
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);

  // Load saved sets on component mount
  React.useEffect(() => {
    const sets = getAllSavedSets().filter(key => key.includes(keyPrefix));
    setSavedSets(sets);
  }, [keyPrefix]);

  const saveAllData = () => {
    if (!setName.trim()) {
      alert(t.common.pleaseEnterName);
      return;
    }
    
    // Collect all current data
    const completeData = {};
    Object.keys(dataGetters).forEach(key => {
      completeData[key] = dataGetters[key]();
    });
    completeData.savedAt = new Date().toISOString();
    
    const storageKey = `${keyPrefix}${setName}`;
    if (saveData(storageKey, completeData)) {
      alert(t.common.allDataSavedSuccessfully);
      const updatedSets = getAllSavedSets().filter(key => key.includes(keyPrefix));
      setSavedSets(updatedSets);
      setSetName('');
    } else {
      alert('Error saving data');
    }
  };

  const loadAllData = (key) => {
    const data = loadData(key);
    if (data) {
      // Apply loaded data to setters
      Object.keys(dataSetters).forEach(key => {
        if (data[key] !== undefined && dataSetters[key]) {
          dataSetters[key](data[key]);
        }
      });
      alert(t.common.dataLoadedSuccessfully);
    }
  };

  const deleteAllData = (key) => {
    if (deleteData(key)) {
      setSavedSets(savedSets.filter(s => s !== key));
      alert(t.common.dataDeletedSuccessfully);
    }
  };

  const exportToExcel = exportFunction ? (key) => exportFunction(key, loadData) : null;

  return {
    savedSets,
    setName,
    setSetName,
    isSaveLoadOpen,
    setIsSaveLoadOpen,
    saveAllData,
    loadAllData,
    deleteAllData,
    exportToExcel
  };
};

/**
 * Common Save/Load UI Component
 * @param {object} props - Component props
 * @param {object} saveLoadManager - Result from useSaveLoadManager hook
 * @param {string} title - Title for the save/load section
 * @param {string} placeholder - Placeholder text for input
 * @param {string} keyPrefix - Prefix to remove from display names
 * @param {string} buttonText - Text for the save button
 * @returns {JSX.Element} - Save/Load UI component
 */
export const SaveLoadUI = ({ 
  saveLoadManager, 
  title = "Save/Load All Data",
  placeholder = "Enter name for this data set",
  keyPrefix = "",
  buttonText = "Save All Data"
}) => {
  const { translations: t } = useTranslationContext();
  
  const {
    savedSets,
    setName,
    setSetName,
    isSaveLoadOpen,
    setIsSaveLoadOpen,
    saveAllData,
    loadAllData,
    deleteAllData,
    exportToExcel
  } = saveLoadManager;

  return (
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
          <span>{title}</span>
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
              placeholder={placeholder}
              value={setName}
              onChange={e => setSetName(e.target.value)}
              style={{ padding: '8px', minWidth: '300px' }}
            />
            <button 
              onClick={saveAllData}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {buttonText}
            </button>
          </div>
          
          {savedSets.length > 0 && (
            <div>
              <h4 style={{ color: '#333' }}>{t.common.savedScenarios}</h4>
              <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>
                💡 {t.common.exportInstructionsScenarios}
              </div>
              {savedSets.map(key => {
                const savedData = loadData(key);
                const savedDate = savedData?.savedAt ? new Date(savedData.savedAt).toLocaleDateString() : t.common.unknownDate;
                const displayName = keyPrefix ? key.replace(keyPrefix, '') : key;
                
                return (
                  <div key={key} style={{ margin: '5px 0', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '200px' }}>
                      <div style={{ color: '#333' }}><strong>{displayName}</strong></div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{t.common.saved} {savedDate}</div>
                    </div>
                    <button 
                      onClick={() => loadAllData(key)}
                      style={{ padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      {t.common.load}
                    </button>
                    {exportToExcel && (
                      <button 
                        onClick={() => exportToExcel(key)}
                        style={{ padding: '4px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        📊 {t.common.export}
                      </button>
                    )}
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
  );
};
