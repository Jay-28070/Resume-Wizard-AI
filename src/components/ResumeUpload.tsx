import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onSuccess: (content: string) => void;
}

export const ResumeUpload = ({ onSuccess }: ResumeUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const text = await file.text();
      
      const { data, error } = await supabase.functions.invoke("generate-resume", {
        body: { action: "enhance", content: text, tone: "professional" },
      });

      if (error) throw error;

      toast({
        title: "Resume Enhanced!",
        description: "Your resume has been processed with AI",
      });

      onSuccess(data.content);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-8 shadow-card transition-smooth hover:shadow-glow">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-full gradient-primary p-4">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Upload Your Resume</h3>
          <p className="text-muted-foreground">
            Upload your existing resume and let AI enhance it
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button disabled={uploading} size="lg" className="gradient-primary text-white">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Choose File
              </>
            )}
          </Button>
        </label>
        <p className="text-xs text-muted-foreground">
          Supports TXT, DOC, DOCX, PDF formats
        </p>
      </div>
    </Card>
  );
};