// amplify/functions/api-function/handler.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Consider restricting to specific domains
      "Access-Control-Allow-Headers": "*", // Specify necessary headers
    },
    body: JSON.stringify("Hello from api-function!"),
  };
};
