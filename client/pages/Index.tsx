import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Brain, Zap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CaptionRequest, CaptionResponse } from '@shared/api';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [caption, setCaption] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCaption(''); // Clear previous caption
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaption(data.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
      setCaption('Sorry, there was an error generating the caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setCaption('');
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-ai rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">VisionAI</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Images into
              <span className="gradient-text block mt-2">Intelligent Captions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the power of computer vision and natural language processing. 
              Upload any image and watch our AI generate detailed, contextual captions instantly.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="px-4 py-2">
              <Camera className="w-4 h-4 mr-2" />
              Computer Vision
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Neural Networks
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Processing
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="upload-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Upload Image</h3>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleUploadClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img
                        src={selectedImage}
                        alt="Uploaded"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUploadClick();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 gradient-ai rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Drop your image here</p>
                        <p className="text-muted-foreground">or click to browse</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {selectedImage && (
                  <div className="mt-6">
                    <Button 
                      onClick={generateCaption}
                      disabled={isGenerating}
                      className="w-full gradient-ai"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Caption...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Caption
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="upload-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">AI-Generated Caption</h3>
                
                {caption ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-6 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 gradient-ai rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-2">AI Caption</p>
                          <p className="text-base leading-relaxed">{caption}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(caption)}
                      >
                        Copy Caption
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={generateCaption}
                        disabled={isGenerating}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : selectedImage ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Click "Generate Caption" to analyze your image
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Upload an image to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Powered by advanced computer vision and natural language processing
          </p>
        </div>
      </footer>
    </div>
  );
}
