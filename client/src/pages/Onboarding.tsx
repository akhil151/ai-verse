import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  { id: 'basics', title: 'Startup Basics' },
  { id: 'details', title: 'Details' },
  { id: 'goals', title: 'Goals' }
];

const formSchema = z.object({
  stage: z.enum(['Idea', 'MVP', 'Revenue', 'Growth'], { required_error: "Please select a stage" }),
  sector: z.string().min(2, "Sector is required"),
  location: z.string().min(2, "Location is required"),
  fundingGoal: z.enum(['Grant', 'Angel', 'VC'], { required_error: "Please select a goal" }),
  language: z.enum(['English', 'Hindi', 'Tamil', 'Telugu'], { required_error: "Please select a language" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { updateProfile } = useApp();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage: undefined,
      sector: "",
      location: "",
      fundingGoal: undefined,
      language: "English"
    },
    mode: "onChange" 
  });

  const onSubmit = (data: FormData) => {
    updateProfile(data);
    setLocation("/dashboard");
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: return ['stage', 'sector'];
      case 1: return ['location', 'language'];
      case 2: return ['fundingGoal'];
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors duration-300
                    ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="p-8 border-none shadow-xl">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold">Tell us about your startup</h2>
                    <p className="text-muted-foreground">This helps our AI tailor the advice to your specific situation.</p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Current Stage</Label>
                    <RadioGroup 
                      onValueChange={(val) => form.setValue("stage", val as any)} 
                      className="grid grid-cols-2 gap-4"
                    >
                      {['Idea', 'MVP', 'Revenue', 'Growth'].map((stage) => (
                        <div key={stage}>
                          <RadioGroupItem value={stage} id={stage} className="peer sr-only" />
                          <Label
                            htmlFor={stage}
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                          >
                            <span className="font-semibold">{stage}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {form.formState.errors.stage && <p className="text-destructive text-sm">{form.formState.errors.stage.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector / Industry</Label>
                    <Select onValueChange={(val) => form.setValue("sector", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SaaS">SaaS / B2B Software</SelectItem>
                        <SelectItem value="Fintech">FinTech</SelectItem>
                        <SelectItem value="Agritech">AgriTech</SelectItem>
                        <SelectItem value="Healthtech">HealthTech</SelectItem>
                        <SelectItem value="Edtech">EdTech</SelectItem>
                        <SelectItem value="D2C">D2C / Consumer</SelectItem>
                        <SelectItem value="Deeptech">DeepTech / AI</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.sector && <p className="text-destructive text-sm">{form.formState.errors.sector.message}</p>}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold">Localization Details</h2>
                    <p className="text-muted-foreground">We localize insights based on your region and preferred language.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Where are you based?</Label>
                    <Input 
                      id="location" 
                      placeholder="City, State (e.g., Bengaluru, Karnataka)" 
                      {...form.register("location")}
                    />
                    {form.formState.errors.location && <p className="text-destructive text-sm">{form.formState.errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language for Reports</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("language", val as any)}
                      defaultValue="English"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                        <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                        <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold">What are you looking for?</h2>
                    <p className="text-muted-foreground">Select your primary funding goal right now.</p>
                  </div>

                  <div className="space-y-4">
                    <RadioGroup 
                      onValueChange={(val) => form.setValue("fundingGoal", val as any)} 
                      className="grid gap-4"
                    >
                      {[
                        { id: 'Grant', title: 'Government Grants', desc: 'Non-dilutive funding for research & innovation' },
                        { id: 'Angel', title: 'Angel Investment', desc: 'Early stage capital from individuals' },
                        { id: 'VC', title: 'Venture Capital', desc: 'Institutional capital for high growth' }
                      ].map((item) => (
                        <div key={item.id}>
                          <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                          <Label
                            htmlFor={item.id}
                            className="flex items-center space-x-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-lg">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <div className="h-6 w-6 rounded-full border border-primary peer-data-[state=checked]:bg-primary" />
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {form.formState.errors.fundingGoal && <p className="text-destructive text-sm">{form.formState.errors.fundingGoal.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button type="submit" className="px-8">
                  Generate Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={nextStep} className="px-8">
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
