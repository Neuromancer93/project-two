const db = require(`../models`);
const passport = require(`../config/passport`);
const isAuthenticated = require(`../config/middleware/isAuthenticated`);

module.exports = app => {
  // USER ROUTES

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post(`/api/signup`, (req, res) => {
    console.log(req.body);
    db.Users.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, `/api/login`);
      })
      .catch(err => {
        res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out
  app.get(`/logout`, (req, res) => {
    req.logout();
    res.redirect(`/`);
  });

  // Update their profile (created with signup)
  app.put("/api/profile", isAuthenticated, (req, res) => {
    db.Users.update(
      {
        name: req.body.name,
        nouns: req.body.nouns,
        adjectives: req.body.adjectives,
        verbs: req.body.verbs
      },
      { where: { id: req.user.id } }
    ).then(profile => {
      res.json(profile);
    });
  });

  // LONG-TERM GOAL ROUTES
  // Get all long term goals
  app.get(`/api/long-term`, isAuthenticated, (req, res) => {
    db.LongTerms.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(longTermGoals => {
      res.json(longTermGoals);
    });
  });

  // Get a specific long term goal
  app.get(`/api/long-term/:nodeId`, isAuthenticated, (req, res) => {
    db.LongTerms.findOne({
      where: {
        UserId: req.user.id,
        nodeId: req.params.nodeId
      }
    }).then(longTermGoal => {
      res.json(longTermGoal);
    });
  });

  // Create a new long-term goal
  app.post(`/api/long-term`, isAuthenticated, (req, res) => {
    db.LongTerms.create({
      UserId: req.user.id,
      title: req.body.title,
      date: req.body.completedBy,
      description: req.body.description,
      details: req.body.details,
      category: req.body.category,
      finished: false
    }).then(longTermGoal => {
      res.json(longTermGoal);
    });
  });

  // Update an existing long-term goal
  app.put(`/api/long-term/:nodeId`, isAuthenticated, (req, res) => {
    db.LongTerms.update({
      UserId: req.user.id,
      title: req.body.title,
      date: req.body.completedBy,
      description: req.body.description,
      category: req.body.category,
      finished: req.body.finished
    }, { where: { nodeId: req.params.nodeId } }).then(longTermGoal => {
      res.json(longTermGoal);
    });
  });

  // Delete a long-term goal by id
  app.delete(`/api/long-term/:nodeId`, isAuthenticated, (req, res) => {
    db.LongTerms.destroy({ where: { id: req.params.nodeId } }).then(destroyed => {
      res.json(destroyed);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post(`/api/login`, passport.authenticate(`local`), (req, res) => {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json(`/`);
  });
};
