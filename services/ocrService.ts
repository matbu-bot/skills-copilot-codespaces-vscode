/**
 * Stub service for OCR recipe extraction from photos
 * In production, this would integrate with Google Cloud Vision, AWS Textract,
 * or similar OCR services to extract recipe text from images
 */
export interface OcrRecipeResult {
  title?: string
  ingredients: string[]
  instructions: string[]
  confidence: number
}

export async function extractRecipeFromImage(
  imageFile: File
): Promise<OcrRecipeResult> {
  // Simulate OCR processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // TODO: Integrate with OCR service (Google Cloud Vision, Azure Computer Vision, AWS Textract)
  // TODO: Parse extracted text into structured recipe format
  
  // Return mock OCR result
  return {
    title: 'Chocolate Chip Cookies',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 cup butter, softened',
      '3/4 cup sugar',
      '2 eggs',
      '2 cups chocolate chips',
    ],
    instructions: [
      'Preheat oven to 375°F',
      'Mix flour and baking soda',
      'Cream butter and sugar',
      'Beat in eggs',
      'Stir in flour mixture',
      'Fold in chocolate chips',
      'Bake 9-11 minutes',
    ],
    confidence: 0.85,
  }
}
