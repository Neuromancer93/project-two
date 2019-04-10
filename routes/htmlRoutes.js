const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = app => {
  // Home page
  app.get("/", isAuthenticated, (req, res) => {
<<<<<<< HEAD
    db.Users.findOne({
      where: {
        id: req.user.id
      }
      // ,
      // include: [db.LongTerms]
    }).then(dbUser => {
      // // console.log(dbUser);
      // console.log(dbUser.LongTerms);
      res.render("home", { user: dbUser});

      // WORK ON THIS CODE HERE ^^^^ HANNNAHHHHH
    });
=======
  db.Users.findOne({
    where: {
      id: req.user.id
    },
    include: [db.LongTerms]
  }).then(dbUser => {
    // console.log(dbUser);
    console.log(dbUser.LongTerms)
    res.render("home", { user: dbUser, tasks: dbUser.LongTerms });
>>>>>>> 301089e326a22c4c1f91650f93cd18932871efd3
  });

  // Load signup page
  app.get("/signup", (req, res) => res.render("signup"));

  // Load login page
  app.get("/login", (req, res) => res.render("login"));

  // Load profile page
  app.get("/profile", isAuthenticated, (req, res) => {
    db.Users.findOne({
      where: {
        id: req.user.id
      }
      // ,
      // include: [db.LongTerms]
    }).then(dbUser => {
      res.render("profile", { user: dbUser });
    });
  });

  // Get form for creating a long-term goal
  app.get("/long-term", isAuthenticated, (req, res) => {
    res.render("long-term");
  });

  // Get form for updating a long-term goal
  app.get("/long-term/:id", isAuthenticated, (req, res) => {
    db.LongTerms.findOne({ where: { id: req.params.id } }).then(longTerm => {
      res.render("long-term", {
        longterm: longTerm
      });
    });
  });

  // Useful links for self-actualizers
  app.get("/resources", (req, res) => res.render("resources"));

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => res.render("404"));
};
