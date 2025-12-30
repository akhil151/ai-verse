import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, BarChart3, Globe } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_professional_blue_data_network_background.png";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [featuresRevealed, setFeaturesRevealed] = useState(false);
  const [stepsRevealed, setStepsRevealed] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (entry.target === featuresRef.current) {
          setFeaturesRevealed(true);
        }
        if (entry.target === stepsRef.current) {
          setStepsRevealed(true);
        }
      }
    }, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: "spring", damping: 20, stiffness: 100 }
    }
  };

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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live for Early Access
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground text-balance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Your AI Funding Co-Founder <br />
              <span className="text-primary">Decisions, not answers.</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              We help Indian founders make correct funding decisions using verified data, explained in your language. No jargon, just clear paths to capital.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg rounded-full font-medium btn-press glow-primary transition-all duration-300" 
                asChild
              >
                <Link href="/onboarding" className="flex items-center gap-2">
                  Start Funding Assessment <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-lg rounded-full font-medium card-hover transition-all duration-300"
              >
                View Sample Report
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={featuresRef}
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresRevealed ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<ShieldCheck className="w-10 h-10 text-primary" />}
                title="Verified Data"
                description="Backed by real-time Indian startup funding data. No hallucinations, only facts sourced from regulatory filings."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<Globe className="w-10 h-10 text-primary" />}
                title="Multilingual AI"
                description="Get complex financial advice explained simply in Hindi, Tamil, Telugu, or English. We speak your language."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<BarChart3 className="w-10 h-10 text-primary" />}
                title="Actionable Plans"
                description="Don't just get advice. Get a 7-day execution plan tailored to your startup's specific stage and sector."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">How Nivesh.ai Works</h2>
            <p className="text-muted-foreground">Three simple steps to unlock your funding potential.</p>
          </div>

          <motion.div 
            ref={stepsRef}
            className="grid md:grid-cols-3 gap-12 relative"
            variants={containerVariants}
            initial="hidden"
            animate={stepsRevealed ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Step 
                number="01" 
                title="Profile Setup" 
                description="Tell us about your startup stage, sector, and location in 2 minutes." 
              />
            </motion.div>
            <div className="hidden md:block absolute top-12 left-1/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <motion.div variants={itemVariants}>
              <Step 
                number="02" 
                title="AI Assessment" 
                description="Our engine analyzes your data against thousands of successful deals." 
              />
            </motion.div>
            <div className="hidden md:block absolute top-12 left-2/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <motion.div variants={itemVariants}>
              <Step 
                number="03" 
                title="Strategic Roadmap" 
                description="Receive a tailored funding strategy and connect with the right investors." 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 rounded-2xl border hover:border-primary/30 card-hover cursor-default group transition-all duration-300">
      <div className="mb-6 bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-bold mb-3 transition-smooth">{title}</h3>
      <p className="text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-smooth">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center relative bg-background md:bg-transparent p-6 rounded-xl card-hover group cursor-default transition-all duration-300">
      <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-xl shadow-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-300">
        {number}
      </div>
      <h3 className="text-xl font-heading font-bold mb-3 transition-smooth">{title}</h3>
      <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-smooth">{description}</p>
    </div>
  );
}
