const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIN, isReviewAuthor}=require("../middleware.js");


// reviews post route
router.post("/",isLoggedIN,validateReview, wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview= new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review added");
  res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIN,isReviewAuthor,wrapAsync( async (req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports=router;