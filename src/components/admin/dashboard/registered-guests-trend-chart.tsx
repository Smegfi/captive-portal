"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type TrendPoint = {
   date: string;
   registeredGuests: number;
};

const chartConfig = {
   registeredGuests: {
      label: "Registrovaní hosté",
      color: "hsl(var(--primary))",
   },
} satisfies ChartConfig;

interface RegisteredGuestsTrendChartProps {
   data: TrendPoint[];
}

export default function RegisteredGuestsTrendChart({ data }: RegisteredGuestsTrendChartProps) {
   const chartData = data.map((point) => ({
      ...point,
      dateLabel: format(parseISO(point.date), "dd.MM"),
   }));

   return (
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
         <LineChart data={chartData} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} tickMargin={8} minTickGap={20} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} width={28} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
               dataKey="registeredGuests"
               type="monotone"
               stroke="var(--color-registeredGuests)"
               strokeWidth={2}
               dot={false}
               activeDot={{ r: 4 }}
            />
         </LineChart>
      </ChartContainer>
   );
}
