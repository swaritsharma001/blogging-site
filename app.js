import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import router from "./routes/blogs.js"
import authRouter from "./routes/user.js"
import session from "express-session";
import cookie from "cookie-parser"
const __dirname = path.resolve();
const app = express();
app.use(cookie())
app.use(express.static(path.join(__dirname, "dist")))
import ConnectToDb from "./middle/connect.js"
// Enable CORS
//Wake up
async function warmUp(){
  await axios.get("https://api.worldtoday.me")
}
setInterval(()=>{
  warmUp()
}, 260000)
//session
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
const allowedDomains = ["https://techinword.tech", "https://www.techinword.tech", "https://380d8e6b-3d5d-4fae-936f-a8fc5ce44e0c-00-1o7twql8wagp6.pike.replit.dev"]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedDomains.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
    },
  credentials: true
}));
ConnectToDb()
// Middleware to handle JSON requests
app.use(express.json());
app.use("/blog", router)
app.use("/api/auth", authRouter)

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
