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
.catch(err => console.error('MongoDB connection error:', err));

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
bot.use(session());

// Command handlers
bot.start(userController.handleStart);
bot.help(userController.handleHelp);
bot.command('menu', userController.showMainMenu);
bot.command('reset', userController.resetConversation);
bot.command('scan_ticket', ticketController.startTicketScan);
bot.action('route_details', ticketController.showRouteDetails);
bot.action('daily_report', userController.generateDailyReport);
bot.action('back_to_main', userController.showMainMenu);
bot.on('text', ticketController.handleTicketText);

// Configure express server for webhook
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'conductor-bot'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Conductor Bot Server is running!');
});

// Function to start the bot
const startBot = async () => {
  try {
    console.log('Attempting to start bot...');
    await bot.launch();
    console.log('Bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    console.log('Retrying in 10 seconds...');
    setTimeout(startBot, 10000);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startBot();
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));