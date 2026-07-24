class Calendar {
  constructor(cells, title) {
    this.cells = cells;
    this.title = title;
  }

  init() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.year = this.today.getFullYear();
    this.month = this.today.getMonth() + 1;

    this.render();
  }

  async render() {
    this.title.textContent = `${this.year}. ${this.month}`;

    const { first, last } = this.getCalendarRange(this.year, this.month);
    const birthdays = await this.fetchBirthdays(first, last);

    for (let i = 0; i < 42; i++) {
      const html = [];
      const classes = ["cell", "date"];

      html.push(`<span class="date__number">${first.getDate()}</span>`);

      const birthday = birthdays[this.formatDate(first)];
      if (birthday) {
        html.push(`<span class="date__birthday">`);
        for (const name of birthday) html.push(`<img src="characters/${name}.png" width="35" height="35">`);
        html.push(`</span>`);
      }

      if (this.isToday(first)) classes.push("today");
      if (first.getMonth() + 1 !== this.month) classes.push("other-month");

      this.cells[i].className = classes.join(" ");
      this.cells[i].innerHTML = html.join("");

      first.setDate(first.getDate() + 1);
    }
  }

  getCalendarRange(year, month) {
    const first = new Date(year, month - 1, 1);
    first.setDate(first.getDate() - first.getDay());

    const last = new Date(first);
    last.setDate(last.getDate() + 41);

    return { first, last };
  }

  async fetchBirthdays(first, last) {
    const res = await fetch(`/api/birthday/range?start=${this.formatDate(first)}&end=${this.formatDate(last)}`);
    const birthdays = await res.json();

    const map = {};
    for (const birthday of birthdays) {
      const key = this.formatMonthDay(birthday.birthday.month, birthday.birthday.date);
      if (!map[key]) map[key] = [];
      map[key].push(birthday.name);
    }

    return map;
  }

  formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return this.formatMonthDay(month, day);
  }

  formatMonthDay(month, day) {
    return `${month}-${day}`;
  }

  isToday(date) {
    return this.isSameDay(date, this.today);
  }

  isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  prevMonth() {
    this.changeMonth(-1);
  }

  nextMonth() {
    this.changeMonth(1);
  }

  changeMonth(offset) {
    this.month += offset;

    if (this.month < 1) {
      this.year--;
      this.month = 12;
    }

    if (this.month > 12) {
      this.year++;
      this.month = 1;
    }

    this.render();
  }
}

const cells = document.querySelectorAll(".date");
const title = document.getElementById("calendarTitle");

const app = new Calendar(cells, title);
app.init();

document.getElementById("prevButton").addEventListener("click", () => app.prevMonth());
document.getElementById("nextButton").addEventListener("click", () => app.nextMonth());
