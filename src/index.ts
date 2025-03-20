import express from "express";
import { PORT } from "./config.ts";
import userRoutes from "./Routes/userRoutes.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (_req, res) => {
	res.send("<h1>Hello Osmin!</h1>");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} 🚀`);
});
