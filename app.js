require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const express = require('express');
const mongoose = require('mongoose');

// Import controllers
const userController = require('./controllers/userController');
const ticketController = require('./controllers/ticketController');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_ Middleware
bot.use(session());

// Command handlers
bot.start(userController.handleController.handleHelp);
bot.command('menu', userController..command('reset', userController.resetCon Action handlers
bot.action('scan_ticket', ticketController.startTick.action('view_route', userController.showRouteDetailsaction('daily_report', userController.generateDailyReportback_to_main', userController.showMainMenu); scanning
bot.on('text', ticketController.handleTick server for webhook PORT = process.env.PORT || (express.json check endpoint
app.get('/', (req, res) => {
  res.send('Conductor Bot Server is running!');
});
const startBot = async () => {
   {
    console.log('Attempting to start bot.. bot.launch();log('Bot started successfully'); (error) {error('Error starting bot:', error);
    .log('Retrying in 10 seconds...');startBot, 10000);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startBot();
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
