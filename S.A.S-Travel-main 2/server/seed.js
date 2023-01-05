

const {users, entries}  = require('./seedData.js');
const fs = require('fs').promises //helps us get access to promises when dealing with seeding data into our database
const {sequelize} = require('./db');
const { User, Entry } = require('./models');
const bcrypt = require("bcrypt");
;

const SALT_COUNT = 4;
let salt = bcrypt.genSaltSync(SALT_COUNT);

let seed = async () => {

    try { 
        // drop and recreate tables per model definitions
        await sequelize.sync({force:true});
        // users.map(user => user.password)
        
        for (let i = 0; i < users.length; i ++) {
            users[i].password = bcrypt.hashSync(users[i].password, salt)
            // console.log(users[i].password);
        }
        
        // // insert data
             // insert data
             const createdUsers = await Promise.all(users.map(user => User.create(user)));
             const createdEntries = await Promise.all(entries.map(entry => Entry.create(entry)));
             

             await Promise.all(createdUsers);
             await Promise.all(createdEntries)
     


        console.log("db populated!");
    } catch (error) {
        console.error(error);
 }
}
seed();

module.exports = {
    seed,
    salt,
}