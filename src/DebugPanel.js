import React, { useState } from 'react';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const BASE_URL = "https://mini-rag-assesment-backend.onrender.com";

  const testEndpoint = async (endpoint, label) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      
      setDebugInfo({
        endpoint: label,
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      setDebugInfo({
        endpoint: label,
        status: 'Error',
        success: false,
        data: { error: error.message },
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 1000,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Toggle Button */}
      <button 
        onClick={() => setShowPanel(!showPanel)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {showPanel ? '❌ Hide Debug' : '🔧 Debug Panel'}
      </button>

      {/* Debug Panel */}
      {showPanel && (
        <div style={{ marginTop: '10px', minWidth: '300px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🔍 Backend Health Check</h4>
          
          {/* Test Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            <button 
              onClick={() => testEndpoint('/health', 'Health Check')}
              disabled={loading}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {loading ? '⏳ Testing...' : '🏥 Test Health'}
            </button>
            
            <button 
              onClick={() => testEndpoint('/debug_pinecone', 'Pinecone Debug')}
              disabled={loading}
              style={{
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {loading ? '⏳ Testing...' : '📊 Test Pinecone'}
            </button>
            
            <button 
              onClick={() => testEndpoint('/list_chats/', 'List Chats')}
              disabled={loading}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {loading ? '⏳ Testing...' : '💬 Test List Chats'}
            </button>

            <button 
              onClick={() => testEndpoint('/', 'Root Endpoint')}
              disabled={loading}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {loading ? '⏳ Testing...' : '🏠 Test Root'}
            </button>
          </div>

          {/* Results Display */}
          {debugInfo && (
            <div style={{
              backgroundColor: debugInfo.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${debugInfo.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              padding: '10px',
              fontSize: '11px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                {debugInfo.success ? '✅' : '❌'} {debugInfo.endpoint} 
                <span style={{ float: 'right' }}>{debugInfo.timestamp}</span>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Status:</strong> {debugInfo.status}
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Response:</strong>
              </div>
              
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '8px',
                borderRadius: '3px',
                overflow: 'auto',
                fontSize: '10px',
                margin: 0
              }}>
                {JSON.stringify(debugInfo.data, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Clear Button */}
          {debugInfo && (
            <button 
              onClick={() => setDebugInfo(null)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px',
                marginTop: '8px',
                width: '100%'
              }}
            >
              Clear Results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
