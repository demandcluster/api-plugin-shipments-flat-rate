import orderPassesRestrictions from "./orderPassesRestrictions.js";

/**
 * @summary Filter fulfillment methods based on per method restrictions
 * @param {Object} context - an object containing the per-request state
 * @param {Object} methods - all available shipping methods for a shop
 * @param {Object} commonOrder - common order from cart or order
 * @returns {Object|null} available shipping methods after filtering
 */
export default async function filterFulfillmentMethods(context, methods, commonOrder) {
  const { FlatRateFulfillmentRestrictions } = context.collections;

  return methods.reduce(async (validFulfillmentMethods, method) => {
    const awaitedValidFulfillmentMethods = await validFulfillmentMethods;
    if (!method.enabled) {
      return awaitedValidFulfillmentMethods;
    }

    const methodRestrictions = await FlatRateFulfillmentRestrictions
      .find({ methodIds: method._id })
      .toArray();

    if (orderPassesRestrictions(commonOrder, methodRestrictions)) {
      awaitedValidFulfillmentMethods.push(method);
    }

    return awaitedValidFulfillmentMethods;
  }, Promise.all([]));
}
