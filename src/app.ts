import express from "express";
import { postRoute } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
