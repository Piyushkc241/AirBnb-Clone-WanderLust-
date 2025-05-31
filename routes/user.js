const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsyc");
const passport=require("passport");

//get route for  signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

//post route for signup
router.post("/signup",wrapAsync(async (req,res)=>{
    try{

        let {username,email, password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        // console.log(registeredUser);
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

//login get router
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

//login post router
router.post("/login",passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true
}),
async (req,res)=>{
    try{
        req.flash("success","Welcome back to Wanderlust!");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/login");
    }
});


module.exports=router;