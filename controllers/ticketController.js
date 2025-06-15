const { Markup } = require('telegraf');
const Conductor = require('../models/Conductor');
const Ticket = require('../models/Ticket');

/**
 * Start ticket scanning
 * @param {Object} ctx - Telegram context
 */
const startTicketScan = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor) {
      return ctx.reply('Conductor not found. Please start over with /start');
    }

    // Update conductor state
    conductor.currentState = 'SCANNING_TICKET';
    await conductor.save();

    // Prompt for ticket code
    return ctx.reply(
      'Please enter the ticket code or QR code data:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Cancel', 'back_to_main')]
      ])
    );
  } catch (error) {
    console.error('Error in startTicketScan:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

/**
 * Handle ticket text input
 * @param {Object} ctx - Telegram context
 */
const handleTicketText = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;
    const ticketCode = ctx.message.text;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor || conductor.currentState !== 'SCANNING_TICKET') {
      // Ignore text messages if not in scanning state
      return;
    }

    // Mock ticket validation - in a real app, this would check against a database
    const ticketValid = ticketCode.startsWith('CTU') && ticketCode.length === 10;

    if (ticketValid) {
      // Mock ticket data - in a real app, this would come from a database
      const ticketData = {
        code: ticketCode,
        passengerName: 'John Doe',
        source: 'Sector 17',
        destination: 'PGI Hospital',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        price: 30
      };

      // Update conductor state
      conductor.currentState = 'MAIN_MENU';
      await conductor.save();

      // Display ticket details
      let message = '✅ Ticket Valid!\n\n';
      message += `Ticket Code: ${ticketData.code}\n`;
      message += `Passenger: ${ticketData.passengerName}\n`;
      message += `From: ${ticketData.source}\n`;
      message += `To: ${ticketData.destination}\n`;
      message += `Date: ${ticketData.date}\n`;
      message += `Time: ${ticketData.time}\n`;
      message += `Price: ₹${ticketData.price}\n`;

      return ctx.reply(
        message,
        Markup.inlineKeyboard([
          [Markup.button.callback('Scan Another Ticket', 'scan_ticket')],
          [Markup.button.callback('Back to Main Menu', 'back_to_main')]
        ])
      );
    } else {
      // Invalid ticket
      return ctx.reply(
        '❌ Invalid Ticket!\n\nThis ticket code is not valid or has already been used.',
        Markup.inlineKeyboard([
          [Markup.button.callback('Try Again', 'scan_ticket')],
          [Markup.button.callback('Back to Main Menu', 'back_to_main')]
        ])
      );
    }
  } catch (error) {
    console.error('Error in handleTicketText:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

/**
 * Show route details
 * @param {Object} ctx - Telegram context
 */
const showRouteDetails = async (ctx) => {
  try {
    const { id: telegramId } = ctx.from;

    // Get conductor
    const conductor = await Conductor.findOne({ telegramId: telegramId.toString() });

    if (!conductor) {
      return ctx.reply('Conductor not found. Please start over with /start');
    }

    // Mock route details - in a real app, this would come from a database
    const routeDetails = {
      routeNumber: 'CTU-42',
      startPoint: 'Sector 17 Bus Stand',
      endPoint: 'PGI Hospital',
      stops: [
        'Sector 17', 'Sector 16', 'Sector 15', 'Sector 11', 'PGI Hospital'
      ],
      departureTime: '08:00 AM',
      arrivalTime: '09:30 AM'
    };

    // Display route details
    let message = '🚌 Your Route Details:\n\n';
    message += `Route Number: ${routeDetails.routeNumber}\n`;
    message += `From: ${routeDetails.startPoint}\n`;
    message += `To: ${routeDetails.endPoint}\n`;
    message += `Departure: ${routeDetails.departureTime}\n`;
    message += `Arrival: ${routeDetails.arrivalTime}\n\n`;
    message += 'Stops:\n';

    routeDetails.stops.forEach((stop, index) => {
      message += `${index + 1}. ${stop}\n`;
    });

    return ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('Back to Main Menu', 'back_to_main')]
      ])
    );
  } catch (error) {
    console.error('Error in showRouteDetails:', error);
    return ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

module.exports = {
  startTicketScan,
  handleTicketText,
  showRouteDetails
};
