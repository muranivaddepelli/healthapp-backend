const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);


app.get("/test", (req,res)=>{
 res.send("API Working");
});

module.exports = app;