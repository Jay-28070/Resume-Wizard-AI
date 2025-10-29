import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResumeForm, type ResumeFormData } from "@/components/ResumeForm";
import { ResumeDashboard } from "@/components/ResumeDashboard";
import { Auth } from "@/components/Auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showResumesDialog, setShowResumesDialog] = useState(false);
  const [previewResume, setPreviewResume] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  const handleResumeSuccess = async (content: string, formData?: ResumeFormData, template?: string) => {
    try {
      const title = formData?.name ? `${formData.name}'s Resume` : "My Resume";
      
      const { error } = await supabase.from("resumes").insert({
        user_id: user?.id,
        title,
        content,
        template: template || "classic",
      });

      if (error) throw error;

      toast({
        title: "Resume Saved!",
        description: "Your resume has been saved to your dashboard",
      });

      setShowCreateDialog(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save resume",
        variant: "destructive",
      });
    }
  };

  const openResumesDialog = () => {
    setShowResumesDialog(true);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Resume Builder
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onGetStarted={() => setShowCreateDialog(true)} onViewResumes={openResumesDialog} />

      {/* Create Resume Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Your Resume</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-6">
              <ResumeUpload onSuccess={(content, template) => {
                handleResumeSuccess(content, undefined, template);
              }} />
            </TabsContent>
            <TabsContent value="create" className="mt-6">
              <ResumeForm onSuccess={(content, formData, template) => {
                handleResumeSuccess(content, formData, template);
              }} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Resumes Dialog */}
      <Dialog open={showResumesDialog} onOpenChange={setShowResumesDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Resumes</DialogTitle>
          </DialogHeader>
          <ResumeDashboard session={session} onPreview={setPreviewResume} refreshTrigger={refreshTrigger} />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewResume?.title}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-foreground">{previewResume?.content}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
