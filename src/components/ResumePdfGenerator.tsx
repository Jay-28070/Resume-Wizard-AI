import { forwardRef } from "react";

interface ResumePdfGeneratorProps {
  content: string;
  template: string;
}

export const ResumePdfGenerator = forwardRef<HTMLDivElement, ResumePdfGeneratorProps>(
  ({ content, template }, ref) => {
    const isModern = template === "modern";

    return (
      <div 
        ref={ref} 
        className="bg-white text-gray-900 p-12 max-w-[800px] mx-auto"
        style={{ 
          fontFamily: isModern ? 'system-ui, -apple-system, sans-serif' : 'Georgia, serif',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      >
        <style>
          {`
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}
        </style>
        {parseResumeContent(content, isModern)}
      </div>
    );
  }
);

ResumePdfGenerator.displayName = "ResumePdfGenerator";

function parseResumeContent(content: string, isModern: boolean) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentSection: string[] = [];
  let sectionTitle = '';

  const flushSection = () => {
    if (currentSection.length > 0) {
      elements.push(
        <div key={elements.length} className="mb-6">
          {sectionTitle && (
            <h2 
              className={`font-bold mb-3 pb-2 ${
                isModern 
                  ? 'text-2xl text-purple-600 border-b-2 border-purple-600' 
                  : 'text-xl text-purple-800 border-b border-purple-400'
              }`}
            >
              {sectionTitle}
            </h2>
          )}
          <div className="whitespace-pre-wrap">
            {currentSection.join('\n')}
          </div>
        </div>
      );
      currentSection = [];
      sectionTitle = '';
    }
  };

  lines.forEach((line, idx) => {
    // H2 headers (sections)
    if (line.startsWith('### ')) {
      flushSection();
      sectionTitle = line.replace('### ', '').trim();
    }
    // H1 header (name)
    else if (line.startsWith('## ')) {
      flushSection();
      const name = line.replace('## ', '').trim();
      elements.push(
        <h1 
          key={elements.length} 
          className={`font-bold mb-2 ${
            isModern 
              ? 'text-4xl text-purple-700' 
              : 'text-3xl text-purple-900'
          }`}
        >
          {name}
        </h1>
      );
    }
    // Horizontal rules (skip)
    else if (line.trim() === '---') {
      // Skip separators
    }
    // Empty lines
    else if (!line.trim()) {
      if (currentSection.length > 0) {
        currentSection.push('');
      }
    }
    // Regular content
    else {
      currentSection.push(line);
    }
  });

  flushSection();
  return elements;
}
