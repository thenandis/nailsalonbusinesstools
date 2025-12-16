import React, { useState, useEffect } from 'react';

const Tooltip = ({ children, text, position = 'top', maxWidth = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive maxWidth based on screen size and content length
  const getResponsiveMaxWidth = () => {
    if (maxWidth) return maxWidth; // Use custom maxWidth if provided
    
    // Dynamic width based on content length and screen size
    const textLength = text ? text.length : 0;
    
    // Base widths for different screen sizes
    let baseWidth;
    if (screenSize.width >= 1200) {
      baseWidth = 900; // Large screens - was 600
    } else if (screenSize.width >= 768) {
      baseWidth = 700; // Medium screens - was 500
    } else {
      baseWidth = 500; // Small screens - was 400
    }

    // Adjust width based on content length
    if (textLength > 800) {
      return `${Math.min(baseWidth + 400, screenSize.width * 0.95)}px`; // Very long content
    } else if (textLength > 400) {
      return `${Math.min(baseWidth + 200, screenSize.width * 0.85)}px`; // Long content
    } else if (textLength > 200) {
      return `${Math.min(baseWidth, screenSize.width * 0.75)}px`; // Medium content
    } else {
      return `${Math.min(baseWidth - 100, screenSize.width * 0.6)}px`; // Short content
    }
  };

  const tooltipStyles = {
    container: {
      position: 'relative',
      display: 'inline-block',
      cursor: 'help',
      borderBottom: '1px dotted #999'
    },
    tooltip: {
      position: 'absolute',
      backgroundColor: '#333',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: '1.6',
      maxWidth: getResponsiveMaxWidth(),
      minWidth: '250px',
      whiteSpace: 'pre-line', // Preserve line breaks and allow wrapping
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      // Position based on prop with improved spacing
      ...(position === 'top' && {
        bottom: '130%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px'
      }),
      ...(position === 'bottom' && {
        top: '130%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px'
      }),
      ...(position === 'left' && {
        right: '130%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '8px'
      }),
      ...(position === 'right' && {
        left: '130%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '8px'
      })
    },
    arrow: {
      position: 'absolute',
      width: 0,
      height: 0,
      ...(position === 'top' && {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '7px solid #333'
      }),
      ...(position === 'bottom' && {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '7px solid #333'
      }),
      ...(position === 'left' && {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderLeft: '7px solid #333'
      }),
      ...(position === 'right' && {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderRight: '7px solid #333'
      })
    }
  };

  return (
    <span
      style={tooltipStyles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={tooltipStyles.tooltip}>
        {text}
        <div style={tooltipStyles.arrow}></div>
      </div>
    </span>
  );
};

export default Tooltip;
