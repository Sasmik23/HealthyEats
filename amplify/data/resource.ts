import { a, defineData, ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Recipe: a
    .model({
      id: a.id(),
      dishName: a.string(),
      ingredients: a.string().array(),
      cuisine: a.string(),
      steps: a.string().array(),
      healthy_cooking_tips: a.string().array(),
      nutrition_information: a.customType({
        servings_per_dish: a.integer(),
        energy: a.string(),
        carbohydrate: a.string(),
        protein: a.string(),
        total_fat: a.string(),
        saturated_fat: a.string(),
        cholesterol: a.string(),
        dietary_fibre: a.string(),
        sodium: a.string(),
      }),
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
      points: a.integer(),
      referralCode: a.string(),
      redeemed: a.boolean(),
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
      brandAndProductName: a.string(),
      packageSize: a.string(),
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
