const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');

router.get('/', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV,
    version: require('../../package.json')?.version || '1.0.0',
  };

  res.json(healthData);
});

router.get('/detailed', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    // Simple DB ping
    let dbResponseTime = null;
    try {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      dbResponseTime = Date.now() - start;
    } catch (e) {
      dbResponseTime = -1;
    }

    const healthData = {
      status: dbState === 1 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          total: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
          free: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
          used: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        },
        cpu: os.cpus().length,
        loadAverage: os.loadavg(),
      },
      database: {
        state: dbStates[dbState],
        responseTime: dbResponseTime !== -1 ? `${dbResponseTime}ms` : 'error',
      },
    };

    const statusCode = dbState === 1 ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

module.exports = router;