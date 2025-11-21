import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNpmDownloads } from "@/hooks/useNpmDownloads";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type TimeRange = "W" | "M" | "Y";

const TIME_RANGES: { key: TimeRange; label: string; days: number }[] = [
  { key: "W", label: "Week", days: 7 },
  { key: "M", label: "Month", days: 30 },
  { key: "Y", label: "Year", days: 365 },
];

export function NpmGraph() {
  const [timeRange, setTimeRange] = useState<TimeRange>("M");
  const selectedRange = TIME_RANGES.find((r) => r.key === timeRange)!;
  const { data, total, allTimeTotal, loading } = useNpmDownloads("create-churn", selectedRange.days);

  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading download stats...</div>
      </div>
    );
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

  return (
    <div className="space-y-4">
      {/* Header with stats and time range selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{allTimeTotal.toLocaleString()} total downloads</span>
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

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [value.toLocaleString(), "Downloads"]}
          />
          <Line
            type="monotone"
            dataKey="downloads"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={timeRange === "W"}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-sm border-t pt-4">
        <span className="text-muted-foreground">
          {total.toLocaleString()} downloads in the last {selectedRange.label.toLowerCase()}
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
    </div>
  );
}
