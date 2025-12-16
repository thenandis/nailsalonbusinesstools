import React from 'react';

export default function TestComponent() {
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '50px',
      margin: '20px',
      fontSize: '20px',
      border: '5px solid green'
    }}>
      <h1 style={{ backgroundColor: 'blue', color: 'yellow', padding: '10px' }}>
        🎨 STYLE TEST COMPONENT
      </h1>
      <p style={{ backgroundColor: 'purple', color: 'white', padding: '15px' }}>
        If you can see these colors, styling is working!
      </p>
      <p>Red background, white text with green border should be visible.</p>
    </div>
  );
}
