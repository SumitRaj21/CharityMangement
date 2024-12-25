const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Organization = require('./organisations');
const User=require('./users');

// Define the Donations model
const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
    },
    organizationName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'organization_name', 
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'project_name', 
    },
    donationAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'donation_amount',
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_id',
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'order_id',
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'order_status',
        defaultValue:'PENDING',
    },
}, {

    timestamps: true,
});

// Hooks to automatically set organizationName and projectName from Organization when a donation is created or updated
// Donation.beforeCreate(async (donation, options) => {
//     const organization = await Organization.findByPk(donation.organizationId);
//     if (organization) {
//         donation.organizationName = organization.name;
//         donation.projectName = organization.projectName;
//     }
// });

// Donation.beforeUpdate(async (donation, options) => {
//     const organization = await Organization.findByPk(donation.organizationId);
//     if (organization) {
//         donation.organizationName = organization.name;
//         donation.projectName = organization.projectName;
//     }
// });

// Establish associations
// User.hasMany(Donation, { foreignKey: 'userId' });
// Donation.belongsTo(User, { foreignKey: 'userId' });

// Organization.hasMany(Donation, { foreignKey: 'organizationId' });
// Donation.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports=Donation;

