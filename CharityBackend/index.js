const express=require('express');
const mysqlPool=require('./config/db');
const cors=require('cors');

const dotenv = require('dotenv');
const app=express();
dotenv.config();
const PORT=8000;
app.use(cors());
app.use(express.json());
const bodyparser=require('body-parser');
const sequelize=require('./config/db');

const Organization=require('./models/organisations.js');


app.use(bodyparser.urlencoded({extended:true}));
// app.use('/admin',require('./routes/main'))

const Charity=require('./models/charity.js');
const User=require('./models/users.js');
const Donation=require('./models/donations.js');
const UserToken=require('./models/userToken.js');
const OrganizationToken=require('./models/organizationToken.js');
const Admin=require('./models/admin.js');
// UserToken.sync({ force: true });
// Donation.sync({force:true});
// OrganizationToken.sync({force:true});
// Admin.sync();




Organization.hasMany(Charity, { foreignKey: 'organizationId' });
Charity.belongsTo(Organization, { foreignKey: 'organizationId' });
User.hasMany(Donation, { foreignKey: 'userId' });
Donation.belongsTo(User, { foreignKey: 'userId' });

// Organization.hasMany(Donation, { foreignKey: 'organizationId' });
// Donation.belongsTo(Organization, { foreignKey: 'organizationId' });





app.use('/api/main',require('./routes/main.js'));
app.use('/api/admin',require('./routes/admin.js'));
app.use('/api/users',require('./routes/users.js'));
app.use('/api/organization',require('./routes/organization.js'));


async function initiate() {
    try {
     const res = await sequelize.sync();
     app.listen(PORT, ()=>{
        console.log("Server Started");
    })
    } catch (err) {
      console.error('Error during server initialization:', err);
      process.exit(1); 
    }
  }
  initiate();