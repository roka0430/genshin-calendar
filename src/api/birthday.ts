import { Router } from "express";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { match } from "assert";

const router = Router();

const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

const filePath = path.join(__dirname, "../../data/birthdays.yaml");

interface Birthday {
  name: string;
  birthday: {
    month: number;
    date: number;
  };
}

const file = fs.readFileSync(filePath, "utf8");
const birthdays = yaml.load(file) as Birthday[];

router.get("/", (req, res) => {
  res.json(birthdays);
});

router.get("/range", (req, res) => {
  const { start, end } = req.query;

  if (typeof start !== "string" || typeof end !== "string") {
    return res.status(400).json({
      message: "Invalid range",
    });
  }

  const [startMonth, startDate] = start.split("-").map(Number);
  const [endMonth, endDate] = end.split("-").map(Number);

  const startValue: number = startMonth * 100 + startDate;
  const endValue: number = endMonth * 100 + endDate;

  const matched: Birthday[] = birthdays.filter((birthday) => {
    const value = birthday.birthday.month * 100 + birthday.birthday.date;

    if (startValue <= endValue) return value >= startValue && value <= endValue;
    return value >= startValue || value <= endValue;
  });

  res.json(matched);
});

router.get("/:month", (req, res) => {
  const month: number = Number(req.params.month);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({
      message: "Invalid month",
    });
  }

  const matched: Birthday[] = birthdays.filter((birthday) => {
    return birthday.birthday.month === month;
  });

  res.json(matched);
});

export default router;
