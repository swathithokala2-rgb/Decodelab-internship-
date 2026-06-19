const express = require("express");
const app = express()
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`);
    
});
app.use('/home', (req, res) => {
  res.send("welcome to suby");
});