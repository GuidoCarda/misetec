import DateRangePicker from "@/components/DateRangePicker";
import { Skeleton } from "@/components/ui/skeleton";
import { secondsToTime } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@tremor/react";
import { format, startOfMonth } from "date-fns";
import { Hourglass, ListChecks, Loader } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  console.log(date);
  const analyticsQuery = useQuery({
    queryKey: ["analytics", date?.from, date?.to],
    queryFn: () => getAnalytics(date),

    retry: false,
  });

  async function getAnalytics(date: DateRange | undefined) {
    const url = new URL("http://localhost:3000/api/v1/analytics");

    if (date) {
      console.log(date, "entro");
      const { from: fromDate, to: toDate } = date as DateRange;

      const params = new URLSearchParams({
        start: format(fromDate!, "yyyy-MM-dd"),
      });
      console.log(params);

      if (toDate) {
        params.append("end", format(toDate!, "yyyy-MM-dd"));
      }

      url.search = params.toString();
      // add the url params to the url

      console.log(url.toString());
    }

    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  // if (analyticsQuery.isPending) return <p>Loading...</p>;

  if (analyticsQuery.isError) return <p>{analyticsQuery.error.message}</p>;

  console.log(analyticsQuery.data);

  return (
    <>
      <header className="flex items-center justify-between md:mb-10">
        <h2 className="text-2xl font-bold tracking-tight">Informes</h2>
      </header>
      <DateRangePicker date={date} setDate={setDate} className="mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {analyticsQuery.isPending ? (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        ) : (
          <>
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-md  mb-2">Ordenes en progreso</h2>
                <ListChecks className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">
                {analyticsQuery.data?.in_progress ?? "Sin resultados"}
              </p>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-md  mb-2">Ordenes sin revisión</h2>
                <Loader className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">
                {analyticsQuery.data?.pending ?? "Sin resultados"}
              </p>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-md  mb-2">Tiempo promedio resolucion</h2>
                <Hourglass className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">
                {secondsToTime(Number(analyticsQuery.data?.resolution_time)) ??
                  "2d 3h"}
              </p>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
