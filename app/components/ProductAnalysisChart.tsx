"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { product: "APD", jumlah: 186 },
  { product: "Kaos Tangan", jumlah: 305 },
  { product: "Masker", jumlah: 237 },
  { product: "Sarung Tangan", jumlah: 73 },
  { product: "Hand Sanitizer", jumlah: 209 },
  { product: "Sepatu Safety", jumlah: 165 },
  { product: "Rompi", jumlah: 142 },
  { product: "Helm", jumlah: 128 },
  { product: "Kacamata", jumlah: 96 },
  { product: "Ear Plug", jumlah: 84 },
]

const chartConfig = {
  jumlah: {
    label: "Jumlah",
    color: "#FF8400",
  },
} satisfies ChartConfig

export function ProductAnalysisChart() {
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
              dataKey="product"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={8}>
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
