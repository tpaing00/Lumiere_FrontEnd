const express = require("express");
const path = require("path");
const app = express();

const server = app.listen(process.env.PORT || 3000, () => console.log("Listening"));

app.use(express.static(__dirname + "/public"));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
