// This is a CJS file
module.exports = async (req, res) => {
  try {
    const { handler } = await import('./entry.mjs');
    return handler(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
