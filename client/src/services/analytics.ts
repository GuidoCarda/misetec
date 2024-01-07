import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export async function getAnalytics(date: DateRange | undefined) {
  const url = new URL("http://localhost:3000/api/v1/analytics");

  if (date) {
    const { from: fromDate, to: toDate } = date as DateRange;

    const params = new URLSearchParams({
      start: format(fromDate!, "yyyy-MM-dd"),
    });

    if (toDate) {
      params.append("end", format(toDate!, "yyyy-MM-dd"));
    }
    url.search = params.toString();
  }

  const res = await fetch(url);
  const data = await res.json();
  return data;
}
