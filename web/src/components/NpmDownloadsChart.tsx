import { useState } from "react";
import { useNpmDownloads } from "@/hooks/useNpmDownloads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type TimeRange = "W" | "M" | "Y";

const TIME_RANGES: { key: TimeRange; label: string; days: number }[] = [
  { key: "W", label: "week", days: 7 },
  { key: "M", label: "month", days: 30 },
  { key: "Y", label: "year", days: 365 },
];

export function NpmDownloadsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Y");
  const selectedRange = TIME_RANGES.find((r) => r.key === timeRange)!;
  const { data, total, allTimeTotal, loading } = useNpmDownloads("create-churn", selectedRange.days);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NPM Downloads</CardTitle>
          <CardDescription>Loading...</CardDescription>
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

  // Format chart data based on time range
  const chartData = (() => {
    if (timeRange === "W") {
      // Daily data for week view
      return data.map((item) => ({
        date: new Date(item.day).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        downloads: item.downloads,
      }));
    } else if (timeRange === "M") {
      // Daily data for month view
      return data.map((item) => ({
        date: new Date(item.day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        downloads: item.downloads,
      }));
    } else {
      // Weekly aggregation for year view
      const weeklyData: { date: string; downloads: number }[] = [];
      for (let i = 0; i < data.length; i += 7) {
        const weekData = data.slice(i, i + 7);
        const weekDownloads = weekData.reduce((sum, d) => sum + d.downloads, 0);
        if (weekData[0]) {
          const weekStart = new Date(weekData[0].day);
          weeklyData.push({
            date: weekStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            downloads: weekDownloads,
          });
        }
      }
      return weeklyData;
    }
  })();

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                NPM Downloads
              </CardTitle>
              <CardDescription className="mt-1">
                {allTimeTotal.toLocaleString()} total downloads
                <span className="text-xs ml-2">({avgDownloads.toLocaleString()}/day avg)</span>
              </CardDescription>
            </div>

            {/* Time range toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.key}
                  variant={timeRange === range.key ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs font-medium"
                  onClick={() => setTimeRange(range.key)}
                >
                  {range.key}
                </Button>
              ))}
            </div>
          </div>
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
                interval="preserveStartEnd"
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

          {/* Footer with period info and npm link */}
          <div className="flex items-center justify-between text-sm border-t pt-4 mt-4">
            <span className="text-muted-foreground">
              {total.toLocaleString()} downloads in the last {selectedRange.label}
            </span>
            <a
              href="https://www.npmjs.com/package/create-churn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium"
            >
              View on npm
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
