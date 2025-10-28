import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-secondary/95" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm animate-scale-in">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-white">AI-Powered Resume Builder</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl animate-slide-up">
            Build Your Dream Career
            <span className="block gradient-card bg-clip-text text-transparent">
              With AI Assistance
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create professional, ATS-friendly resumes in minutes. Upload your existing resume for AI enhancement or build from scratch with our intelligent templates.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="group relative overflow-hidden bg-white text-primary hover:bg-white/90 shadow-glow transition-smooth"
            >
              <FileText className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-smooth"
            >
              View Templates
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-smooth hover:bg-white/15">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-secondary" />
              <h3 className="mb-2 font-semibold text-white">AI Enhancement</h3>
              <p className="text-sm text-white/80">Professional AI rewrites your content</p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-smooth hover:bg-white/15">
              <FileText className="mx-auto mb-3 h-8 w-8 text-secondary" />
              <h3 className="mb-2 font-semibold text-white">Premium Templates</h3>
              <p className="text-sm text-white/80">ATS-optimized professional designs</p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-smooth hover:bg-white/15">
              <svg className="mx-auto mb-3 h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <h3 className="mb-2 font-semibold text-white">Instant PDF Export</h3>
              <p className="text-sm text-white/80">Download print-ready resumes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};