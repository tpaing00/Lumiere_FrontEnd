const express = require("express");
const app = express();
const server = app.listen(process.env.PORT || 8080, ()=>console.log("Listening"));

app.use(express.static(__dirname + "public"));
