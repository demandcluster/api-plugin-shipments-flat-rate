import SimpleSchema from "simpl-schema";
import ReactionError from "@reactioncommerce/reaction-error";

const inputSchema = new SimpleSchema({
  "restrictionIds": Array,
  "restrictionIds.$": String,
  "methodId": String,
  "shopId": String
});

/**
 * @method setRestrictionsOnFulfillmentMethod
 * @summary ensure only listed restrictions are applied to provided fulfillment method
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Input (see SimpleSchema)
 * @returns {Promise<Object>} An object with a `method` property containing the updated method
 */
export default async function setRestrictionsOnFulfillmentMethod(context, input) {
  const cleanedInput = inputSchema.clean(input); // add default values and such
  inputSchema.validate(cleanedInput);

  const { methodId, restrictionIds, shopId } = cleanedInput;
  const { collections } = context;
  const {
    Shipping,
    FlatRateFulfillmentRestrictions
  } = collections;

  for (const restrictionId of restrictionIds) {
    // eslint-disable-next-line no-await-in-loop
    await context.validatePermissions(`reaction:legacy:shippingRestrictions:${restrictionId}`, "update", { shopId });
  }

  const { result: { ok: addOk } } = await FlatRateFulfillmentRestrictions.updateMany({
    _id: {
      $in: restrictionIds
    },
    shopId
  }, {
    $addToSet: {
      methodIds: methodId
    }
  });

  const { result: { ok: pullOk } } = await FlatRateFulfillmentRestrictions.updateMany({
    _id: {
      $nin: restrictionIds
    },
    shopId
  }, {
    $pull: {
      methodIds: methodId
    }
  });

  if (addOk !== 1 || pullOk !== 1) {
    throw new ReactionError("server-error", "Unable to update all restrictions");
  }

  const doc = await Shipping.findOne({
    "methods._id": methodId,
    shopId
  });
  if (!doc) return null;

  // eslint-disable-next-line no-shadow
  const method = doc.methods.find((method) => method._id === methodId);

  return {
    method
  };
}
