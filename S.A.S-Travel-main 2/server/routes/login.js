const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const express = require("express");
const generateAuthToken = require("../auth/generateAuthToken");
// const { auth,isUser, isAdmin } = require("../middleware/auth");
const router = express.Router();


// user login
router.post("/", async (req, res) => {
 

    const {username, password} = req.body;
    const regUser = await User.findOne({where: {username}});
   
    const isMatch = await bcrypt.compareSync(password, regUser.password);
    console.log(password)
    console.log(regUser.password)
    
    if(isMatch){

    const token = generateAuthToken(isMatch);
    res.status(200).send({message: "Successful Login", token});

    } else {
 return res.status(400).send("Invalid username or password...");

} 
}
);


// admin login route
router.post("/register-admin", async (req, res, next) => {})
//user profiled
router.get("/profile", async (req, res, next) => {})
//user protected route
router.post("/user-protected", async (req, res, next) => {})
// admin protected route 
router.post("/admin-protected", async (req, res, next) => {})



module.exports = router;