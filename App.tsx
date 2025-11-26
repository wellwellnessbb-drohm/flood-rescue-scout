import React, { useEffect, useState, useCallback } from 'react';
import { Button } from './components/Button';
import { TabState, LoadingStatus, MessagePayload, FloodRescueData, SubmittedData } from './types';

// Fix: Add declaration for chrome namespace to resolve type errors
declare const chrome: any;

const INITIAL_STATE: TabState = {
  status: LoadingStatus.IDLE,
  data: null,
  error: null,
};

const App: React.FC = () => {
  const [tabId, setTabId] = useState<number | null>(null);
  const [state, setState] = useState<TabState>(INITIAL_STATE);
  const [formData, setFormData] = useState<Omit<FloodRescueData, 'lastUpdated'>>({
    location: '',
    contact: '',
    severity: 'Normal',
    needs: '',
    timestamp_context: '',
    number_of_people: '',
    weather_condition: '',
    additional_info: ''
  });
  const [submittedData, setSubmittedData] = useState<SubmittedData[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<{spreadsheetId: string, sheetName: string} | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState<string>('');

  // Initialize: Get current Tab ID and load its state from storage
  useEffect(() => {
    const init = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          setTabId(tab.id);
          setCurrentUrl(tab.url || '');
          
          // Load tab state
          const result = await chrome.storage.local.get(tab.id.toString());
          if (result[tab.id]) {
            setState(result[tab.id]);
            // Auto-fill form if data exists
            if (result[tab.id].data) {
              setFormData({
                location: result[tab.id].data.location || '',
                contact: result[tab.id].data.contact || '',
                severity: result[tab.id].data.severity || 'Normal',
                needs: result[tab.id].data.needs || '',
                timestamp_context: result[tab.id].data.timestamp_context || '',
                number_of_people: result[tab.id].data.number_of_people || '',
                weather_condition: result[tab.id].data.weather_condition || '',
                additional_info: result[tab.id].data.additional_info || ''
              });
            }
          }
          
          // Load submitted data
          const submittedResult = await chrome.storage.local.get('submittedData');
          if (submittedResult.submittedData) {
            setSubmittedData(submittedResult.submittedData);
          }
          
          // Load Google Sheets config
          const sheetsConfig = await chrome.storage.local.get(['googleSheetsConfig', 'googleSheetsWebAppUrl']);
          if (sheetsConfig.googleSheetsConfig) {
            setGoogleSheetsConfig(sheetsConfig.googleSheetsConfig);
            console.log('✅ Google Sheets config loaded:', sheetsConfig.googleSheetsConfig);
          } else {
            console.warn('⚠️ Google Sheets config not found');
          }
          
          // Load API endpoint
          const apiConfig = await chrome.storage.local.get('apiEndpoint');
          if (apiConfig.apiEndpoint) {
            setApiEndpoint(apiConfig.apiEndpoint);
            console.log('✅ API endpoint loaded:', apiConfig.apiEndpoint);
          }
        }
      } catch (error) {
        console.error("Failed to initialize tab:", error);
      }
    };
    init();
  }, []);

  // Listen for storage changes from the background worker
  useEffect(() => {
    if (!tabId) return;

    const handleStorageChange = (changes: { [key: string]: any }) => {
      const key = tabId.toString();
      if (changes[key]) {
        const newState = changes[key].newValue as TabState;
        setState(newState);
        // Auto-fill form when new data arrives
        if (newState.data) {
          setFormData({
            location: newState.data.location || '',
            contact: newState.data.contact || '',
            severity: newState.data.severity || 'Normal',
            needs: newState.data.needs || '',
            timestamp_context: newState.data.timestamp_context || '',
            number_of_people: newState.data.number_of_people || '',
            weather_condition: newState.data.weather_condition || '',
            additional_info: newState.data.additional_info || ''
          });
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [tabId]);

  const handleAnalyze = useCallback(() => {
    if (!tabId) return;

    // Optimistic update
    setState((prev) => ({ ...prev, status: LoadingStatus.LOADING, error: null }));

    const message: MessagePayload = { action: 'ANALYZE_REQUEST' };
    chrome.runtime.sendMessage(message);
  }, [tabId]);

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!tabId || !currentUrl) return;
    
    setIsSubmitting(true);
    
    try {
      // Create unique ID for this submission
      const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const submissionData: SubmittedData = {
        ...formData,
        lastUpdated: Date.now(),
        id: submissionId,
        submittedAt: Date.now(),
        url: currentUrl
      };
      
      // Check for duplicates (same location + contact + similar timestamp)
      const existingData = await chrome.storage.local.get('submittedData');
      const submitted: SubmittedData[] = existingData.submittedData || [];
      
      // Check if this data is duplicate
      const isDuplicate = submitted.some(item => {
        const sameLocation = item.location && formData.location && 
          item.location.toLowerCase().trim() === formData.location.toLowerCase().trim();
        const sameContact = item.contact && formData.contact && 
          item.contact === formData.contact;
        const sameUrl = item.url === currentUrl;
        
        // Consider duplicate if same location+contact+url, or same contact+url within 5 minutes
        return (sameLocation && sameContact && sameUrl) || 
               (sameContact && sameUrl && Math.abs(item.submittedAt - Date.now()) < 300000);
      });
      
      if (isDuplicate) {
        alert('⚠️ ข้อมูลนี้ถูกส่งไปแล้ว (Duplicate data detected)');
        setIsSubmitting(false);
        return;
      }
      
      // Add to submitted data
      const updatedSubmitted = [...submitted, submissionData];
      await chrome.storage.local.set({ submittedData: updatedSubmitted });
      setSubmittedData(updatedSubmitted);
      
      // Log to console
      console.log('Flood Rescue Data Submitted:', JSON.stringify(submissionData, null, 2));
      console.log(`Total submissions: ${updatedSubmitted.length}`);
      
      alert(`✅ ข้อมูลถูกบันทึกแล้ว! (Total: ${updatedSubmitted.length} records)`);
      
      // Auto-sync to API endpoint if configured (easier than Google Sheets)
      if (apiEndpoint) {
        await syncToAPI(submissionData);
      }
      // Auto-sync to Google Sheets if configured
      else if (googleSheetsConfig) {
        await syncToGoogleSheets(submissionData);
      }
      
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, tabId, currentUrl, apiEndpoint, googleSheetsConfig]);

  const handleExportJSON = useCallback(() => {
    if (submittedData.length === 0) {
      alert('⚠️ ไม่มีข้อมูลที่จะ Export');
      return;
    }
    
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flood-rescue-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      alert(`✅ Export JSON สำเร็จ! (${submittedData.length} records)`);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('❌ เกิดข้อผิดพลาดในการ Export');
    } finally {
      setIsExporting(false);
    }
  }, [submittedData]);

  const handleExportCSV = useCallback(() => {
    if (submittedData.length === 0) {
      alert('⚠️ ไม่มีข้อมูลที่จะ Export');
      return;
    }
    
    setIsExporting(true);
    try {
      // CSV Headers
      const headers = [
        'ID', 'Location', 'Contact', 'Severity', 'Needs', 
        'Time Context', 'Number of People', 'Weather Condition', 
        'Additional Info', 'Submitted At', 'URL'
      ];
      
      // CSV Rows
      const rows = submittedData.map(item => [
        item.id,
        `"${item.location.replace(/"/g, '""')}"`,
        `"${item.contact.replace(/"/g, '""')}"`,
        item.severity,
        `"${item.needs.replace(/"/g, '""')}"`,
        `"${item.timestamp_context.replace(/"/g, '""')}"`,
        `"${item.number_of_people.replace(/"/g, '""')}"`,
        `"${item.weather_condition.replace(/"/g, '""')}"`,
        `"${item.additional_info.replace(/"/g, '""')}"`,
        new Date(item.submittedAt).toISOString(),
        `"${item.url.replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const dataBlob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flood-rescue-data-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      alert(`✅ Export CSV สำเร็จ! (${submittedData.length} records)`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('❌ เกิดข้อผิดพลาดในการ Export');
    } finally {
      setIsExporting(false);
    }
  }, [submittedData]);

  const syncToAPI = async (data: SubmittedData) => {
    console.log('🔄 Attempting to sync to API endpoint...');
    
    if (!apiEndpoint) {
      console.warn('⚠️ API endpoint not configured');
      return;
    }
    
    try {
      const payload = {
        location: data.location,
        contact: data.contact,
        severity: data.severity,
        needs: data.needs,
        timestamp_context: data.timestamp_context,
        number_of_people: data.number_of_people,
        weather_condition: data.weather_condition,
        additional_info: data.additional_info,
        submitted_at: new Date(data.submittedAt).toISOString(),
        url: data.url,
        id: data.id
      };
      
      console.log('📤 Sending data to API...', payload);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response:', responseText);
      
      if (response.ok) {
        console.log('✅ Synced to API successfully!');
      } else {
        console.error('❌ Failed to sync to API. Status:', response.status);
        console.error('❌ Response:', responseText);
      }
    } catch (error) {
      console.error('❌ Error syncing to API:', error);
    }
  };

  const syncToGoogleSheets = async (data: SubmittedData) => {
    console.log('🔄 Attempting to sync to Google Sheets...');
    
    // Load config from storage (in case it wasn't loaded yet)
    const config = await chrome.storage.local.get(['googleSheetsConfig', 'googleSheetsWebAppUrl']);
    
    if (!config.googleSheetsConfig) {
      console.warn('⚠️ Google Sheets config not found in storage');
      return;
    }
    
    if (!config.googleSheetsWebAppUrl) {
      console.warn('⚠️ Google Sheets Web App URL not configured');
      return;
    }
    
    console.log('📋 Config:', {
      spreadsheetId: config.googleSheetsConfig.spreadsheetId,
      sheetName: config.googleSheetsConfig.sheetName,
      webAppUrl: config.googleSheetsWebAppUrl.substring(0, 50) + '...'
    });
    
    try {
      const payload = {
        spreadsheetId: config.googleSheetsConfig.spreadsheetId,
        sheetName: config.googleSheetsConfig.sheetName,
        data: {
          location: data.location,
          contact: data.contact,
          severity: data.severity,
          needs: data.needs,
          timestamp_context: data.timestamp_context,
          number_of_people: data.number_of_people,
          weather_condition: data.weather_condition,
          additional_info: data.additional_info,
          submitted_at: new Date(data.submittedAt).toISOString(),
          url: data.url
        }
      };
      
      console.log('📤 Sending data to Google Sheets...', payload);
      
      const response = await fetch(config.googleSheetsWebAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response:', responseText);
      
      if (response.ok) {
        console.log('✅ Synced to Google Sheets successfully!');
        try {
          const result = JSON.parse(responseText);
          console.log('✅ Result:', result);
        } catch (e) {
          console.log('Response is not JSON:', responseText);
        }
      } else {
        console.error('❌ Failed to sync to Google Sheets. Status:', response.status);
        console.error('❌ Response:', responseText);
      }
    } catch (error) {
      console.error('❌ Error syncing to Google Sheets:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Normal': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-600 font-bold text-lg shadow-sm">
            🚨
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Flood Rescue Scout</h1>
        </div>
        <div className="text-xs text-red-100 font-medium">AI-Powered</div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {state.status === LoadingStatus.IDLE && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-75">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-slate-500 mb-6">Open a social media post about flood rescue and click analyze to extract data.</p>
          </div>
        )}

        {state.status === LoadingStatus.LOADING && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
             <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
                <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
             </div>
             <p className="text-sm font-medium text-slate-500 animate-pulse">Reading content & extracting data...</p>
          </div>
        )}

        {state.status === LoadingStatus.ERROR && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
            <h3 className="text-red-700 font-medium mb-1">Error: Analysis Failed</h3>
            <p className="text-red-600 text-sm">{state.error || "Something went wrong."}</p>
          </div>
        )}

        {state.status === LoadingStatus.SUCCESS && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Extracted Data</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getSeverityColor(formData.severity)}`}>
                  {formData.severity}
                </span>
            </div>
            
            {/* Data Form */}
            <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              {/* Location Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Address, village, district, or GPS coordinates"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Contact Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="Phone number, name, or social media handle"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Severity Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${getSeverityColor(formData.severity)}`}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Needs Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Needs
                </label>
                <input
                  type="text"
                  value={formData.needs}
                  onChange={(e) => handleInputChange('needs', e.target.value)}
                  placeholder="What they need (e.g., Boat, Food, Evacuation)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Timestamp Context Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Time Context
                </label>
                <input
                  type="text"
                  value={formData.timestamp_context}
                  onChange={(e) => handleInputChange('timestamp_context', e.target.value)}
                  placeholder="Time mentioned in post (e.g., 'posted 1 hour ago')"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Number of People Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Number of People
                </label>
                <input
                  type="text"
                  value={formData.number_of_people}
                  onChange={(e) => handleInputChange('number_of_people', e.target.value)}
                  placeholder="Number of people needing help (e.g., '5 people', 'ครอบครัว 4 คน')"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Weather Condition Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Weather Condition
                </label>
                <input
                  type="text"
                  value={formData.weather_condition}
                  onChange={(e) => handleInputChange('weather_condition', e.target.value)}
                  placeholder="Current weather (e.g., 'heavy rain', 'ฝนตกหนัก', 'water rising')"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Additional Info Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Additional Info
                </label>
                <textarea
                  value={formData.additional_info}
                  onChange={(e) => handleInputChange('additional_info', e.target.value)}
                  placeholder="Other important information (medical conditions, accessibility needs, etc.)"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Submitted Data Summary */}
      {submittedData.length > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 text-xs text-blue-700">
          <div className="flex items-center justify-between mb-2">
            <span>📊 บันทึกแล้ว: {submittedData.length} รายการ</span>
            <button
              onClick={() => {
                console.log('All Submitted Data:', JSON.stringify(submittedData, null, 2));
                alert(`ดูข้อมูลทั้งหมดใน Console (F12)\n\nTotal: ${submittedData.length} records`);
              }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : '📥 Export JSON'}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : '📊 Export CSV'}
            </button>
            <button
              onClick={() => {
                const endpoint = prompt('ใส่ API Endpoint URL (เช่น https://your-api.com/api/flood-rescue):', apiEndpoint || '');
                if (endpoint) {
                  chrome.storage.local.set({ apiEndpoint: endpoint }, () => {
                    setApiEndpoint(endpoint);
                    alert('✅ ตั้งค่า API Endpoint สำเร็จ!');
                  });
                }
              }}
              className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              title={apiEndpoint ? `API: ${apiEndpoint}` : 'ตั้งค่า API Endpoint'}
            >
              {apiEndpoint ? '🔗 API: ✓' : '🔗 ตั้งค่า API'}
            </button>
          </div>
          {apiEndpoint && (
            <div className="mt-1 text-[10px] text-blue-600 truncate" title={apiEndpoint}>
              API: {apiEndpoint}
            </div>
          )}
        </div>
      )}

      {/* Sticky Footer */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 space-y-2">
        {state.status === LoadingStatus.SUCCESS && (
          <Button 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'Submit Data'}
          </Button>
        )}
        <Button 
          onClick={handleAnalyze} 
          isLoading={state.status === LoadingStatus.LOADING}
          disabled={!tabId}
          className={state.status === LoadingStatus.SUCCESS ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {state.status === LoadingStatus.SUCCESS ? 'Re-Analyze Page' : 'Analyze Page'}
        </Button>
      </footer>
    </div>
  );
};

export default App;
