const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");

const dotenv = require("dotenv");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// http server for socket
const server = http.createServer(app);

// Socket.io event handling
initializeSocket(server);

// connecting database
connectDB()
  .then(() => {
    console.log("Connected to Database");
    server.listen(5000, () => console.log("Server is running on port 5000..."));
  })
  .catch((err) => {
    console.log(`Error while connecting to database ${err}`);
  });
