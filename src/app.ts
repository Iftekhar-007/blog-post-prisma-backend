import express from "express";
import { postRoute } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
