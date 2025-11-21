import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNpmDownloads } from "@/hooks/useNpmDownloads";
import { ExternalLink, TrendingUp } from "lucide-react";

export function NpmGraph() {
  const { data, total, allTimeTotal, loading, period } = useNpmDownloads("create-churn", 365);

  if (loading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading download stats...</div>
      </div>
    );
  }

  // Aggregate data by week for cleaner visualization
  const weeklyData: { date: string; downloads: number }[] = [];
  for (let i = 0; i < data.length; i += 7) {
    const weekData = data.slice(i, i + 7);
    const weekDownloads = weekData.reduce((sum, d) => sum + d.downloads, 0);
    const weekStart = new Date(weekData[0]?.day);
    weeklyData.push({
      date: weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      downloads: weekDownloads,
    });
  }

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Weekly downloads ({period})</span>
        </div>
        <div className="font-semibold text-foreground">
          {allTimeTotal.toLocaleString()} total downloads
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={weeklyData}>
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
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-sm border-t pt-4">
        <span className="text-muted-foreground">
          {total.toLocaleString()} downloads in the {period}
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
