// models/Report.js
const { DataTypes } = require('sequelize');
const { sequelize }  = require('../config/db');

const Report = sequelize.define('Report', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  programId:   { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Programs', key: 'id' } },
  reporterId:  { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users',    key: 'id' } },

  title:       { type: DataTypes.STRING,  allowNull: false },
  severity:    { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), allowNull: false },
  description: { type: DataTypes.TEXT,    allowNull: false },
  steps:       { type: DataTypes.TEXT,    allowNull: false },
  poc:         { type: DataTypes.STRING,  allowNull: true  },

  attachment: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const raw = this.getDataValue('attachment');
      return raw ? raw.replace(/^uploads\//, '') : null;
    }
  },

  reward:           { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  verificationNote: { type: DataTypes.TEXT,           allowNull: true  },  // ⇠ ditambah
  verifiedAt:       { type: DataTypes.DATE,           allowNull: true  },

  status: {
    type: DataTypes.ENUM('Pending', 'In Review', 'Accepted', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  tableName : 'Reports',
  timestamps: true,
  createdAt : 'createdAt',
  updatedAt : 'updatedAt'
});

/* asosiasi */
Report.associate = (models) => {
  Report.belongsTo(models.Program, { foreignKey: 'programId',  as: 'Program'  });
  Report.belongsTo(models.User,    { foreignKey: 'reporterId', as: 'Reporter' });
};

module.exports = Report;
