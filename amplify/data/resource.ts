import { a, defineData, ClientSchema } from "@aws-amplify/backend";
const schema = a.schema({
  Dish: a
    .model({
      id: a.id(),
      dishName: a.string(),
      recipe: a.string(),
      rating: a.float(),
      ratingCount: a.integer(),
      calories: a.float(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Profile: a
    .model({
      id: a.id(),
      userId: a.string(),
      profilePicture: a.string(),
      age: a.integer(),
      weight: a.float(),
      height: a.float(),
      bmi: a.float(),
      chronicDisease: a.string(),
      healthGoal: a.string(),
      targetWeight: a.float(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  HealthyEateries: a
    .model({
      id: a.id(),
      name: a.string(),
      addressBlockHouseNumber: a.string(),
      addressBuildingName: a.string(),
      addressPostalCode: a.string(),
      addressStreetName: a.string(),
      addressType: a.string(),
      description: a.string(),
      addressFloorNumber: a.string(),
      addressUnitNumber: a.string(),
      coordinates: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Ingredients: a
    .model({
      brandAndProductName: a.string(), // Partition key
      packageSize: a.string(), // Sort key
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
