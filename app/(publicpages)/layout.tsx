import DemoBanner from "@/components/demo-banner";
import Footer from "../../components/public-pages/footer";
import TopNavWrapper from "../../components/public-pages/nav/top-nav-wrapper";
import { isDemo } from "../lib/flags";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {isDemo && <DemoBanner />}
      <div className="flex min-h-screen flex-col p-6 bg-slate-100/60">
        <TopNavWrapper />
        <main className="grow mx-auto w-full max-w-7xl px-4 md:px-10 py-7 bg-white rounded-t-sm">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
