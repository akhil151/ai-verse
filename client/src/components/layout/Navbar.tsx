import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Navbar() {
  const { profile, updateProfile } = useApp();
  const t = translations[profile.language as keyof typeof translations] || translations.English;

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
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.features}
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.howItWorks}
          </button>
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.pricing}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Select 
            value={profile.language} 
            onValueChange={(val: any) => updateProfile({ language: val })}
          >
            <SelectTrigger className="w-[110px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="Tamil">தமிழ் (Tamil)</SelectItem>
              <SelectItem value="Telugu">తెలుగు (Telugu)</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="font-medium" asChild>
            <Link href="/onboarding">
              {t.nav.getStarted}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
