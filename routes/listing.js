const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIN,isOwner,validateListing} = require("../middleware.js");

// home route
router.get("/home", (req, res) => {
  res.render("listings/home.ejs");
});

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New and Create route
router.get("/new", isLoggedIN,(req, res) => {

  //moved to middleware.js
  // if(!req.isAuthenticated()){
  //     req.flash("error","you must be loggeg in to create listing");
  //     return res.redirect("/login");
  // }

  res.render("listings/new.ejs");
});

// READ (show) route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path:"reviews",populate:{
      path:"author"
      }
    }).populate("owner");
    if(!listing){
      req.flash("error","listing you requested doesn't exist");
      res.redirect("/listings");
    }
    else{
      res.render("listings/show.ejs", { listing });
    }
  })
);

// create route
router.post(
  "/", isLoggedIN ,validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",isLoggedIN,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      
      req.flash("error","Listing doesn't exist");
      res.redirect("/listings");
    }
    else{
      res.render("listings/edit.ejs", { listing });
    }
  })
);

// update route
router.patch(
  "/:id",isLoggedIN,isOwner,validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    //moved to middleware
    // let listing=Listing.findById(id);
    // if(currUser && !currUser._id.equals(listing.owner._id)){
    //   req.flash("error","you aree not the owner of this listing");
    //   return res.redirect(`/listings/${id}`);
    // }
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",isLoggedIN,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  })
);

module.exports=router;
