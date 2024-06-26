// amplify/functions/processImage/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const processImage = defineFunction({
  name: "processImage",
  entry: "./handler.ts", // Path to the handler file
});
