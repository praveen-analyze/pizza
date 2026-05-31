const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/pizza")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server Started");
});