import express from "express";
import dotenv, { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import fileUpload from "express-fileupload";

const app = express();
configDotenv();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.get('/set-cookie', (req, res) => {
  // Set cookie with correct domain
  res.cookie('myCookie', 'cookieValue', {
    domain: 'https://bloglane.onrender.com', // Replace 'example.com' with your actual domain
    httpOnly: true,
    // Other cookie options...
  });

  res.send('Cookie set successfully');
});

// Route handler to read cookie
app.get('/read-cookie', (req, res) => {
  // Read the cookie
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    res.send(`Cookie value: ${myCookie}`);
  } else {
    res.send('Cookie not found');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

dbConnection();

app.use(errorMiddleware);

export default app;
