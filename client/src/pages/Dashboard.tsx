function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
      <div className="grid lg:grid-cols-5  gap-4">
        <ExampleChart classNames="col-span-3" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-md shadow-sm border p-4 flex flex-col space-y-4"
          >
            <h2 className="text-xl font-semibold">Titulo</h2>
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              voluptatum.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

import { BarChart, Card, Subtitle, Title } from "@tremor/react";
import { HTMLAttributes } from "react";

const chartdata = [
  {
    name: "Amphibians",
    "Number of threatened species": 2488,
  },
  {
    name: "Birds",
    "Number of threatened species": 1445,
  },
  {
    name: "Crustaceans",
    "Number of threatened species": 743,
  },
  {
    name: "Ferns",
    "Number of threatened species": 281,
  },
  {
    name: "Arachnids",
    "Number of threatened species": 251,
  },
  {
    name: "Corals",
    "Number of threatened species": 232,
  },
  {
    name: "Algae",
    "Number of threatened species": 98,
  },
];

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

type ExampleChartProps = {
  classNames?: HTMLAttributes<HTMLDivElement>["className"];
};

export const ExampleChart = ({ classNames }: ExampleChartProps) => (
  <Card className={classNames}>
    <Title>Number of species threatened with extinction (2021)</Title>
    <Subtitle>
      The IUCN Red List has assessed only a small share of the total known
      species in the world.
    </Subtitle>
    <BarChart
      className="mt-6"
      data={chartdata}
      index="name"
      categories={["Number of threatened species"]}
      colors={["blue"]}
      valueFormatter={valueFormatter}
      yAxisWidth={48}
    />
  </Card>
);

export default Dashboard;
