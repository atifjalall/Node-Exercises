const express = require("express");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT;
const app = express();
app.use(express.json());

const users = [
  {
    id: 1,
    name: "Atif Jalal",
    email: "atifjalal@gmail.com",
  },
  {
    id: 2,
    name: "Alina",
    email: "Alina@gmail.com",
  },
];
//display all users
app.get("/users", (req, res) => {
  res.send(users);
});
//get single user information
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  !user ? res.status(404).send("user not found") : res.send(user);
});

//add new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).send("all field are required");
  } else if (users.some((user) => user.email === email)) {
    res.status(400).send("User already exists");
  }

  const user = {
    id: users.length,
    name: name,
    email: email,
  };

  users.push(user);
  res.send(user);
});

//update user details
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;

  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).send("user not found");
  }

  if (!name || !email) {
    res.status(400).send("All field are required!");
  } else {
    user.name = name;
    user.email = email;
    res.send(user);
  }
});

//delete user
app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.id === parseInt(req.params.id)
  );
  if (userIndex === -1) {
    res.status(404).send("User not found");
  } else {
    users.splice(userIndex, 1);
    res.send("user deleted");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
