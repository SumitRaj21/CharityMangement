const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const OrganizationToken = sequelize.define('OrganizationToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    organizationid: {
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
    tableName: 'organization_tokens', // Custom table name
    timestamps: true, // Automatically adds createdAt and updatedAt columns
  });

module.exports=OrganizationToken;