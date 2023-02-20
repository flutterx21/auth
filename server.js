const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const users = [];
app.get("/user", (req, res) => {
  res.json(users);
});
app.post("/user", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.pass, 10);
    const user = { name: req.body.name, pass: hashedPass };
    users.push(user);
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.json(error);
  }
});

app.post("/user/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.json({ message: "User not found" });
  }

  try {
    if ((await bcrypt.compare(req.body.pass, user.pass)) == true) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(200).json({ message: "Wrong Password" });
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
