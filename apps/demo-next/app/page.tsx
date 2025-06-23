// import { SearchBox } from "@/components/SearchBox";
// import { SearchBoxModal } from "./components/SearchBoxModal";
import { ComponentShowcase } from "./components/ComponentShowcase";
import Header from "./components/Header";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <ComponentShowcase />
      {/* <SearchBoxModal />
      <SearchBox /> */}
    </main>
  );
}
