const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      len: [4, 20], 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'admins', 
  timestamps: false, 
});

module.exports=Admin;
