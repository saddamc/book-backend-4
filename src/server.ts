import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import config from "./config";
import routes from "./modules/routes";

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://book-4-woad.vercel.app", "http://localhost:5000"],
  })
);
app.use(express.json());

// route
app.use(routes);

app.get("/", (req, res) => {
  res.send("✅ Start Library Management System");
});

app.listen(config.port, () => {
  console.log(`✅ Server Running on port ${5000}`);
});

async function server() {
  try {
    // console.log(config);
    await mongoose.connect(config.database_url!);

    console.log(`✅ Connected to MongoDB using Mongoose`);
  } catch (error) {
    console.error(`server error ${server}`);
  }
}

server();
