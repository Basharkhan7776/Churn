import { useState, useEffect } from "react";

export function useGithubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count || 0);
        setLoading(false);
      })
      .catch(() => {
        setStars(0);
        setLoading(false);
      });
  }, [repo]);

  return { stars, loading };
}
