import { useState, useRef } from "react";
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
import { Check, ChevronRight, ChevronLeft, AlertCircle, Upload, File as FileIcon, X } from "lucide-react";
import { saveFounderProfile } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { translations } from "@/lib/translations";

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
  const { profile, updateProfile } = useApp();
  const t = translations[profile.language as keyof typeof translations] || translations.English;

  const steps = [
    { id: 'basics', title: t.onboarding.steps.basics },
    { id: 'details', title: t.onboarding.steps.details },
    { id: 'goals', title: t.onboarding.steps.goals },
    { id: 'documents', title: t.onboarding.steps.documents }
  ];
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage: profile.stage as any || undefined,
      sector: profile.sector || "",
      location: profile.location || "",
      fundingGoal: profile.fundingGoal as any || undefined,
      language: profile.language || "English"
    },
    mode: "onChange" 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const backendProfile = {
        startup_stage: data.stage.toLowerCase(),
        sector: data.sector.toLowerCase(),
        location: data.location,
        funding_goal: data.fundingGoal.toLowerCase(),
        preferred_language: data.language.toLowerCase(),
        documents: uploadedFiles
      };
      
      await saveFounderProfile(backendProfile);
      updateProfile(data);
      setLocation("/dashboard");
    } catch (error) {
      console.error('Error saving profile:', error);
      updateProfile(data);
      setLocation("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
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
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300
                    ${index <= currentStep ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}
                  `}
                  whileHover={index <= currentStep ? { scale: 1.1 } : {}}
                >
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span className={`text-xs font-medium transition-all duration-300 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="p-8 border-none shadow-xl card-hover">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding.basics.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding.basics.description}</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">{t.onboarding.basics.stage}</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("stage", val as any)} 
                        defaultValue={form.getValues("stage")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Idea', 'MVP', 'Revenue', 'Growth'].map((stage, idx) => (
                          <motion.div 
                            key={stage}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={stage} id={stage} className="peer sr-only" />
                            <motion.label
                              htmlFor={stage}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{stage}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.stage && <p className="text-destructive text-sm">{form.formState.errors.stage.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="sector">{t.onboarding.basics.sector}</Label>
                      <Select 
                        onValueChange={(val) => form.setValue("sector", val)}
                        defaultValue={form.getValues("sector")}
                      >
                        <SelectTrigger className="focus-ring-premium">
                          <SelectValue placeholder={t.onboarding.basics.sectorPlaceholder} />
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
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding.localization.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding.localization.description}</p>
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="location">{t.onboarding.localization.location}</Label>
                      <Input 
                        id="location" 
                        placeholder={t.onboarding.localization.locationPlaceholder} 
                        className="input-glow focus-ring-premium"
                        {...form.register("location")}
                      />
                      {form.formState.errors.location && <p className="text-destructive text-sm">{form.formState.errors.location.message}</p>}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="language">{t.onboarding.localization.language}</Label>
                      <Select 
                        onValueChange={(val: any) => {
                          form.setValue("language", val);
                          updateProfile({ language: val });
                        }}
                        defaultValue={form.getValues("language")}
                      >
                        <SelectTrigger className="focus-ring-premium">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                          <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                          <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding.goals.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding.goals.description}</p>
                    </div>

                    <div className="space-y-4">
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("fundingGoal", val as any)} 
                        defaultValue={form.getValues("fundingGoal")}
                        className="grid gap-4"
                      >
                        {[
                          { id: 'Grant', title: t.onboarding.goals.grant.title, desc: t.onboarding.goals.grant.desc },
                          { id: 'Angel', title: t.onboarding.goals.angel.title, desc: t.onboarding.goals.angel.desc },
                          { id: 'VC', title: t.onboarding.goals.vc.title, desc: t.onboarding.goals.vc.desc }
                        ].map((item, idx) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                            <motion.label
                              htmlFor={item.id}
                              className="flex items-center space-x-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                              </div>
                              <motion.div 
                                className="h-6 w-6 rounded-full border border-primary peer-data-[state=checked]:bg-primary"
                                whileHover={{ scale: 1.1 }}
                              />
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.fundingGoal && <p className="text-destructive text-sm">{form.formState.errors.fundingGoal.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding.documents.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding.documents.description}</p>
                    </div>

                    <div 
                      className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange}
                      />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{t.onboarding.documents.uploadText}</p>
                        <p className="text-xs text-muted-foreground">{t.onboarding.documents.uploadHint}</p>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <FileIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="flex justify-between mt-8 pt-6 border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="transition-all duration-200"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> {t.onboarding.buttons.back}
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button 
                    type="submit" 
                    className="px-8 btn-press glow-primary transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : t.onboarding.buttons.generate} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-8 btn-press glow-primary transition-all duration-300"
                  >
                    {t.onboarding.buttons.next} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
