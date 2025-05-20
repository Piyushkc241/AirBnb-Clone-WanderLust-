const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then((res) => { 
    console.log("connection successsful");
  })
  .catch((err) => {
    console.log("an error occured", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

// for all other errors
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, (req, res) => {
  console.log("listening");
});
