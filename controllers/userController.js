const { Markup } = require('telegraf');
const Conductor = require('../models/Conductor');

/**
 * Handle start command
 * @param {Object} ctx - Telegram context
 */
const handleStart = async (ctx) => {
  try {
    const { id: telegramId, first_name, last_name } = ctx.from;

    // Find or create conductor
    let conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor) {
      // Create new conductor
      conductor = new Conductor({
        telegramId: telegramId.toString(),
        firstName: first_name,
        lastName: last_name || '',
        currentState: 'START'
      });
      await conductor.save();
    }

    await ctx.reply(`Welcome, Conductor ${first_name}! I'm your CTU Conductor Assistant.`);
    return showMainMenu(ctx);
  } catch (error) {
    console.error('Error in handleStart:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

/**
 * Show help information
 * @param {Object} ctx - Telegram context
 */
const handleHelp = async (ctx) => {
  return ctx.reply(
    'CTU Conductor Bot Help:\n\n' +
    '/start - Start the bot\n' +
    '/menu - Show main menu\n' +
    '/reset - Reset the conversation\n\n' +
    'This bot helps you scan passenger tickets, view your route details, and generate daily reports.'
  );
};

/**
 * Show main menu
 * @param {Object} ctx - Telegram context
 */
const showMainMenu = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor) {
      return ctx.reply('Conductor not found. Please start over with /start');
    }

    // Update conductor state
    conductor.currentState = 'MAIN_MENU';
    await conductor.save();

    // Show main menu
    return ctx.reply(
      'Main Menu:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🎫 Scan Ticket', 'scan_ticket')],
        [Markup.button.callback('🚌 View Route Details', 'route_details')],
        [Markup.button.callback('📊 Generate Daily Report', 'daily_report')]
      ])
    );
  } catch (error) {
    console.error('Error in showMainMenu:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

/**
 * Reset conversation
 * @param {Object} ctx - Telegram context
 */
const resetConversation = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (conductor) {
      // Reset conductor state
      conductor.currentState = 'START';
      conductor.tempData = {};
      await conductor.save();
    }

    await ctx.reply('Bot has been reset. Starting over...');
    return handleStart(ctx);
  } catch (error) {
    console.error('Error in resetConversation:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

/**
 * Generate daily report
 * @param {Object} ctx - Telegram context
 */
const generateDailyReport = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor) {
      return ctx.reply('Conductor not found. Please start over with /start');
    }

    // Mock report data - in a real app, this would come from a database
    const reportData = {
      date: new Date().toLocaleDateString(),
      totalPassengers: 142,
      totalRevenue: 8520,
      ticketsScanned: 98,
      passesScanned: 44
    };

    // Display report
    let message = '📊 Daily Report:\n\n';
    message += `Date: ${reportData.date}\n`;
    message += `Total Passengers: ${reportData.totalPassengers}\n`;
    message += `Total Revenue: ₹${reportData.totalRevenue}\n`;
    message += `Tickets Scanned: ${reportData.ticketsScanned}\n`;
    message += `Passes Scanned: ${reportData.passesScanned}\n`;

    return ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('Back to Main Menu', 'back_to_main')]
      ])
    );
  } catch (error) {
    console.error('Error in generateDailyReport:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

module.exports = {
  handleStart,
  handleHelp,
  showMainMenu,
  resetConversation,
  generateDailyReport
};
