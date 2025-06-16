import React, { useState, useEffect } from 'react';

interface Step {
  type: string;
  selector?: string;
  text?: string;
  value?: string;
  url?: string;
  timestamp: number;
  screenshot: string;
  error?: string;
  executed?: boolean;
  executionTime?: number;
  screenshotPath?: string;
}

interface Session {
  sessionId: string;
  steps: Step[];
  duration: number;
  createdAt: string;
  totalSteps: number;
}

interface RecordingState {
  isRecording: boolean;
  currentSession: Session | null;
  url: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ManualTestSimulator() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    currentSession: null,
    url: ''
  });
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [elapsedTimer, setElapsedTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [replayOptions, setReplayOptions] = useState({
    stepDelay: 1000,
    takeScreenshots: true
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({...alert, show: false});
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  // Cleanup elapsed time timer when component unmounts
  useEffect(() => {
    return () => {
      if (elapsedTimer) {
        clearInterval(elapsedTimer);
      }
    };
  }, [elapsedTimer]);

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({
      show: true,
      message,
      type
    });
  };

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/manual-test/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      } else {
        showAlert('Failed to load sessions: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      showAlert('Failed to load sessions. Check network connection.', 'error');
    }
  };

  const startRecording = async () => {
    if (!recording.url) {
      showAlert('Please enter a URL to start recording', 'error');
      return;
    }

    // Generate a session ID if not provided
    const sessionId = `manual_test_${Date.now()}`;
    const testName = `Manual Test ${new Date().toLocaleString()}`;

    setLoading(true);
    try {
      const response = await fetch('/api/manual-test/record/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: recording.url,
          sessionId: sessionId,
          testName: testName
        })
      });

      const data = await response.json();
      if (data.success) {
        setRecording({
          ...recording,
          isRecording: true,
          currentSession: data.session
        });
        // Start elapsed time timer
        setElapsedTime(0);
        const timer = setInterval(() => {
          setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
        setElapsedTimer(timer);
        showAlert('Recording started successfully', 'success');
      } else {
        showAlert('Failed to start recording: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      showAlert('Failed to start recording. Check network connection.', 'error');
    }
    setLoading(false);
  };

  const stopRecording = async () => {
    setLoading(true);
    
    // Clear the elapsed time timer
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      setElapsedTimer(null);
    }
    
    try {
      const sessionId = recording.currentSession?.sessionId;
      const response = await fetch('/api/manual-test/record/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      if (data.success) {
        setRecording({
          isRecording: false,
          currentSession: null,
          url: ''
        });
        showAlert('Recording stopped successfully', 'success');
        loadSessions(); // Refresh the sessions list
      } else {
        showAlert('Failed to stop recording: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      showAlert('Failed to stop recording. Check network connection.', 'error');
    }
    setLoading(false);
  };

  const replaySession = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manual-test/replay/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replayOptions)
      });

      const data = await response.json();
      if (data.success) {
        showAlert(`Replay completed with ${data.result.steps.length} steps`, 'success');
      } else {
        showAlert('Failed to replay session: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to replay session:', error);
      showAlert('Failed to replay session. Check network connection.', 'error');
    }
    setLoading(false);
  };
  
  const deleteSession = async (sessionId: string) => {
    // Confirm before deleting
    setDeleteSessionId(sessionId);
  };
  
  const confirmDelete = async () => {
    if (!deleteSessionId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/manual-test/sessions/${deleteSessionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        showAlert('Session deleted successfully', 'success');
        loadSessions(); // Refresh the sessions list
      } else {
        showAlert('Failed to delete session: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      showAlert('Failed to delete session. Check network connection.', 'error');
    }
    setLoading(false);
    setDeleteSessionId(null);
  };
  
  const cancelDelete = () => {
    setDeleteSessionId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manual Test Simulator</h1>
      
      {/* Alert/notification component */}
      {alert.show && (
        <div className={`mb-4 p-4 rounded-md ${
          alert.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
          alert.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
          'bg-blue-100 border-blue-400 text-blue-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {alert.type === 'success' ? '✅' : 
               alert.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p>{alert.message}</p>
            <button 
              onClick={() => setAlert({...alert, show: false})}
              className="ml-auto text-gray-500 hover:text-gray-700"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      {deleteSessionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this session and all related files? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Recording Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Record Manual Test</h2>
        
        {!recording.isRecording ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Starting URL:
              </label>
              <input
                type="url"
                value={recording.url}
                onChange={(e) => setRecording({...recording, url: e.target.value})}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={startRecording}
              disabled={loading || !recording.url}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Recording'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <div className="animate-pulse bg-red-500 w-3 h-3 rounded-full mr-2"></div>
                <p className="text-red-700 font-medium">Recording in progress...</p>
              </div>
              <p className="text-red-600 mt-1">
                Session: {recording.currentSession?.sessionId}
              </p>
              <p className="text-red-600 mt-1">
                Elapsed Time: {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
              </p>
            </div>
            <button
              onClick={stopRecording}
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              {loading ? 'Stopping...' : 'Stop Recording'}
            </button>
          </div>
        )}
      </div>

      {/* Replay Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Replay Options</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stepDelay" className="block text-sm font-medium mb-2">
              Step Delay (ms):
            </label>
            <input
              id="stepDelay"
              type="number"
              value={replayOptions.stepDelay}
              onChange={(e) => setReplayOptions({
                ...replayOptions,
                stepDelay: parseInt(e.target.value)
              })}
              aria-label="Step Delay in milliseconds"
              title="Time delay between steps during replay"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              id="takeScreenshots"
              type="checkbox"
              checked={replayOptions.takeScreenshots}
              onChange={(e) => setReplayOptions({
                ...replayOptions,
                takeScreenshots: e.target.checked
              })}
              aria-label="Take screenshots during replay"
              title="Take screenshots during replay"
              className="mr-2"
            />
            <label htmlFor="takeScreenshots" className="text-sm font-medium">Take Screenshots</label>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recorded Sessions</h2>
        
        {sessions.length === 0 ? (
          <p className="text-gray-500">No recorded sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="border rounded-md p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{session.sessionId}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2">
                        {session.totalSteps} steps
                      </span>
                      <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs font-medium mr-2">
                        {Math.round(session.duration / 1000)}s
                      </span>
                      <span className="text-gray-500">
                        {new Date(session.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="space-x-2 flex items-center">
                    <button
                      onClick={() => setSelectedSession(
                        selectedSession?.sessionId === session.sessionId ? null : session
                      )}
                      className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md border border-blue-200 hover:border-blue-400"
                      aria-label={selectedSession?.sessionId === session.sessionId ? 'Hide session details' : 'View session details'}
                    >
                      {selectedSession?.sessionId === session.sessionId ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => replaySession(session.sessionId)}
                      disabled={loading}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
                      aria-label="Replay this session"
                    >
                      Replay
                    </button>
                    <button
                      onClick={() => deleteSession(session.sessionId)}
                      disabled={loading}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 disabled:opacity-50"
                      aria-label="Delete this session"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {selectedSession?.sessionId === session.sessionId && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Steps:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded bg-gray-50">
                      {session.steps.map((step, index) => (
                        <div key={index} className="text-sm bg-white p-3 rounded shadow-sm border-l-4 border-l-blue-500">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${step.type === 'click' ? 'bg-green-100 text-green-800' : 
                                  step.type === 'input' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-purple-100 text-purple-800'}`}
                              >
                                {step.type.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="mt-1">
                            {step.selector && (
                              <div className="text-gray-700">
                                <span className="font-medium">Selector:</span> <code className="bg-gray-100 px-1 py-0.5 rounded">{step.selector}</code>
                              </div>
                            )}
                            {step.value && (
                              <div className="text-gray-700">
                                <span className="font-medium">Value:</span> <span className="text-blue-600">"{step.value}"</span>
                              </div>
                            )}
                            {step.text && (
                              <div className="text-gray-700">
                                <span className="font-medium">Text:</span> <span className="text-gray-600">"{step.text}"</span>
                              </div>
                            )}
                            {step.url && (
                              <div className="text-gray-700">
                                <span className="font-medium">URL:</span> <a href={step.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{step.url}</a>
                              </div>
                            )}
                            {step.error && (
                              <div className="text-red-600 mt-1">
                                <span className="font-medium">Error:</span> {step.error}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {session.steps.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No steps recorded in this session</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
