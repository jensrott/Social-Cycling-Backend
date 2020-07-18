const express = require("express");
const cors = require("cors");
const volleyball = require("volleyball");
const path = require("path");
const passport = require("passport"); // TODO: facebook and google login
const chalk = require("chalk");

const app = express();

const port = 3001;
const connectDB = require("./server/api/v1/config/mongoDb");
const routes = require("./server/api/routes");

require("dotenv").config();

connectDB()
  .then(() => {
    console.log(chalk.greenBright("MongoDB Succesfully Connected!"));
  })
  .catch(err => {
    console.log(chalk.redBright(err));
  });

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders:
    "X-Auth-Token, Content-Type, Origin, Authorization, Content-Length, X-Requested-With, Content-Disposition, Access-Control-Allow-Origin, Access-Control-Allow-Methods"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "client/public")));

// Passport middelware
// app.use(passport.initialize());
// require("./server/api/v1/middlewares/passport")(passport);

app.use(volleyball);

app.get("/", (req, res) => {
  res.send("Visit /api/v1 for the api routes!");
});

app.use("", routes);

app.listen(port, () =>
  console.log(
    chalk.blueBright(`Web server started on: http://localhost:${port} `)
  )
);

// Export for testing purposes
module.exports = app;
