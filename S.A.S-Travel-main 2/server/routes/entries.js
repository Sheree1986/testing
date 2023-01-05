const express = require("express");
const router = express.Router();
const { Entry } = require("../models/index");



router.use(express.json());
router.use(express.urlencoded({extended: true}))


// GET all Entries
router.get("/", async (req, res, next) => {
  try {
    const entries = await Entry.findAll();
    res.status(200).send({message: "Entries successfully fetched.", entries});
  } catch (error) {
    res.status(404).send({message: "Entries not found"});
    next(error);
  }
});

//GET one entry
router.get("/:id", async (req, res) => {
  try {
     const entries = await Entry.findByPk(req.params.id);
     res.status(200).send({message: "Entry successfully fetched", entries});
} catch (error) {
  res.status(404).send({message: "Entry not found"});

  next(error);
}
});


// update a single entry
router.put("/:id", async (req, res) => {
  try {
    const entries = await Entry.findByPk(req.params.id);
    await entries.update({
    authorId: req.body.authorId,
    title: req.body.title,
    content: req.body.content,
    location: req.body.location,
    image: req.body.image
   
  })
  res.status(200).send({message: "Entry successfully updated", entries});

} catch (error) {
  res.status(404).send({message: "Entry not updated successfully"});

  next(error);
}
});

// Create a single entry to the journal by id
router.post("/", async (req, res, next) => {
  try {
const entries = await Entry.create({
  authorId: req.body.authorId,
  title: req.body.title,
  content: req.body.content,
  location: req.body.location,
  image: req.body.image
})
res.status(200).send({message: "Entry successfully created", entries});
} catch (error) {
  res.status(404).send({message: "Entry not created successfully"})
next(error);
}
});

//Delete one entry
router.delete("/:id", async (req, res, next) => {
  try {
     const entries = await Entry.findByPk(req.params.id);
     const deleteEntry =await entries.destroy();
     res.status(200).send({message: "Entry successfully deleted", deleteEntry});;
} catch (error) {
  res.status(404).send({message: "Entry not deleted successfully"})
  next(error);
}
});
// const entry = await Entry.create(req.body);

// await entry.setAuthor(user);



// GET /entry/search
// router.get("/search", async (req, res, next) => {
//   try {
//     const entries = await Entry.findByTag(req.query.search);
//     res.send(entries);
//   } catch (error) {
//     next(error);
//   }
// });




module.exports = router;