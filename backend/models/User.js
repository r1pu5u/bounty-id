const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bugsReported: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'bugs_reported'
  },
  criticalFinds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'critical_finds'
  },
  totalRewards: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'total_rewards'
  }
}, {
  tableName: 'Users',
  timestamps: true,
  underscored: true
});

User.associate = (models) => {
  User.hasMany(models.Report, {
    foreignKey: 'reporterId',
    as: 'Reports'
  });
};

module.exports = User; 