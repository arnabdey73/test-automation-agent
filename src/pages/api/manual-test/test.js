// Create a simple API test endpoint
export const GET = async () => {
  return new Response(JSON.stringify({ 
    status: 'success',
    message: 'Manual test sessions API working!'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
