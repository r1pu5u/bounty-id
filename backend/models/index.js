const User = require('./User');
const Program = require('./Program');
const Report = require('./Report');

// Initialize associations
User.associate({ Report });
Program.associate({ Report });
Report.associate({ User, Program });

module.exports = {
  User,
  Program,
  Report
}; 