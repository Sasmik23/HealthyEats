// amplify/functions/processImage/handler.ts
import { Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async (event) => {
  const imageUrl = event.imageUrl; // Assuming the image URL is passed in the event

  try {
    const visionResponse = await axios.post(
      "https://api.openai.com/v1/vision",
      {
        model: "gpt-4-vision-latest",
        image: imageUrl,
        tasks: [
          {
            task: "Return the ingredients in this picture as a comma separated string",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extracting ingredients from the response
    const ingredients = parseIngredients(visionResponse.data);
    const ingredientsList = ingredients.join(", "); // Comma-separated list

    return {
      statusCode: 200,
      body: JSON.stringify({
        ingredients: ingredientsList,
      }),
    };
  } catch (error) {
    console.error("Error processing image with GPT-4 Vision API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process image" }),
    };
  }
};

// A function to parse ingredients from the API response
function parseIngredients(data: { choices: { text: any }[] }) {
  // Example parsing logic, adjust according to actual API response structure
  const descriptions = data.choices[0].text; // Assuming the text contains the description
  return descriptions.split(",").map((ingredient: string) => ingredient.trim());
}
