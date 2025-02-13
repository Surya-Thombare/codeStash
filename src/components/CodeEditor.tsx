// components/CodeEditor.tsx
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { languages } from "@shared/schema";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import all language styles
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);

function truncateCode(code: string, maxLines: number): string {
  const lines = code.split('\n');
  if (lines.length <= maxLines) return code;
  return lines.slice(0, maxLines).join('\n') + '\n// ...';
}

interface CodeEditorProps {
  code: string;
  language: typeof languages[number];
  showCopy?: boolean;
  maxLines?: number;
}

// components/CodeEditor.tsx
// ... (previous imports and language registrations remain the same)

export function CodeEditor({ code, language, showCopy = true, maxLines }: CodeEditorProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const displayCode = maxLines ? truncateCode(code, maxLines) : code;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        description: "Code copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        description: "Failed to copy code",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="relative group">
      {showCopy && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-2 top-2 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={copyCode}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SyntaxHighlighter
          language={language}
          style={vs2015}
          className="!bg-slate-900 !font-mono rounded-md overflow-hidden"
          customStyle={{
            padding: "1.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
            margin: 0,
          }}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
        >
          {displayCode}
        </SyntaxHighlighter>
      </motion.div>
    </div>
  );
}