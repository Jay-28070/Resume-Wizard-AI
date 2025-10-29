import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onSuccess: (content: string, template: string) => void;
}

export const ResumeUpload = ({ onSuccess }: ResumeUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
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

      onSuccess(data.content, selectedTemplate);
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
    <Card className="p-8 shadow-card border border-border">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="rounded-full gradient-vibrant p-4">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2 text-foreground">Upload Your Resume</h3>
          <p className="text-muted-foreground">
            Upload your existing resume and let AI enhance it
          </p>
        </div>

        {/* Template Selection */}
        <div className="w-full space-y-3">
          <Label>Choose Template *</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedTemplate("classic")}
              className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedTemplate === "classic"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Classic</h4>
                  <p className="text-xs text-muted-foreground">Traditional & Professional</p>
                </div>
              </div>
              {selectedTemplate === "classic" && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate("modern")}
              className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedTemplate === "modern"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Modern</h4>
                  <p className="text-xs text-muted-foreground">Creative & Eye-catching</p>
                </div>
              </div>
              {selectedTemplate === "modern" && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button disabled={uploading} size="lg" className="gradient-vibrant text-white">
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
