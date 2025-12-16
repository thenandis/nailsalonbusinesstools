import React, { useRef, useState } from 'react';

export default function MinWageUploader({ currentMinWageData, onMinWageDataLoaded }) {
  const fileInputRef = useRef();
  const [open, setOpen] = useState(false);

  // Download current minimum wage data as JSON
  const handleDownload = () => {
    const json = JSON.stringify(currentMinWageData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minwage.json';
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
        // Basic validation - check if it has the expected structure
        if (!json.data || typeof json.data !== 'object') {
          alert('Invalid minimum wage file format. Must have a "data" property with year entries.');
          return;
        }
        onMinWageDataLoaded(json);
        alert('Minimum wage data loaded successfully!');
      } catch (err) {
        alert('Invalid JSON file. Please check your minimum wage file.');
      }
    };
    reader.readAsText(file);
  };

  // Reset minimum wage data to original by removing from localStorage
  const handleResetMinWage = () => {
    localStorage.removeItem('customMinWageData');
    alert('Custom minimum wage data removed. The app will now use the original data.');
    window.location.reload();
  };

  return (
    <div style={{ margin: '10px 0', fontSize: '13px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          color: '#17a2b8',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          padding: 0,
          marginBottom: open ? 4 : 0
        }}
        aria-expanded={open}
        aria-controls="minwage-uploader-collapse"
        title="Show minimum wage data upload and reset tools"
      >
        {open ? '▲ Min Wage Data Tools' : '▼ Min Wage Data Tools'}
      </button>
      {open && (
        <div 
          id="minwage-uploader-collapse" 
          style={{ 
            marginTop: 8, 
            background: '#f8f9fa', 
            border: '1px solid #17a2b8', 
            borderRadius: 4, 
            padding: 12, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8
          }}
        >
          <div style={{ fontSize: '12px', color: '#333', marginBottom: 6, lineHeight: 1.5 }}>
            <b>How to use:</b><br />
            <ol style={{ margin: '4px 0 4px 18px', padding: 0, fontSize: '12px' }}>
              <li>Click <b>Download Current Data</b> to get the minimum wage data file.</li>
              <li>Edit the downloaded file to add new years (e.g., 2027) or update rates.</li>
              <li>Keep the same JSON structure with "data" property and year entries.</li>
              <li>Click <b>Upload</b> to select your updated JSON file and apply it instantly.</li>
              <li>To return to the original built-in data, click <b>Reset</b>.</li>
            </ol>
            <span style={{ color: '#888' }}>Note: Uploaded data is saved in your browser until you reset.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <button 
              onClick={handleDownload} 
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                background: '#17a2b8', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer', 
                fontWeight: 'bold'
              }} 
              title="Download current minimum wage data"
            >
              📥 Download Current Data
            </button>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>or Upload:</span>
            <input
              id="minwage-upload"
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ 
                fontSize: '12px', 
                padding: '4px', 
                border: '1px solid #ccc', 
                borderRadius: 4, 
                background: '#fff' 
              }}
              title="Upload your updated minimum wage JSON file"
            />
            <button 
              onClick={handleResetMinWage} 
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                background: '#dc3545', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer',
                fontWeight: 'bold'
              }} 
              title="Reset to original built-in minimum wage data"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
