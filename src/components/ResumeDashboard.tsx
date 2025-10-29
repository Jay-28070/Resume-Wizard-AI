import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import type { Session } from "@supabase/supabase-js";

interface Resume {
  id: string;
  title: string;
  content: any;
  template: string;
  created_at: string;
  updated_at: string;
}

interface ResumeDashboardProps {
  session: Session | null;
  onPreview: (resume: Resume) => void;
  refreshTrigger?: number;
}

const ResumeCard = ({ resume, onPreview, onDownload, onDelete }: any) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'revealed' : ''}`}>
      <Card className="p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 border border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="rounded-lg gradient-vibrant p-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(resume.updated_at).toLocaleDateString()}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-foreground">{resume.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 capitalize">{resume.template} Template</p>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(resume)}
            className="flex-1"
          >
            <Eye className="mr-1 h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(resume)}
            className="flex-1 gradient-vibrant text-white"
          >
            <Download className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(resume.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const ResumeDashboard = ({ session, onPreview, refreshTrigger }: ResumeDashboardProps) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      fetchResumes();
    }
  }, [session, refreshTrigger]);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load resumes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Resume Deleted",
        description: "Resume has been removed successfully",
      });

      fetchResumes();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { color: #7c3aed; margin-bottom: 10px; }
            h2 { color: #a855f7; margin-top: 30px; border-bottom: 2px solid #a855f7; padding-bottom: 5px; }
            .section { margin: 20px 0; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <pre>${resume.content}</pre>
        </body>
        </html>
      `;

      const { data, error } = await supabase.functions.invoke("generate-pdf", {
        body: { html },
      });

      if (error) throw error;

      window.open(data.url, "_blank");

      toast({
        title: "PDF Generated",
        description: "Your resume is ready to download",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading your resumes...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No Resumes Yet</h3>
        <p className="text-muted-foreground">Create your first resume to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume, index) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onPreview={onPreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};
