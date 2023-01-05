const { salt } = require("../seed");
const bcrypt = require("bcrypt");
const generateAuthToken = require("../auth/generateAuthToken");
const { User } = require("../models/index");
const passport = require("passport")


// function to register user (both admin and user)


const userReg = async (userDets, role, res) => {
    try {
    // Check if username is available 
    let usernameAvailable = await validateUsername(userDets.username);
    if(!usernameAvailable) {
       return res.status(400).send({Message: "Username is already taken...."});
       
    }
    // validate the email
    let emailAvailable =  validateEmail(userDets.email);
    if(!emailAvailable) {
     return res.status(400).send({Message: "Email is already registered"})
    

    };
// What we want to do now is, we want to create a user based on the data passed in, except, we want to hash the password as it goes into the database!
// We can accomplish that using Bcrypt: 
    hashedPW = bcrypt.hashSync(userDets.password, salt);
    console.log("hashedPW: ", hashedPW);

    // Now we can create the user with these references: 
    let createdUser = await new User({...userDets, password: hashedPW, role});
    await createdUser.save();
    
    const results = generateAuthToken(createdUser);

  res.status(201).send({message: "User Successfully Registered", results});


    } catch (error) {
       return res.status(500).send({Message: "unable to create a user."})
     
    }
};
const userLogin = async (userInfo, role, res) => {
    //object deconstruction 
    let {username, password} = userInfo;
    const user = await User.findOne({where: {username }});
    if(!user) {
        return res.status(400).send({Message: " Username is not found. Invalid login username or password"});
    }
    if(user.role != role) {
        return res.status(400).send({Message: " incorrect role. Login in from the correct user portal"});
    }
    // check that the password match
    let isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        const results = generateAuthToken(isMatch);
        res.status(200).send({message: " Successful Login", results});
    } else {
        return res.status(400).send({Message: "incorrect password"});   
    }

}
    const validateUsername = async username => {
        let user = await User.findOne({where: { username} }) ;
        return user ? false : true;

    };

    const userAuth = passport.authenticate("jwt", { session: false });

    const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
      ? res.status(401).send("Unauthorized")
      : next();
  
    const validateEmail = async email => {
        let user = await User.findOne({email})
        return user ? false : true;
       
    };
   
    // const serializeUser = async username =>  {
    //   {
    //         let user = await User.findOne({Where: { username}}) ;

    //     return {
    //         username: user.username,
    //         id: user.id,
    //         name: user.name,
    //         email: user.email
        
    //     }
    //     };
    //   };
    // const serializeUser = user => {
    //     return {
    //       username: user.username,
    //       email: user,
    //       name: user,
    //       id: user
    //     };
    //   };

    module.exports = {
        userAuth,
        userReg,
        userLogin,
        // serializeUser,
        checkRole
    }
  