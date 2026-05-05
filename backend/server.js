require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const path = require("path");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

// CONNECT DATABASE
connectDB();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ SERVE UPLOADED FILES
// app.use("/uploads", express.static("uploads"));

/* -------------------- ROOT TEST -------------------- */

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/api", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- PRODUCTION BUILD -------------------- */

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
//   });
// }

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
