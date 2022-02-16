import orderPassesRestrictions from "./orderPassesRestrictions.js";

/**
 * @summary Filter shipping methods based on global restrictions
 * @param {Object} context - an object containing the per-request state
 * @param {Object} commonOrder - common order from cart or order
 * @returns {Object|null} available shipping methods after filtering
 */
export default async function orderPassesGlobalRestrictions(context, commonOrder) {
  const { FlatRateFulfillmentRestrictions } = context.collections;

  const globalRestrictions = await FlatRateFulfillmentRestrictions
    .find({ methodIds: null })
    .toArray();

  return orderPassesRestrictions(commonOrder, globalRestrictions);
}
