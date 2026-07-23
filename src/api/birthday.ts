import {Router} from "express";
import fs from "fs";
import path from "path"
import * as yaml from "js-yaml";

const router = Router();

const __dirname  = import.meta.dirname;
const __filename  = import.meta.filename;

const filePath = path.join(
  __dirname,
  "../../data/birthdays.yaml"
);

interface Birthday {
  name: string,
  birthday: {
    month: number,
    date: number,
  }
}

router.get("/", (req,res) => {
  const file = fs.readFileSync(filePath, "utf8");
  const birthdays = yaml.load(file) as Birthday[];
  res.json(birthdays);
})

export default router;
