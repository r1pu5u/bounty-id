const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false
  },
  responseTime: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'responseTime'
  },
  payouts: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      Low: "Rp200.000",
      Medium: "Rp1.000.000",
      High: "Rp2.500.000",
      Critical: "Rp5.000.000"
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'Programs',
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Program.associate = (models) => {
  Program.hasMany(models.Report, {
    foreignKey: 'programId',
    as: 'Reports'
  });
};

module.exports = Program; 