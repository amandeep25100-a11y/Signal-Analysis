/**
 * Debug Console Utilities
 * Logs API calls, state changes, and provides real-time debugging
 */

const DEBUG_ENABLED = true;

/**
 * Debug logger with colored output
 */
export const debugLog = {
  info: (title, data = null) => {
    if (DEBUG_ENABLED) {
      console.log(`%c[INFO] ${title}`, 'color: #06B6D4; font-weight: bold', data || '');
    }
  },
  
  success: (title, data = null) => {
    if (DEBUG_ENABLED) {
      console.log(`%c[SUCCESS] ${title}`, 'color: #14B8A6; font-weight: bold', data || '');
    }
  },
  
  error: (title, data = null) => {
    if (DEBUG_ENABLED) {
      console.error(`%c[ERROR] ${title}`, 'color: #FF0000; font-weight: bold', data || '');
    }
  },
  
  warning: (title, data = null) => {
    if (DEBUG_ENABLED) {
      console.warn(`%c[WARNING] ${title}`, 'color: #FFAA00; font-weight: bold', data || '');
    }
  },
  
  api: (method, endpoint, data = null) => {
    if (DEBUG_ENABLED) {
      console.log(
        `%c[API] ${method} ${endpoint}`,
        'color: #0EA5E9; background: rgba(5, 20, 40, 0.8); padding: 2px 5px; border-radius: 3px',
        data || ''
      );
    }
  }
};

/**
 * Log state changes
 */
export const logStateChange = (stateName, oldValue, newValue) => {
  if (DEBUG_ENABLED) {
    console.group(`%c[STATE] ${stateName}`, 'color: #14B8A6; font-weight: bold');
    console.log('%cBefore:', 'color: #FF0000', oldValue);
    console.log('%cAfter:', 'color: #14B8A6', newValue);
    console.groupEnd();
  }
};

/**
 * Log component lifecycle
 */
export const logComponentLifecycle = (componentName, event) => {
  if (DEBUG_ENABLED) {
    console.log(
      `%c[${componentName}] ${event}`,
      'color: #0EA5E9; font-style: italic'
    );
  }
};

/**
 * Performance monitoring
 */
export const measurePerformance = (operation) => {
  if (DEBUG_ENABLED) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(
          `%c⏱️ ${operation}: ${duration.toFixed(2)}ms`,
          'color: #F59E0B; font-weight: bold'
        );
        return duration;
      }
    };
  }
  return { end: () => {} };
};

/**
 * Display a debug panel in the UI (for showing stats without console)
 */
export class DebugPanel {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.listeners = [];
  }
  
  addLog(level, title, data) {
    const timestamp = new Date().toLocaleTimeString();
    const log = { timestamp, level, title, data };
    
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Notify subscribers
    this.listeners.forEach(callback => callback(this.logs));
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
  
  getLogs(filter = null) {
    if (!filter) return this.logs;
    return this.logs.filter(log => log.level === filter);
  }
  
  clear() {
    this.logs = [];
    this.listeners.forEach(callback => callback(this.logs));
  }
}

export const debugPanel = new DebugPanel();

/**
 * Create a debug display element
 */
export const createDebugDisplay = () => {
  if (document.getElementById('debug-console-toggle')) {
    return;
  }

  const toggleButton = document.createElement('button');
  toggleButton.id = 'debug-console-toggle';
  toggleButton.textContent = '🐛 Debug (0)';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(5, 20, 40, 0.75);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(6, 182, 212, 0.4);
    color: #06B6D4;
    border-radius: 10px;
    padding: 8px 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(31, 38, 135, 0.3);
  `;

  const debugDiv = document.createElement('div');
  debugDiv.id = 'debug-console';
  debugDiv.style.cssText = `
    position: fixed;
    bottom: 64px;
    right: 20px;
    width: 420px;
    max-height: 320px;
    background: rgba(5, 20, 40, 0.45);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 12px;
    padding: 12px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #06B6D4;
    overflow-y: auto;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    z-index: 9999;
    display: none;
  `;

  const renderLogs = (logs) => {
    toggleButton.textContent = `🐛 Debug (${logs.length})`;
    debugDiv.innerHTML = `
      <div style="margin-bottom: 8px; border-bottom: 1px solid rgba(6, 182, 212, 0.3); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <strong style="color: #06B6D4;">DEBUG CONSOLE (${logs.length})</strong>
        <div>
          <button id="debug-console-clear" style="background: rgba(6, 182, 212, 0.3); color: #06B6D4; border: 1px solid rgba(6, 182, 212, 0.5); cursor: pointer; padding: 2px 6px; border-radius: 4px; margin-right: 6px;">Clear</button>
          <button id="debug-console-close" style="background: rgba(239, 68, 68, 0.25); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.5); cursor: pointer; padding: 2px 6px; border-radius: 4px;">Close</button>
        </div>
      </div>
      ${logs.map(log => `
        <div style="margin: 4px 0; color: ${
          log.level === 'error' ? '#EF4444' :
          log.level === 'success' ? '#14B8A6' :
          log.level === 'warning' ? '#F59E0B' :
          '#06B6D4'
        }">
          <span style="color: #666; font-size: 10px;">[${log.timestamp}]</span> ${log.title}
          ${log.data ? `<br><span style="opacity: 0.6; margin-left: 10px; font-size: 10px;">${JSON.stringify(log.data).substring(0, 120)}</span>` : ''}
        </div>
      `).reverse().join('')}
    `;

    const clearBtn = debugDiv.querySelector('#debug-console-clear');
    const closeBtn = debugDiv.querySelector('#debug-console-close');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => debugPanel.clear());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        debugDiv.style.display = 'none';
      });
    }
  };

  toggleButton.addEventListener('click', () => {
    debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
  });

  debugPanel.subscribe((logs) => {
    renderLogs(logs);
  });

  renderLogs(debugPanel.getLogs());
  document.body.appendChild(toggleButton);
  document.body.appendChild(debugDiv);
};

export default debugLog;
