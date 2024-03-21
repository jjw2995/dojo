// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ] as const;

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function getTimeString(date: Date) {
  const minutes = date.getMinutes();
  const hour = date.getHours();

  const isPm = hour > 12;

  //   const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const dayOfWeek = days[date.getDay()];
  //   const monthOfYear = months[month];

  //   return `${year}/${month + 1}/${day} ${dayOfWeek} ${
  //     isPm ? hour - 12 : hour
  //   }:${minutes} ${isPm ? "PM" : "AM"}`;

  return `${month + 1}/${day} ${dayOfWeek} ${
    isPm ? hour - 12 : hour
  }:${minutes} ${isPm ? "PM" : "AM"}`;
}

export { getTimeString };
