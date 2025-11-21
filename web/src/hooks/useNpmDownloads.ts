import { useState, useEffect } from "react";

interface DownloadData {
  downloads: number;
  day: string;
}

interface NpmDownloadsResult {
  data: DownloadData[];
  total: number;
  allTimeTotal: number;
  loading: boolean;
  period: string;
}

export function useNpmDownloads(packageName: string, days: number = 365): NpmDownloadsResult {
  const [data, setData] = useState<DownloadData[]>([]);
  const [total, setTotal] = useState(0);
  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Fetch daily downloads for the chart
    const fetchDaily = fetch(
      `https://api.npmjs.org/downloads/range/${formatDate(startDate)}:${formatDate(endDate)}/${packageName}`
    ).then((res) => res.json());

    // Fetch all-time total downloads
    const fetchTotal = fetch(
      `https://api.npmjs.org/downloads/point/2020-01-01:${formatDate(endDate)}/${packageName}`
    ).then((res) => res.json());

    Promise.all([fetchDaily, fetchTotal])
      .then(([dailyResponse, totalResponse]) => {
        if (dailyResponse.downloads) {
          setData(dailyResponse.downloads);
          const sum = dailyResponse.downloads.reduce(
            (acc: number, curr: DownloadData) => acc + curr.downloads,
            0
          );
          setTotal(sum);
        }
        if (totalResponse.downloads) {
          setAllTimeTotal(totalResponse.downloads);
        }
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setTotal(0);
        setAllTimeTotal(0);
        setLoading(false);
      });
  }, [packageName, days]);

  const period = days <= 30 ? "last 30 days" : days <= 90 ? "last 3 months" : "last year";

  return { data, total, allTimeTotal, loading, period };
}
