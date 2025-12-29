import express from "express";
import { postRoute } from "./modules/Post/post.route";

const app = express();

app.use(express.json());

app.use("/api/v1/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
