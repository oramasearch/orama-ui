// import { SearchBox } from "@/components/SearchBox";
// import { SearchBoxModal } from "./components/SearchBoxModal";
import { CodeExamples } from "./components/CodeExample";
import { ComponentShowcase } from "./components/ComponentShowcase";
import Header from "./components/Header";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <ComponentShowcase />
      <CodeExamples />
      {/* <SearchBoxModal />
      <SearchBox /> */}
    </main>
  );
}
