/**
 * @summary Get all flat rate fulfillment restrictions that contain the provided method ID
 * @param {Object} context - an object containing the per-request state
 * @param {Object} methodId - the target method id to be searched against
 * @returns {Object[]} - all matching restrictions
 */
export default async function getMethodRestrictions(context, methodId) {
  const { FlatRateFulfillmentRestrictions } = context.collections;

  const restrictions = FlatRateFulfillmentRestrictions.find({
    methodIds: methodId
  });

  return restrictions.toArray();
}
