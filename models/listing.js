const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema= new Schema({
    title :{
        type:String,
        required:true,
    },
    description : String,
    image:{
        type:String,
        default:"https://imgs.search.brave.com/rytQUN8eSWCohQXH27A8ySWfV-f0Zk_4dnKuy6lEu5c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTEw/MzIyODY0L3Bob3Rv/L3JlZC1zdW5zZXQu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVhTTUtDQlFUZ1Zm/bGxCSFJNY0VWVHlw/QnNQSkJ4Uk9iMGZn/Y1p4VXVTakU9",
        set:(v)=>v === ""? "https://imgs.search.brave.com/rytQUN8eSWCohQXH27A8ySWfV-f0Zk_4dnKuy6lEu5c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTEw/MzIyODY0L3Bob3Rv/L3JlZC1zdW5zZXQu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVhTTUtDQlFUZ1Zm/bGxCSFJNY0VWVHlw/QnNQSkJ4Uk9iMGZn/Y1p4VXVTakU9" :v,
    },
    price:Number,
    location: String,
    country : String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){

        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;