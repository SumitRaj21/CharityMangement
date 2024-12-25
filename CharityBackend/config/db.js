const mysql=require("mysql2");
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('charity', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql',
    logging:false
  })

  module.exports = sequelize;