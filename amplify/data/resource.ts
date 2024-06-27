import { a, defineData, ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Dish: a
    .model({
      id: a.id(),
      dishName: a.string(),
      recipe: a.string(),
      rating: a.float(),
      ratingCount: a.integer(),
      calories: a.float(), // Added calories field
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Profile: a
    .model({
      id: a.id(),
      userId: a.string(),
      profilePicture: a.string(),
      name: a.string(),
      age: a.integer(),
      weight: a.float(),
      height: a.float(),
      bmi: a.float(),
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
      coordinates: a.string(), // Store coordinates as string
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
