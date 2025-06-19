import { SearchBox } from "@/components/SearchBox";
import { SearchBoxModal } from "./components/SearchBoxModal";

export default function Page() {
  return (
    <main className="min-h-screen p-18">
      {/* add a button that opens a modal */}
      <h1 className="text-3xl font-bold mb-4">Orama Searchbox Demo</h1>
      <SearchBoxModal />
      <SearchBox />
    </main>
  );
}
