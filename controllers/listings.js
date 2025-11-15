const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.renderNewForm=(req, res) => {
  
    //moved to middleware.js
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be loggeg in to create listing");
    //     return res.redirect("/login");
    // }
  
    res.render("listings/new.ejs");
  }


  module.exports.showListings=async (req, res) => {
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
  }

  module.exports.createListings=async (req, res, next) => {
      let url=req.file.path;
      let filename=req.file.filename;

      const newlisting = new Listing(req.body.listing);
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      await newlisting.save();
      req.flash("success","New listing created!");
      res.redirect("/listings");
    }

    module.exports.editListings=async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing){
          
          req.flash("error","Listing doesn't exist");
          res.redirect("/listings");
        }
        else{
          res.render("listings/edit.ejs", { listing });
        }
      }

      module.exports.updateListings=async (req, res) => {
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
        }

        module.exports.deleteListings=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  }