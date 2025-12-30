import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, BarChart3, Globe } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_professional_blue_data_network_background.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live for Early Access
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground mb-6 text-balance">
              Your AI Funding Co-Founder <br />
              <span className="text-primary">Decisions, not answers.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
              We help Indian founders make correct funding decisions using verified data, explained in your language. No jargon, just clear paths to capital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
                <Link href="/onboarding">
                  Start Funding Assessment <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                View Sample Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-primary" />}
              title="Verified Data"
              description="Backed by real-time Indian startup funding data. No hallucinations, only facts sourced from regulatory filings."
            />
            <FeatureCard 
              icon={<Globe className="w-10 h-10 text-primary" />}
              title="Multilingual AI"
              description="Get complex financial advice explained simply in Hindi, Tamil, Telugu, or English. We speak your language."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-10 h-10 text-primary" />}
              title="Actionable Plans"
              description="Don't just get advice. Get a 7-day execution plan tailored to your startup's specific stage and sector."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">How Nivesh.ai Works</h2>
            <p className="text-muted-foreground">Three simple steps to unlock your funding potential.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <Step 
              number="01" 
              title="Profile Setup" 
              description="Tell us about your startup stage, sector, and location in 2 minutes." 
            />
            <div className="hidden md:block absolute top-12 left-1/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <Step 
              number="02" 
              title="AI Assessment" 
              description="Our engine analyzes your data against thousands of successful deals." 
            />
            <div className="hidden md:block absolute top-12 left-2/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <Step 
              number="03" 
              title="Strategic Roadmap" 
              description="Receive a tailored funding strategy and connect with the right investors." 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 rounded-2xl border hover:shadow-lg transition-all duration-300">
      <div className="mb-6 bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center relative bg-background md:bg-transparent p-6 rounded-xl">
      <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-xl shadow-primary/20">
        {number}
      </div>
      <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
