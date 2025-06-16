import { Server } from 'socket.io';

// Global instance - be aware that this won't persist between serverless function invocations on Vercel
let io = null;

/**
 * Handles WebSocket connections for the test runner
 * This endpoint is an entry point, but actual WebSocket handling
 * is done by the socket.io server initialized in memory
 * 
 * Note: For production in a serverless environment, consider using a dedicated
 * WebSocket service like Pusher, Socket.io Cloud, or Ably
 */
export const GET = async (context) => {
  // Initialize Socket.IO server if it doesn't exist
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      path: "/api/runner/ws/socket.io",
      addTrailingSlash: false,
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
      socket.on('runTest', async (data) => {
        console.log('Run test request received:', data);
        
        try {
          // Call runner API - using absolute URL to ensure it works in serverless environment
          const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.BASE_URL || 'http://localhost:4000';
            
          const response = await fetch(`${baseUrl}/api/runner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'run', ...data })
          });
          
          const result = await response.json();
          console.log('Run test result:', result);
        } catch (error) {
          console.error('Error running test:', error);
        }
      });
      
      socket.on('stopTest', async () => {
        console.log('Stop test request received');
        
        try {
          // Call runner API
          const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.BASE_URL || 'http://localhost:4000';
            
          const response = await fetch(`${baseUrl}/api/runner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'stop' })
          });
          
          const result = await response.json();
          console.log('Stop test result:', result);
        } catch (error) {
          console.error('Error stopping test:', error);
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // Try to start Socket.IO server - this won't work in serverless environment,
    // but we keep it for local development
    try {
      io.listen(3002);
      console.log('Socket.IO server started on port 3002');
    } catch (error) {
      console.log('Socket.IO server could not start in this environment:', error.message);
    }
  }

  // Return a response for the WebSocket endpoint
  // In a serverless environment, this won't maintain a WebSocket connection
  // but it at least provides an endpoint for the client to attempt to connect
  return new Response(JSON.stringify({
    success: true,
    message: 'WebSocket endpoint available. For serverless environments, consider using a dedicated WebSocket service.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
