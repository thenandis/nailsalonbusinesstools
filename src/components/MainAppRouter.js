import React, { useState } from 'react';
import NailSalonBudgetTool from './NailSalonBudgetTool';
import NailSalonBreakEvenModel from './NailSalonBreakEvenModel';
import NailSalonW2vs1099Model from './NailSalonW2vs1099Model';
import Footer from './common/Footer';
import { useTranslationContext } from '../contexts/TranslationContext';
import LanguageSelector from './common/LanguageSelector';
import TranslationUploader from './common/TranslationUploader';


function MainAppContent() {
  const [activeSection, setActiveSection] = useState('w2vs1099-model');
  const { translations: t, setCustomTranslations } = useTranslationContext();

  // Persist uploaded translations in localStorage and load on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('customTranslations');
    if (stored) {
      try {
        setCustomTranslations(JSON.parse(stored));
      } catch {}
    }
  }, [setCustomTranslations]);

  // Handler to save uploaded translations to localStorage
  const handleTranslationsLoaded = (json) => {
    setCustomTranslations(json);
    localStorage.setItem('customTranslations', JSON.stringify(json));
  };

  const mainSections = [
    { id: 'w2vs1099-model', label: t.common.w2vs1099Tab, component: NailSalonW2vs1099Model },
    { id: 'breakeven-model', label: t.common.breakEvenTab, component: NailSalonBreakEvenModel },
    { id: 'budget-tool', label: t.common.budgetToolTab, component: NailSalonBudgetTool }
  ];

  const getCurrentComponent = () => {
    const section = mainSections.find(s => s.id === activeSection);
    return section ? section.component : NailSalonBudgetTool;
  };

  const CurrentComponent = getCurrentComponent();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      {/* Top-level Navigation Header */}
      <div style={{ 
        backgroundColor: '#2c3e50', 
        color: '#ffffff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '20px 20px 10px'
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold'
            }}>
              {t.common.appTitle}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <TranslationUploader onTranslationsLoaded={handleTranslationsLoaded} />
              <LanguageSelector />
            </div>
          </div>
          {/* Main Section Navigation */}
          <div style={{ display: 'flex', paddingLeft: '20px', paddingBottom: '0' }}>
            {mainSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: '12px 24px',
                  marginRight: '4px',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontSize: '16px',
                  backgroundColor: activeSection === section.id ? '#3498db' : 'rgba(255,255,255,0.1)',
                  fontWeight: activeSection === section.id ? 'bold' : 'normal',
                  borderBottom: activeSection === section.id ? '3px solid #f39c12' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <CurrentComponent />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function MainAppRouter() {
  return <MainAppContent />;
}
