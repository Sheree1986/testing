const {sequelize, Sequelize} = require('../db')



const Entry = sequelize.define("entry", {
  
    title: {
      type: Sequelize.STRING,
      min: 3,
      max: 50,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      min: 3,
      max: 1024,
      allowNull: false
    },
    location: {
       type: Sequelize.TEXT,
       allowNull: false
    },
    image: {

        type: Sequelize.STRING,
        allowNull: false
      }

    }, {
      timestamps: false
  
    
  });

  
  Entry.findByUser = function(search) {
    return Entry.findAll({
      include: {
        model: User,
        where: {
          username: {
            [Sequelize.Op.substring]: search
          }
        }
      }
    })
  }
  
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      unique: true,
      min: 3,
      max: 30,
      allowNull: false
 
    },
    name: {
      type: Sequelize.STRING,
      min: 3,
      max: 30,
      allowNull: false
 
    },
    password: {
      type: Sequelize.STRING,
      min: 3,
      max: 40,
      allowNull: false
 
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      min: 3,
      max: 30,
      isEmail: true,
      allowNull: false
    },  
    role: {
      type: Sequelize.ENUM,
      values: ["user", "admin"],
      allowNull: false,
      defaultValue: "user",
    },  
  
  }, {
      timestamps: false
  });




  //This adds methods to 'Entry', such as '.setAuthor'. It also creates a foreign key attribute on the Page table pointing ot the User table
Entry.belongsTo(User, { as: "author" });
User.hasMany(Entry, {foreignKey: 'authorId'});



module.exports = {
    db: sequelize,
    User,
    Entry,
    sequelize,
    Sequelize
  
}

