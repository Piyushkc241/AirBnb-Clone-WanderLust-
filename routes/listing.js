const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const  validateListing=(req,res,next)=>{
  let result = listingSchema.validate(req.body);
  if(result.error){
    let errMsg=result.error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// READ (show) route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
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
  "/",validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
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
  "/:id",validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  })
);

module.exports=router;
