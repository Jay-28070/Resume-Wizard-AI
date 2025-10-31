import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumePreviewProps {
  content: string;
  template: string;
  title: string;
}

interface StyleConfig {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerStyle: string;
}

const colorOptions = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#1f2937", label: "Gray" },
];

const fontOptions = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Modern)" },
  { value: "Georgia, serif", label: "Georgia (Classic)" },
  { value: "Merriweather, serif", label: "Merriweather (Elegant)" },
  { value: "Roboto, sans-serif", label: "Roboto (Clean)" },
];

export const ResumePreview = ({ content, template, title }: ResumePreviewProps) => {
  const { toast } = useToast();
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    primaryColor: template === "modern" ? "#8b5cf6" : "#3b82f6",
    accentColor: template === "modern" ? "#ec4899" : "#6366f1",
    fontFamily: template === "modern" ? "Inter, system-ui, sans-serif" : "Georgia, serif",
    headerStyle: template === "modern" ? "gradient" : "solid",
  });

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById("resume-preview-content");
      if (!element) throw new Error("Preview element not found");

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        windowHeight: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been saved as a PDF",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const renderResume = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentSection: string[] = [];
    let sectionTitle = '';
    let headerName = '';

    const flushSection = () => {
      if (currentSection.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-8">
            {sectionTitle && (
              <h2 
                className="font-bold mb-4 pb-2 border-b-2 text-xl"
                style={{ 
                  color: styleConfig.primaryColor,
                  borderColor: styleConfig.accentColor
                }}
              >
                {sectionTitle}
              </h2>
            )}
            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {currentSection.map((line, idx) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <div key={idx} className="font-semibold mt-3 mb-1" style={{ color: styleConfig.primaryColor }}>
                      {line.replace(/\*\*/g, '')}
                    </div>
                  );
                }
                return <div key={idx}>{line}</div>;
              })}
            </div>
          </div>
        );
        currentSection = [];
        sectionTitle = '';
      }
    };

    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        flushSection();
        sectionTitle = line.replace('### ', '').trim();
      } else if (line.startsWith('## ')) {
        flushSection();
        headerName = line.replace('## ', '').trim();
      } else if (line.trim() === '---') {
        // Skip separators
      } else if (!line.trim()) {
        if (currentSection.length > 0) {
          currentSection.push('');
        }
      } else {
        currentSection.push(line);
      }
    });

    flushSection();

    // Render header
    const headerStyle = styleConfig.headerStyle === "gradient"
      ? { background: `linear-gradient(135deg, ${styleConfig.primaryColor}, ${styleConfig.accentColor})` }
      : { backgroundColor: styleConfig.primaryColor };

    return (
      <>
        {headerName && (
          <div 
            className="mb-8 p-8 rounded-lg text-white"
            style={headerStyle}
          >
            <h1 className="text-4xl font-bold mb-2">{headerName}</h1>
            {template === "modern" && (
              <div className="h-1 w-24 bg-white/50 rounded-full" />
            )}
          </div>
        )}
        {elements}
      </>
    );
  };

  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="space-y-4">
        <div className="flex justify-end">
          <Button 
            onClick={handleDownload} 
            disabled={downloading}
            className="gradient-vibrant text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
        
        <div className="border rounded-lg bg-white shadow-lg overflow-hidden">
          <div 
            id="resume-preview-content"
            className="p-12 max-w-[800px] mx-auto"
            style={{ 
              fontFamily: styleConfig.fontFamily,
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            {renderResume()}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="customize" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <Select 
              value={styleConfig.primaryColor} 
              onValueChange={(value) => setStyleConfig({ ...styleConfig, primaryColor: value })}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: styleConfig.primaryColor }}
                  />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Accent Color</Label>
            <Select 
              value={styleConfig.accentColor} 
              onValueChange={(value) => setStyleConfig({ ...styleConfig, accentColor: value })}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: styleConfig.accentColor }}
                  />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Font Family</Label>
            <Select 
              value={styleConfig.fontFamily} 
              onValueChange={(value) => setStyleConfig({ ...styleConfig, fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Header Style</Label>
            <Select 
              value={styleConfig.headerStyle} 
              onValueChange={(value) => setStyleConfig({ ...styleConfig, headerStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted">
          <p className="text-sm text-muted-foreground">
            Preview your changes in the Preview tab. Your customizations will be applied to the downloaded PDF.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
