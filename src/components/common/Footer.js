import React from 'react';
import { useTranslationContext } from '../../contexts/TranslationContext';
// ...existing code...

const Footer = () => {
  const { translations: t } = useTranslationContext();

  return (
    <footer style={{
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      borderTop: '4px solid #3498db'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '15px'
      }}>
        
        {/* Contact Information */}
        <div>
          <h4 style={{ 
            color: '#3498db', 
            marginBottom: '10px', 
            fontSize: '16px',
            borderBottom: '1px solid #3498db',
            paddingBottom: '3px'
          }}>
            {t.common.contactInformation}
          </h4>
          <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
            <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
              California Healthy Nail Salon Collaborative (CHNSC)
            </p>
            <p style={{ margin: '2px 0' }}>
              
              
            </p>
            <p style={{ margin: '2px 0' }}>
              
              
            </p>
            <p style={{ margin: '2px 0' }}>
              
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div>
          <h4 style={{ 
            color: '#3498db', 
            marginBottom: '10px', 
            fontSize: '16px',
            borderBottom: '1px solid #3498db',
            paddingBottom: '3px'
          }}>
            {t.common.ourMission}
          </h4>
          <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>
            CHNSC builds worker power to transform the nail salon industry through organizing, 
            policy advocacy, and community education to improve workplace conditions and protect worker rights.
          </p>
        </div>

        {/* Follow Us */}
        <div>
          <h4 style={{ 
            color: '#3498db', 
            marginBottom: '10px', 
            fontSize: '16px',
            borderBottom: '1px solid #3498db',
            paddingBottom: '3px'
          }}>
            {t.common.followUs}
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a 
              href="https://www.instagram.com/ca_hnsc/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3498db',
                textDecoration: 'none',
                padding: '8px',
                backgroundColor: '#34495e',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
                fontSize: '18px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#34495e'}
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            <a 
              href="https://www.facebook.com/CAHealthyNails/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3498db',
                textDecoration: 'none',
                padding: '8px',
                backgroundColor: '#34495e',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
                fontSize: '18px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#34495e'}
              title="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a 
              href="https://x.com/ca_hnsc" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3498db',
                textDecoration: 'none',
                padding: '8px',
                backgroundColor: '#34495e',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
                fontSize: '18px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#34495e'}
              title="X (formerly Twitter)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Single Line */}
      <div style={{
        borderTop: '1px solid #34495e',
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <a 
          href="https://www.cahealthynailsalons.org/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {t.common.privacyPolicy}
        </a>
        <span style={{ color: '#7f8c8d' }}>•</span>
        <a 
          href="./documentation/USER-INSTRUCTIONS.html" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {t.common.help}
        </a>
        <span style={{ color: '#7f8c8d' }}>•</span>
        <a 
          href="https://www.cahealthynailsalons.org/donate" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#e74c3c', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {t.common.donate}
        </a>
        <span style={{ color: '#7f8c8d', display: 'inline-flex', alignItems: 'center' }}>•</span>
        <span style={{ 
          color: '#95a5a6',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          {t.common.copyright}
        </span>
        <span style={{ color: '#7f8c8d', display: 'inline-flex', alignItems: 'center' }}>•</span>
        <span style={{ 
          color: '#bdc3c7',
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          {t.common.appBuiltBy}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
