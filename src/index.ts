import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRoutes from "./Routes/userRoutes.ts";
import { PORT } from "./config.ts";
import AuthRouter from "./Routes/AuthRouter.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (_req, res) => {
	res.send("<h1>Hello Osmin!</h1>");
});

app.use("/users", userRoutes);
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} 🚀`);
});
