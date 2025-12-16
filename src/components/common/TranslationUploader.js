
import React, { useRef, useState } from 'react';
//import { useLanguage } from '../../contexts/LanguageContext';
//import { useTranslationContext } from '../../contexts/TranslationContext';
import { en, vi } from '../../translations/translations';


export default function TranslationUploader({ onTranslationsLoaded }) {
  const fileInputRef = useRef();
  // const { language } = useLanguage(); // Removed unused variable
  //const { translations: t } = useTranslationContext();
  // Download all translations (en and vi) as JSON sample
  const handleDownload = () => {
    const data = { en, vi };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations-sample.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        onTranslationsLoaded(json);
  alert('Translations loaded successfully!');
  window.location.reload();
      } catch (err) {
        alert('Invalid JSON file. Please check your translation file.');
      }
    };
    reader.readAsText(file);
  };

  // Reset translations to original by removing from localStorage
  const handleResetTranslations = () => {
    localStorage.removeItem('customTranslations');
    alert('Custom translations removed. The app will now use the original translations.');
    window.location.reload();
  };

  // Collapsible section state
  const [open, setOpen] = useState(false);

  return (
    <div style={{ margin: '4px 0', fontSize: '13px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          padding: 0,
          marginBottom: open ? 4 : 0
        }}
        aria-expanded={open}
        aria-controls="translation-uploader-collapse"
        title="Show translation upload and reset tools"
      >
        {open ? '▲ Translation Tools' : '▼ Translation Tools'}
      </button>
      {open && (
        <div id="translation-uploader-collapse" style={{ marginTop: 4, background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 4, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 320 }}>
          <div style={{ fontSize: '12px', color: '#333', marginBottom: 6, lineHeight: 1.5 }}>
            <b>How to use:</b><br />
            <ol style={{ margin: '4px 0 4px 18px', padding: 0, fontSize: '12px' }}>
              <li>Click <b>Download Sample JSON</b> to get the current translation structure.</li>
              <li>Edit the downloaded file to update or add your translations (keep the structure).</li>
              <li>Click <b>Upload</b> to select your updated JSON file and apply it instantly.</li>
              <li>To return to the original built-in translations, click <b>Reset</b>.</li>
            </ol>
            <span style={{ color: '#888' }}>Note: Uploaded translations are saved in your browser until you reset.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={handleDownload} style={{ marginRight: 6, padding: '2px 8px', fontSize: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', height: 26 }} title="Download a sample translation JSON file">Download Sample JSON</button>
            <span style={{ fontWeight: 'bold', marginRight: 6, fontSize: '12px' }}>or Upload:</span>
            <input
              id="translation-upload"
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ marginLeft: 0, fontSize: '12px', height: 26, padding: 0, border: '1px solid #ccc', borderRadius: 3, background: '#fff' }}
              title="Upload your updated translation JSON file"
            />
            <button onClick={handleResetTranslations} style={{ marginLeft: 6, padding: '2px 8px', fontSize: '12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', height: 26 }} title="Reset to original built-in translations">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
