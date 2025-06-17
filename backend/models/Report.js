const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Programs',
      key: 'id'
    }
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  poc: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachment: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('attachment');
      if (!rawValue) return null;
      // Hapus 'uploads/' dari awal path jika ada
      return rawValue.replace(/^uploads\//, '');
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Review', 'Accepted', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'Reports',
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Report.associate = (models) => {
  Report.belongsTo(models.Program, {
    foreignKey: 'programId',
    as: 'Program'
  });
  Report.belongsTo(models.User, {
    foreignKey: 'reporterId',
    as: 'Reporter'
  });
};

module.exports = Report; 