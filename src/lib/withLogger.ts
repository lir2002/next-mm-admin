import logger from './logger';

const withLogger = (handler: any) => async (req: any, res: any) => {
  const start = Date.now();
  try {
    await handler(req, res);
  } catch (error: any) {
    logger.error(`[API ERROR] ${req.method} ${req.url} - ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    const duration = Date.now() - start;
    logger.info(
      `[API] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
    );
  }
};

export default withLogger;
