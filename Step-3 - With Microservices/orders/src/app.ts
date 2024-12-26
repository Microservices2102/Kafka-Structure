import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@rallycoding/common";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// Catch-all route for undefined endpoints
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// Use the imported errorHandler
app.use(errorHandler as express.ErrorRequestHandler);

export { app };
