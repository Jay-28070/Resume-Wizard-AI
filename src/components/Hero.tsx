import { Button } from "@/components/ui/button";
import { FileText, Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onViewResumes: () => void;
}

export const Hero = ({ onGetStarted, onViewResumes }: HeroProps) => {
  return (
    <div className="relative bg-gradient-to-br from-background via-muted/30 to-background py-20 lg:py-32">
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 animate-scale-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Resume Builder</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl animate-slide-up">
            Create Professional Resumes
            <span className="block mt-2" style={{ background: 'linear-gradient(135deg, hsl(280, 80%, 55%), hsl(320, 90%, 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              That Get You Hired
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Build ATS-friendly resumes in minutes with AI assistance. Upload your existing resume for enhancement or create one from scratch with intelligent templates.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gradient-vibrant text-white shadow-vibrant hover:shadow-elegant transition-smooth hover:scale-105"
            >
              <FileText className="mr-2 h-5 w-5" />
              Create Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onViewResumes}
              className="border-primary/20 hover:bg-primary/5 transition-smooth"
            >
              View My Resumes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-xl bg-card p-8 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1 border border-border">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-vibrant">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">AI Enhancement</h3>
              <p className="text-sm text-muted-foreground">Professional AI rewrites your content for maximum impact</p>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1 border border-border">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-vibrant">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Premium Templates</h3>
              <p className="text-sm text-muted-foreground">ATS-optimized designs that recruiters love</p>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1 border border-border">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-vibrant">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Instant Export</h3>
              <p className="text-sm text-muted-foreground">Download print-ready PDFs instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
