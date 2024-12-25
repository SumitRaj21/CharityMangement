const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Organization = sequelize.define('Organization', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password:{
            type: Sequelize.TEXT,
            allowNull:false 
        },
    phonenumber:{
            type: Sequelize.BIGINT(10),
            unique: true,
            allowNull:true,
        },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  module.exports=Organization;



