const express = require("express");
const router = express.Router();
require("dotenv").config(".env");
const {User, Entry} = require("../models/index")
const {userReg, userLogin, userAuth, serializeUser, checkRole } = require("../utils/Auth");


//user registration route 
router.post("/register-user", async (req, res) => {
  
  await userReg(req.body, "user", res);


});

// Admin Registration route

router.post("/register-admin",  async (req, res, next) => {
  try {
    await userReg(req.body, "admin", res);
  
      } catch  (error) {
        console.log(error);
        next(error);
      }
  
  });

  // user login route

router.post("/login-user",  async (req, res, next) => {
  try {
    await userLogin(req.body, "user", res);
  
      } catch  (error) {
        console.log(error);
        next(error);
      }
  
  });
    // admin login route

router.post("/login-admin", async (req, res, next) => {
  try {
    await userLogin(req.body, "admin", res);
  
      } catch  (error) {
        console.log(error);
        next(error);
      }
  
  });
  // userAuth, checkRole(["users"]),

router.get("/profile", userAuth,  async (req, res, next) => {
 try { console.log(req)
  // console.log(req.body)

console.log(req.user);
return res.status(201).send(req.user);
} catch  (error) {
  console.log(error);
  next(error);


}
})
//user protected route
router.get("/user-protected",userAuth, checkRole(["admin"]), async (req, res, next) => {})
// admin protected route 
router.get("/admin-protected",userAuth, checkRole(["admin"]), async (req, res, next) => {})



//GET all users
router.get("/", async (req, res, next) => {
  try {
    let entries = await User.findAll();
    res.status(200).send(entries);
} catch (error) {
  res.status(403).send("Access denied. Not authorized User..")
    next(error);
  }
});



// GET one user
router.get("/:id", async (req, res, next) => {
  
    const entries = await User.findByPk(req.params.id, {
        include: [{model: Entry}]
    });
    if(!entries) {
        res.status(404).send("Entries not found..");
        next();
      } else {
        res.status(200).send(entries);
      }
    } );

  // this endpoint GET all entries posted by a user (user id in req.params) 
//https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
router.get("/:id/entries", async (req, res, next) => {

  try { const postedEntries = await User.findByPk(req.params.id, {
      include: {
      model: Entry,
      required: true
}})


  res.status(200).send(postedEntries);
  
} catch (error) {
  res.status(404).send("Entries are not found for this user..")
    next(error);
  }
});


// update user post by id
  router.put("/:id/entries/:entriesId", async (req, res, next) => {

try {const users = await User.findByPk(req.params.id);
     const entries = await Entry.findByPk(req.params.entriesId);

  users.addEntry(entries);
  const userEntries = await users.getEntries();
  res.status(200).send(userEntries);

} catch (error) {
  res.status(403).send("User does not have permission to update...")
  next(error);
}
});

  // create post by a user via id
router.post("/:id/entries", async (req, res, next) => {

  try {const users = await User.findByPk(req.params.id);
       const entries = await Entry.findByPk(req.params.entriesId);
  
    users.addEntry(entries);
    const userEntries = await users.getEntries();
    res.status(200).send(userEntries);
  
  } catch (error) {
    res.status(403).send("User need to login to post..")
    next(error);
  }
  });
  

// Update a single user by id
router.put("/:id", async (req, res, next) => {
    try {
      await User.update(req.body, {
        where: { id: req.params.id },
      });
      let putUsers = await User.findAll();
      res.status(200).send({message: "User successfully updated", putUsers});
     
    } catch (error) {
      res.status(404).send("User not found")
      next(error);
    }
  });
  
  
  
  
// Delete a single user by id
  router.delete("/:id", async (req, res, next) => {
    try {
      const entries = await User.findByPk(req.params.id);
      const deleteUsers = await entries.destroy();
      res.status(200).send({message: "User successfully deleted", deleteUsers});
      console.log("user")
    } catch (error) {
      res.status(404).send("User not found")
      next(error);
    } 
  })


module.exports = router;