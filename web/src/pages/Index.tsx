import { Header } from "@/components/Header";
import { SidebarTOC } from "@/components/SidebarTOC";
import { DocsContent } from "@/components/DocsContent";
import { Footer } from "@/components/Footer";
import { NpmDownloadsChart } from "@/components/NpmDownloadsChart";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <SidebarTOC />
      <main className="lg:ml-60 pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-16 py-12">
          <DocsContent />
          <div className="mt-16">
            <NpmDownloadsChart />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
