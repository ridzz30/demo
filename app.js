const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");

const app = express();
app.use(bodyParser.json());

// Create a new user
app.post("/api/users", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const existingUser = auth.findUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }
  const newUser = auth.createUser(username, password);
  res.status(201).json(newUser);
});

// User login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = auth.authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  const token = auth.generateAuthToken(user);
  res.json({ token });
});

// Protected route
app.get("/api/protected", (req, res) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.json({ message: "Protected data" });
  });
});

// Update a user's password
app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "New password is required" });
  }

  const user = auth.findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = bcrypt.hashSync(password, 10);
  auth.updateUser(user);
  res.json({ message: "Password updated successfully" });
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = auth.findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  auth.deleteUser(userId);
  res.json({ message: "User deleted successfully" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
