/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for /api/caption
 */
export interface CaptionRequest {
  image: string; // base64 encoded image
}

/**
 * Response type for /api/caption
 */
export interface CaptionResponse {
  caption: string;
  confidence: number;
  processingTime: number;
}
