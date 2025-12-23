export const formatDate = (date: any) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

export const calculateGMToffset = (date: any) => {
  // Calculate GMT offset
  const offsetMinutes = date.getTimezoneOffset(); // in minutes
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffset / 60);
  const offsetMins = absOffset % 60;
  const offsetSign = offsetMinutes > 0 ? "-" : "+";
  const gmtOffset = `GMT${offsetSign}${String(offsetHours).padStart(
    2,
    "0"
  )}:${String(offsetMins).padStart(2, "0")}`;
  return gmtOffset;
};

export function formatTimestampIST(timestampStr: any) {
  const timestamp = Number(timestampStr);
  const date = new Date(timestamp);

  const options: any = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const timeFormatter = new Intl.DateTimeFormat("en-US", options);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const timePart = timeFormatter.format(date); // e.g. "12:00 AM"
  const datePart = dateFormatter.format(date); // e.g. "06/24/2026"
  const gmtOffset = calculateGMToffset(date); // e.g. "GMT+5:30"

  return {
    date: datePart,
    time: `${timePart} ${gmtOffset}`,
  };
}

export function isDateOnlyTimestamp(timestamp: any) {
  const date = new Date(timestamp);
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

export const formatDateTime = (data: any, type: any = "date") => {
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
  };

  const date = new Date(data);

  // Get parts
  const day = date.toLocaleString("en-US", { ...options, day: "2-digit" });
  const month = date.toLocaleString("en-US", { ...options, month: "2-digit" });
  const year = date.toLocaleString("en-US", { ...options, year: "numeric" });
  const time = date.toLocaleString("en-US", {
    ...options,
    hour: "numeric",
    minute: "2-digit",
  });
  const tz = date
    .toLocaleString("en-US", {
      ...options,
      timeZoneName: "short",
    })
    .split(" ")
    .pop(); // Get "GMT+5:30"

  return `${month}/${day}/${year} ${time} ${tz}`;
};

// function parseISTToTimestamp(dateTimeStr) {
//     // Example: "06/24/2026 12:00 AM GMT+5:30"
//     const [datePart, timePart, , offsetPart] = dateTimeStr.split(" ");

//     const [month, day, year] = datePart.split("/").map(Number);
//     const [time, meridiem] = [timePart.slice(0, -2), timePart.slice(-2)];
//     let [hours, minutes] = time.split(":").map(Number);

//     // Convert to 24-hour format
//     if (meridiem === "PM" && hours !== 12) hours += 12;
//     if (meridiem === "AM" && hours === 12) hours = 0;

//     // Create a date in UTC
//     const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

//     // Apply offset manually (GMT+5:30 = +330 minutes)
//     const offsetMinutes = 5 * 60 + 30;
//     const timestamp = date.getTime() - offsetMinutes * 60 * 1000;

//     return timestamp.toString();
//   }

export function parseISTToTimestamp(dateTimeStr: any) {
  // If only date is provided, append default time
  if (dateTimeStr.trim().split(" ").length === 1) {
    const [mm, dd, yyyy] = dateTimeStr.split('/');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const timestamp = new Date(`${formattedDate}T00:00:00.000Z`).getTime();
    return timestamp;
  }
  const [datePart, timePart, meridiem, offset] = dateTimeStr.split(" ");

  const [month, day, year] = datePart.split("/").map(Number);
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  // Create date in UTC (we'll apply the offset manually)
  const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Extract offset from "GMT+5:30"
  const offsetMatch = offset.match(/GMT([+-])(\d+):(\d+)/);
  if (!offsetMatch) throw new Error("Invalid offset format");

  const sign = offsetMatch[1] === "+" ? 1 : -1;
  const offsetHours = parseInt(offsetMatch[2], 10);
  const offsetMinutes = parseInt(offsetMatch[3], 10);
  const totalOffsetMs = sign * (offsetHours * 60 + offsetMinutes) * 60 * 1000;

  // Adjust UTC time to match GMT+5:30 time
  const finalTimestamp = dateUTC.getTime() - totalOffsetMs;

  return finalTimestamp.toString();
}

export function normalizeToTimestamp(defaultValue: any): any {
  // Invalid / empty
  if (!defaultValue) return null;

  // Valid timestamp number
  if (typeof defaultValue === "number") {
    return defaultValue > 100000000000 ? defaultValue : 0;
  }

  // Valid timestamp string (digits only, min 10 length)
  if (typeof defaultValue === "string" && /^\d+$/.test(defaultValue)) {
    return defaultValue.length >= 10 ? Number(defaultValue) : 0;
  }

  // Valid date string → convert
  if (typeof defaultValue === "string") {
    const date = new Date(defaultValue);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
  }

  // Everything else invalid
  return null;
}
