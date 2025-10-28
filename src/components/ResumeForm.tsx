import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeFormProps {
  onSuccess: (content: string, formData: ResumeFormData) => void;
}

export interface ResumeFormData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export const ResumeForm = ({ onSuccess }: ResumeFormProps) => {
  const [generating, setGenerating] = useState(false);
  const [tone, setTone] = useState("professional");
  const { toast } = useToast();

  const [formData, setFormData] = useState<ResumeFormData>({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-resume", {
        body: { action: "generate", content: formData, tone },
      });

      if (error) throw error;

      toast({
        title: "Resume Generated!",
        description: "Your professional resume is ready",
      });

      onSuccess(data.content, formData);
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-8 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Create New Resume</h3>
          <p className="text-muted-foreground">Fill in your details and let AI craft your resume</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary *</Label>
          <Textarea
            id="summary"
            placeholder="Brief overview of your professional background and career goals..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Work Experience *</Label>
          <Textarea
            id="experience"
            placeholder="List your work experience, including job titles, companies, dates, and key achievements..."
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education *</Label>
          <Textarea
            id="education"
            placeholder="Your educational background, degrees, institutions, and dates..."
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills *</Label>
          <Textarea
            id="skills"
            placeholder="List your key skills, separated by commas..."
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={generating}
          size="lg"
          className="w-full gradient-primary text-white"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Resume...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate with AI
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};