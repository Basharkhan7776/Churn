import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNpmDownloads } from "@/hooks/useNpmDownloads";
import { ExternalLink } from "lucide-react";

export function NpmGraph() {
  const { data, loading } = useNpmDownloads("create-churn");

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    downloads: item.downloads,
  }));

  const totalDownloads = data.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="downloads"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-sm border-t pt-4">
        <span className="text-muted-foreground">
          {totalDownloads.toLocaleString()} downloads in the last 30 days
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
