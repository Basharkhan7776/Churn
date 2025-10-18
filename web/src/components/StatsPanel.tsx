import { motion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NpmGraph } from "./NpmGraph";
import { useGithubStars } from "@/hooks/useGithubStars";
import { useNpmDownloads } from "@/hooks/useNpmDownloads";

export function StatsPanel() {
  const { stars, loading: starsLoading } = useGithubStars("Basharkhan7776/Churn");
  const { total, loading: downloadsLoading } = useNpmDownloads("create-churn");

  return (
    <section className="py-20 px-6 border-t">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Community Stats
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-accent" />
                  NPM Downloads (30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!downloadsLoading && (
                  <div className="text-4xl font-bold mb-4 text-accent">
                    {total.toLocaleString()}
                  </div>
                )}
                <NpmGraph />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  GitHub Stars
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[260px]">
                {!starsLoading && stars !== null && (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-accent mb-2 glow-accent">
                      {stars}
                    </div>
                    <div className="text-muted-foreground">
                      developers starred this project
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
