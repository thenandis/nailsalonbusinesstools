import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginLeft: 'auto',
      paddingRight: '20px'
    }}>
      <span style={{ 
        color: '#ffffff', 
        fontSize: '14px',
        fontWeight: '500'
      }}>
        {language === 'vi' ? 'Ngôn Ngữ:' : 'Language:'}
      </span>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #34495e',
          backgroundColor: '#34495e',
          color: '#ffffff',
          fontSize: '14px',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
