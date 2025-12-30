import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export function Navbar() {
  const { profile } = useApp();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-primary hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            N
          </div>
          Nivesh.ai
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{profile.language}</span>
          </div>
          <Button size="sm" className="font-medium" asChild>
            <Link href="/onboarding">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
