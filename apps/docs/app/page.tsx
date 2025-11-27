import { Github, Star, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Orama UI</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/oramasearch/orama-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/oramasearch/orama-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Star
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Headless React Components
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unstyled, accessible React components for building high-quality
              design systems and web apps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://github.com/oramasearch/orama-ui#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/oramasearch/orama-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 mr-2" />
                Browse Source
              </a>
            </Button>
          </div>

          {/* Quick Start */}
          <div className="mt-16 p-6 bg-gray-300/20 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
            <div className="bg-white p-4 rounded-md border border-gray-200 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                # Install the package
              </div>
              <div>npm install @orama/ui</div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Check the{" "}
              <a
                href="https://github.com/oramasearch/orama-ui#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                documentation
              </a>{" "}
              for detailed usage examples and API reference.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Built with React • TypeScript
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/oramasearch/orama-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="w-4 h-4 mr-2" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
