const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const UserToken = sequelize.define('UserToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'user_tokens', // Custom table name
    timestamps: true, // Automatically adds createdAt and updatedAt columns
  });

module.exports=UserToken;