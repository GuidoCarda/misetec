import api from "@/services/config";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export async function getAnalytics(date: DateRange | undefined) {
  const params = new URLSearchParams();

  if (date) {
    const { from: fromDate, to: toDate } = date as DateRange;
    params.append("start", format(fromDate!, "yyyy-MM-dd"));

    if (toDate) {
      params.append("end", format(toDate!, "yyyy-MM-dd"));
    }
  }

  const response = await api.get("/analytics?" + params.toString());
  return response.data;
}
