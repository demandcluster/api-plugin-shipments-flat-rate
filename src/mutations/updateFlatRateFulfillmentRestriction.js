import SimpleSchema from "simpl-schema";
import ReactionError from "@reactioncommerce/reaction-error";
import { FulfillmentRestrictionSchema } from "../simpleSchemas.js";

const inputSchema = new SimpleSchema({
  restrictionId: String,
  restriction: FulfillmentRestrictionSchema,
  shopId: String
});


/**
 * @method updateFlatRateFulfillmentRestrictionMutation
 * @summary updates a flat rate fulfillment method
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Input (see SimpleSchema)
 * @returns {Promise<Object>} An object with a `restriction` property containing the updated method
 */
export default async function updateFlatRateFulfillmentRestrictionMutation(context, input) {
  const cleanedInput = inputSchema.clean(input); // add default values and such
  inputSchema.validate(cleanedInput);

  const { restriction, restrictionId, shopId } = cleanedInput;
  const { collections } = context;
  const { FlatRateFulfillmentRestrictions } = collections;

  await context.validatePermissions(`reaction:legacy:shippingRestrictions:${restrictionId}`, "update", { shopId });

  const { ok, value: updatedRestriction } = await FlatRateFulfillmentRestrictions.findOneAndUpdate({
    _id: restrictionId,
    shopId
  }, {
    $set: {
      ...restriction
    }
  }, {
    returnOriginal: false
  });

  if (ok !== 1) {
    throw new ReactionError("server-error", "Unable to find or update restriction");
  }

  return {
    restriction: updatedRestriction
  };
}
