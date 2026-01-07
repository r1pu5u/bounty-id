const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
  method: { type: DataTypes.ENUM('bank', 'paypal'), allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' },
  note: { type: DataTypes.TEXT, allowNull: true },
  processedAt: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'Payments',
  timestamps: true,
  underscored: true
});

Payment.associate = (models) => {
  Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
};

module.exports = Payment;
