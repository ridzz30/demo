const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");

const usersFilePath = "./data/users.json";

function readUsers() {
  const usersData = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(usersData);
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}

function createUser(username, password) {
  const users = readUsers();
  const newUser = {
    id: Date.now().toString(),
    username,
    password: bcrypt.hashSync(password, 10),
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

function findUserByUsername(username) {
  const users = readUsers();
  return users.find((user) => user.username === username);
}

function authenticateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }
  return user;
}

function generateAuthToken(user) {
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
}

module.exports = {
  createUser,
  findUserByUsername,
  authenticateUser,
  generateAuthToken,
};
