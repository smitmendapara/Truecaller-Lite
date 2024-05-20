const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const _constantUtil = require('./util/ATcontant.util');
const _loggerUtil = require('./util/ATlogger.util');

const userRoutes = require('./routes/ATuser.routes');

const { 
  DB_CONNECTED, DB_NOT_CONNECTED, DEFAULT_SERVER_PORT, SERVER_STARTED, SERVER_NOT_STARTED, BOOLEAN_TRUE,
  BOOLEAN_FALSE, ONE, PRODUCT_API_PREFIX, USER
} = _constantUtil;

const app = express();
app.use(express.json());

const port = process.env.PORT || DEFAULT_SERVER_PORT;
const API = process.env.API_PREFIX || PRODUCT_API_PREFIX;

app.use(`${API + USER}`, userRoutes);

// * check connection
async function checkConnection() {
  try {
    await prisma.$connect();
    _loggerUtil.info(`${DB_CONNECTED}`);
    return BOOLEAN_TRUE;
  }
  catch (error) {
    _loggerUtil.error(`${DB_NOT_CONNECTED + error}`);
    return BOOLEAN_FALSE;
  }
}

// * start server
async function startServer() {
  const isConnected = await checkConnection();
  if (isConnected) {
    app.listen(port, () => {
      _loggerUtil.info(`${SERVER_STARTED + port}`);
    });
  } 
  else {
    _loggerUtil.error(`${SERVER_NOT_STARTED}`);
    process.exit(ONE);
  }
}

startServer();