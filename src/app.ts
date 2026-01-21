import express from "express";
import { postRoute } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRoute } from "./modules/Comments/comment.route";
import errorHandler from "./middleware/globalError";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// ! post routes
app.use("/api/v1/posts", postRoute);

// ! comment routes
app.use("/api/v1/comments", commentRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(notFound);

app.use(errorHandler);

export default app;
