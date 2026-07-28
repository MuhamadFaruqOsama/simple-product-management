"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartData = [
  { month: "January", pemasukkan: 186, pengeluaran: 120 },
  { month: "February", pemasukkan: 305, pengeluaran: 180 },
  { month: "March", pemasukkan: 237, pengeluaran: 140 },
  { month: "April", pemasukkan: 73, pengeluaran: 90 },
  { month: "May", pemasukkan: 209, pengeluaran: 160 },
  { month: "June", pemasukkan: 214, pengeluaran: 130 },
]

const chartConfig = {
  pemasukkan: {
    label: "Pemasukkan",
    color: "#FF8400",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#114BE6",
  },
} satisfies ChartConfig

export function EarningChart() {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="pengeluaran" fill="var(--color-pengeluaran)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar dataKey="pemasukkan" fill="var(--color-pemasukkan)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
