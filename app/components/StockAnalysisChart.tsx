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
  { product: "APD", stok: 18 },
  { product: "Kaos Tangan", stok: 12 },
  { product: "Masker", stok: 7 },
  { product: "Sarung Tangan", stok: 4 },
  { product: "Hand Sanitizer", stok: 9 },
  { product: "Sepatu Safety", stok: 6 },
  { product: "Rompi", stok: 15 },
  { product: "Helm", stok: 11 },
  { product: "Kacamata", stok: 8 },
  { product: "Ear Plug", stok: 5 },
]

const chartConfig = {
  stok: {
    label: "Stok",
    color: "#FF8400",
  },
} satisfies ChartConfig

export function StockAnalysisChart() {
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
            <Bar dataKey="stok" fill="var(--color-stok)" radius={8}>
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
