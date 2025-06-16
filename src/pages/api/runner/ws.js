import { Server } from 'socket.io';

let io;

/**
 * Handles WebSocket connections for the test runner
 * This endpoint is an entry point, but actual WebSocket handling
 * is done by the socket.io server initialized in memory
 */
export const GET = async (context) => {
  // Initialize Socket.IO server if it doesn't exist
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Store test execution state
    const testState = {
      running: false,
      suite: null,
      startTime: null,
      endTime: null,
      results: null,
      currentTest: null,
      logs: [],
      status: 'idle',
    };

    io.on('connection', (socket) => {
      console.log('Client connected');
      
      // Send current state to new client
      socket.emit('state', testState);
      
      // Handle events from client
      socket.on('runTest', (data) => {
        console.log('Run test request received:', data);
        
        // Call runner API
        fetch('/api/runner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'run', ...data })
        })
        .then(response => response.json())
        .then(result => {
          console.log('Run test result:', result);
        })
        .catch(error => {
          console.error('Error running test:', error);
        });
      });
      
      socket.on('stopTest', () => {
        console.log('Stop test request received');
        
        // Call runner API
        fetch('/api/runner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stop' })
        })
        .then(response => response.json())
        .then(result => {
          console.log('Stop test result:', result);
        })
        .catch(error => {
          console.error('Error stopping test:', error);
        });
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // Start Socket.IO server
    io.listen(3002);
  }

  // Return a response with the WebSocket upgrade headers
  return new Response(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
    }
  });
};
