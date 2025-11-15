const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIN, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


// reviews post route
router.post("/",isLoggedIN,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIN,isReviewAuthor,wrapAsync( reviewController.destroyReview));

module.exports=router;