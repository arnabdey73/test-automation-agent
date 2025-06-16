export const GET = async () => {
  return new Response(JSON.stringify({
    message: 'API endpoint working!',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
