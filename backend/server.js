const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const orderRoutes = require("./routes/orderRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// Root Route
app.get("/", (req, res) => {
  res.send("Pizza API is running 🚀");
});
app.use("/api/orders", orderRoutes);
app.use("/api/pizzas", pizzaRoutes);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});