"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ChartArea } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type TrendPoint = {
   date: string;
   registeredGuests: number;
};

const chartConfig = {
   registeredGuests: {
      label: "Registrovaní hosté",
      color: "var(--chart-1)",
   },
} satisfies ChartConfig;

function formatDayLabel(dateKey: string): string {
   const [, month, day] = dateKey.split("-");
   if (!month || !day) {
      return dateKey;
   }

   return `${day}.${month}`;
}

interface RegisteredGuestsTrendChartProps {
   data?: TrendPoint[];
}

export default function RegisteredGuestsTrendChart({ data }: RegisteredGuestsTrendChartProps) {

   if (!data) {
      return (
         <Empty>
            <EmptyHeader>
               <EmptyMedia variant="icon">
                  <ChartArea />
               </EmptyMedia>
               <EmptyTitle>Žádná data</EmptyTitle>
               <EmptyDescription>Žádná data nebyla nalezena</EmptyDescription>
            </EmptyHeader>
         </Empty>
      );
   }

   const chartData = data?.map((point) => ({
      ...point,
      dateLabel: formatDayLabel(point.date),
   })) || [];

   return (
      <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
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
               dot={{ r: 3, fill: "var(--color-registeredGuests)" }}
               activeDot={{ r: 5 }}
            />
         </LineChart>
      </ChartContainer>
   );
}
