const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type : Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique: true,
    },
    phonenumber:{
        type: Sequelize.BIGINT(10),
        unique: true,
        allowNull:true,
    },
    password:{
        type: Sequelize.TEXT,
        allowNull:false 
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    profession: {
        type: Sequelize.STRING,
        allowNull: true,
    },

},

    {
        timestamps: false
    }
)
module.exports=User;