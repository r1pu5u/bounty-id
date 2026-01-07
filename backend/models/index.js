const User = require('./User');
const Program = require('./Program');
const Report = require('./Report');
const Payment = require('./Payment');

// Initialize associations
User.associate({ Report, Payment });
Program.associate({ Report });
Report.associate({ User, Program });
Payment.associate({ User });

module.exports = {
  User,
  Program,
  Report,
  Payment
}; 