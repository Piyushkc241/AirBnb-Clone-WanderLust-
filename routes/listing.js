const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIN,isOwner,validateListing} = require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(
  wrapAsync(listingController.index)
)
.post(
   isLoggedIN ,validateListing,
   upload.single("listing[image]"),
  wrapAsync(listingController.createListings)
);


// render new form route
router.get("/new", isLoggedIN,listingController.renderNewForm);


router.route("/:id")
.get(
  
  wrapAsync(listingController.showListings)
)
.patch(
  isLoggedIN,isOwner,validateListing,
  wrapAsync(listingController.updateListings)
)
.delete(
  isLoggedIN,isOwner,
  wrapAsync(listingController.deleteListings)
);

// // home route
// router.get("/home", (req, res) => {
//   res.render("listings/home.ejs");
// });


// edit route
router.get(
  "/:id/edit",isLoggedIN,isOwner,
  wrapAsync(listingController.editListings)
);

module.exports=router;
