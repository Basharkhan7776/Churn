import { useNpmDownloads } from "@/hooks/useNpmDownloads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function NpmDownloadsChart() {
  const { data, total, loading } = useNpmDownloads("create-churn");

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NPM Downloads</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data.length) {
    return null;
  }

  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    downloads: item.downloads,
  }));

  const avgDownloads = Math.round(total / data.length);

  const chartConfig = {
    downloads: {
      label: "Downloads",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            NPM Downloads
          </CardTitle>
          <CardDescription>
            {total.toLocaleString()} total downloads in the last 30 days
            <span className="text-xs ml-2">({avgDownloads.toLocaleString()}/day avg)</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => value}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fill="url(#fillDownloads)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
