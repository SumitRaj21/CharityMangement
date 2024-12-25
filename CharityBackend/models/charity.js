const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organisations');
const Charity = sequelize.define('Charity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization, 
            key: 'id', 
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
    },
    organizationName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'organization_name', // Custom database column name
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'project_name', 
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    projectOverview: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'project_overview',
    },
    goal: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    donationGoal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'donation_goal',
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending', // Default status
        field: 'approval_status',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports=Charity;


