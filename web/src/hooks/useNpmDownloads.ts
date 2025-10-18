import { useState, useEffect } from "react";

interface DownloadData {
  downloads: number;
  day: string;
}

export function useNpmDownloads(packageName: string) {
  const [data, setData] = useState<DownloadData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    fetch(
      `https://api.npmjs.org/downloads/range/${formatDate(startDate)}:${formatDate(endDate)}/${packageName}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.downloads) {
          setData(response.downloads);
          const sum = response.downloads.reduce(
            (acc: number, curr: DownloadData) => acc + curr.downloads,
            0
          );
          setTotal(sum);
        }
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setTotal(0);
        setLoading(false);
      });
  }, [packageName]);

  return { data, total, loading };
}
