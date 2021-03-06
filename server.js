require("dotenv").config();
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const moment = require("moment");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");

// Requiring passport as we've configured it
const passport = require("./config/passport");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Morgan will any HTTP request to the terminal
app.use(morgan("dev"));

// We need to use sessions to keep track of our user's login statuss
app.use(
  session({
    secret: process.env.SERVER_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    showStatus: function (bool) {
      return JSON.parse(bool) ? "Complete" : "In Progress";
    },
    showDate: function (date) {
      return moment(date).format('YYYY-MM-DD');
    }
  },
  defaultLayout: "main"
});

// Handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(
      `App is running on PORT: ${PORT}. Go to http://localhost:${PORT}`
    );
  });
});

module.exports = app;
