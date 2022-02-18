import SimpleSchema from "simpl-schema";
import ReactionError from "@reactioncommerce/reaction-error";
import { FulfillmentMethod } from "../simpleSchemas.js";

const inputSchema = new SimpleSchema({
  method: FulfillmentMethod,
  methodId: String,
  shopId: String
});

/**
 * @method updateFlatRateFulfillmentMethodMutation
 * @summary updates a flat rate fulfillment method
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Input (see SimpleSchema)
 * @returns {Promise<Object>} An object with a `method` property containing the updated method
 */
export default async function updateFlatRateFulfillmentMethodMutation(context, input) {
  const cleanedInput = inputSchema.clean(input); // add default values and such
  inputSchema.validate(cleanedInput);

  const { method: inputMethod, methodId, shopId } = cleanedInput;
  const { collections } = context;
  const { Shipping } = collections;
  const method = { ...inputMethod };

  await context.validatePermissions(`reaction:legacy:shippingMethods:${methodId}`, "update", { shopId });

  // MongoDB schema still uses `enabled` rather than `isEnabled`
  method.enabled = method.isEnabled;
  delete method.isEnabled;
  method._id = methodId;

  const { matchedCount } = await Shipping.updateOne({
    "methods._id": methodId,
    shopId
  }, {
    $set: {
      "methods.$": {
        ...method
      }
    }
  });
  if (matchedCount === 0) throw new ReactionError("not-found", "Not found");

  return { method };
}
