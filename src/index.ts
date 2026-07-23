import express from "express";
import path from "path";
import birthday from "./api/birthday.js";

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static("public"));
app.use("/api/birthday", birthday);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT);
