const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  employeeId: {
    type: String,
    default: ''
  },
  busId: {
    type: String,
    default: ''
  },
  routeId: {
    type: String,
    default: ''
  },
  currentState: {
    type: String,
    default: 'START'
  },
  tempData: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conductor', conductorSchema);

