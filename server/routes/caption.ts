import { RequestHandler } from "express";
import { z } from "zod";

const CaptionRequest = z.object({
  image: z.string(), // base64 encoded image
});

export type CaptionResponse = {
  caption: string;
  confidence: number;
  processingTime: number;
};

// Simulated AI model responses for demo purposes
// In production, this would integrate with actual AI services like:
// - OpenAI Vision API
// - Google Cloud Vision API
// - Azure Computer Vision
// - Hugging Face Transformers
const AI_RESPONSES = [
  {
    patterns: ['person', 'people', 'human', 'face'],
    captions: [
      "A person standing confidently with a warm smile, captured in natural lighting with a softly blurred background.",
      "Portrait of an individual with expressive eyes and genuine expression, photographed with professional composition.",
      "A group of people gathered together in a candid moment, showing natural interaction and positive energy.",
      "Close-up portrait featuring detailed facial features with excellent lighting and shallow depth of field."
    ]
  },
  {
    patterns: ['building', 'architecture', 'city', 'urban'],
    captions: [
      "Modern architectural structure with clean geometric lines and contemporary design elements against a clear sky.",
      "Urban cityscape featuring tall buildings with interesting play of light and shadow creating dramatic silhouettes.",
      "Detailed architectural photography showcasing intricate design patterns and structural elements with precise composition.",
      "Contemporary building facade with glass and steel construction reflecting the surrounding environment."
    ]
  },
  {
    patterns: ['nature', 'landscape', 'tree', 'mountain', 'water', 'sky'],
    captions: [
      "Breathtaking natural landscape with rolling hills and dramatic sky creating a serene and peaceful atmosphere.",
      "Majestic mountain vista with layered peaks extending into the distance under expansive cloudy skies.",
      "Tranquil water scene reflecting the surrounding landscape with perfect mirror-like clarity and natural beauty.",
      "Lush forest environment with dense vegetation and dappled sunlight filtering through the canopy above."
    ]
  },
  {
    patterns: ['food', 'meal', 'restaurant', 'kitchen'],
    captions: [
      "Artfully plated gourmet dish with vibrant colors and elegant presentation on pristine white dinnerware.",
      "Delicious culinary creation featuring fresh ingredients arranged with professional chef-level attention to detail.",
      "Appetizing meal showcasing rich textures and appealing colors that highlight the quality of ingredients used.",
      "Restaurant-quality food photography with perfect lighting emphasizing the dish's visual appeal and craftsmanship."
    ]
  },
  {
    patterns: ['animal', 'pet', 'dog', 'cat', 'wildlife'],
    captions: [
      "Adorable animal captured in a natural pose with expressive eyes and detailed fur texture in soft lighting.",
      "Wildlife photography featuring a beautiful creature in its natural habitat with excellent composition and timing.",
      "Domestic pet displaying personality and charm through body language and facial expression in comfortable setting.",
      "Animal portrait with sharp focus on distinctive features while maintaining a pleasing background blur."
    ]
  },
  {
    patterns: ['vehicle', 'car', 'transport', 'street'],
    captions: [
      "Sleek vehicle design showcased with dynamic angles highlighting modern engineering and aesthetic appeal.",
      "Transportation scene captured with motion and energy, demonstrating the relationship between vehicle and environment.",
      "Automotive photography featuring clean lines and reflective surfaces under optimal lighting conditions.",
      "Street scene with vehicles integrated into urban environment showing daily life and movement."
    ]
  }
];

const FALLBACK_CAPTIONS = [
  "A well-composed photograph with excellent lighting and clear visual elements that create an engaging and appealing image.",
  "High-quality image featuring interesting visual elements with good composition and professional photographic technique.",
  "Detailed photograph showcasing rich textures and colors with careful attention to lighting and visual balance.",
  "Artistic composition with strong visual impact featuring clear subject matter and skillful use of depth and perspective.",
  "Professional-quality image with excellent clarity and composition that effectively captures the essence of the subject matter."
];

// Simple keyword extraction from image analysis
// In production, this would use actual computer vision models
function extractImageFeatures(imageData: string): string[] {
  // This is a simulation - in real implementation, you would:
  // 1. Decode the base64 image
  // 2. Use a pre-trained CNN (like ResNet, VGG, or EfficientNet) for feature extraction
  // 3. Apply object detection models to identify elements
  // 4. Use scene classification to understand context
  
  // For demo, we'll simulate feature detection based on common patterns
  const commonFeatures = ['object', 'scene', 'lighting', 'composition'];
  return commonFeatures;
}

function generateIntelligentCaption(features: string[]): CaptionResponse {
  let selectedCaption = '';
  let confidence = 0.85; // Base confidence
  
  // Try to match patterns in image features to specialized captions
  for (const response of AI_RESPONSES) {
    const hasMatch = response.patterns.some(pattern => 
      features.some(feature => feature.toLowerCase().includes(pattern))
    );
    
    if (hasMatch) {
      selectedCaption = response.captions[Math.floor(Math.random() * response.captions.length)];
      confidence += 0.1; // Higher confidence for pattern matches
      break;
    }
  }
  
  // Fallback to general captions if no pattern match
  if (!selectedCaption) {
    selectedCaption = FALLBACK_CAPTIONS[Math.floor(Math.random() * FALLBACK_CAPTIONS.length)];
  }
  
  return {
    caption: selectedCaption,
    confidence: Math.min(confidence, 0.98), // Cap confidence at 98%
    processingTime: 1500 + Math.random() * 2000 // Simulate realistic processing time
  };
}

export const handleImageCaption: RequestHandler = async (req, res) => {
  try {
    // Validate request
    const validation = CaptionRequest.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request format",
        details: validation.error.errors
      });
    }
    
    const { image } = validation.data;
    
    // Validate base64 image format
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({
        error: "Invalid image format. Please provide a valid base64 encoded image."
      });
    }
    
    // Simulate processing time for realistic AI experience
    const processingStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    // Extract features from image (simulated)
    const features = extractImageFeatures(image);
    
    // Generate caption using simulated AI
    const result = generateIntelligentCaption(features);
    result.processingTime = Date.now() - processingStart;
    
    res.json(result);
    
  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({
      error: "Internal server error during caption generation",
      message: "Please try again or contact support if the problem persists."
    });
  }
};
