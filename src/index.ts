import express from "express";
import birthday from "./api/birthday.js";

const app = express();
const PORT = 3001;

app.use(express.static("public"));
app.use("/api/birthday", birthday);

app.listen(PORT);
