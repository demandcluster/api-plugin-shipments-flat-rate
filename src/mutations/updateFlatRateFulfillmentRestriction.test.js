import mockCollection from "@reactioncommerce/api-utils/tests/mockCollection.js";
import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import updateFlatRateFulfillmentRestrictionMutation from "./updateFlatRateFulfillmentRestriction.js";


// Create mock context with FlatRateFulfillmentRestrictions collection
mockContext.collections.FlatRateFulfillmentRestrictions = mockCollection("FlatRateFulfillmentRestrictions");
mockContext.validatePermissions.mockReturnValueOnce(Promise.resolve(null));

const restriction = {
  name: "Restrict knifes in CO and NY",
  type: "deny",
  itemAttributes: [
    { property: "vendor", value: "reaction", propertyType: "string", operator: "eq" },
    { property: "productType", value: "knife", propertyType: "string", operator: "eq" }
  ],
  destination: { region: ["CO", "NY"] }
};

const dbRestriction = {
  _id: "restriction123",
  shopId: "shop123",
  ...restriction
};

test("update a flat rate fulfillment restriction", async () => {
  mockContext.collections.FlatRateFulfillmentRestrictions.findOneAndUpdate.mockReturnValueOnce(Promise.resolve({
    ok: 1,
    value: dbRestriction
  }));

  const result = await updateFlatRateFulfillmentRestrictionMutation(mockContext, {
    restriction,
    restrictionId: "restriction123",
    shopId: "shop123"
  });

  expect(result).toEqual({
    restriction: {
      _id: "restriction123",
      name: "Restrict knifes in CO and NY",
      type: "deny",
      itemAttributes: [
        { property: "vendor", value: "reaction", propertyType: "string", operator: "eq" },
        { property: "productType", value: "knife", propertyType: "string", operator: "eq" }
      ],
      destination: { region: ["CO", "NY"] },
      shopId: "shop123"
    }
  });
});
