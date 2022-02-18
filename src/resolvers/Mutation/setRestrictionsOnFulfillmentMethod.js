import {
  decodeFulfillmentMethodOpaqueId,
  decodeFulfillmentRestrictionOpaqueId,
  decodeShopOpaqueId
} from "../../xforms/id.js";
import setRestrictionsOnFulfillmentMethodMutation from "../../mutations/setRestrictionsOnFulfillmentMethod.js";

/**
 * @name Mutation/setRestrictionsOnFulfillmentMethod
 * @method
 * @memberof Fulfillment/GraphQL
 * @summary resolver for the setRestrictionsOnFulfillmentMethod GraphQL mutation
 * @param {Object} _ - unused
 * @param {Object} args - update mutation args
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} args.input.restrictionIds - The IDs of the restrictions you want to add to the mutation
 * @param {Object} args.input.mutationId - The ID of the method you want to update
 * @param {String} args.input.shopId - The shop to update this flat rate fulfillment restriction for
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} setRestrictionsOnFulfillmentMethodPayload
 */
export default async function setRestrictionsOnFulfillmentMethod(_, { input }, context) {
  const { clientMutationId = null, restrictionIds: opaqueRestrictionIds, methodId: opaqueMethodId, shopId: opaqueShopId } = input;

  const shopId = decodeShopOpaqueId(opaqueShopId);
  const methodId = decodeFulfillmentMethodOpaqueId(opaqueMethodId);
  const restrictionIds = opaqueRestrictionIds.map(decodeFulfillmentRestrictionOpaqueId);

  const { method } = await setRestrictionsOnFulfillmentMethodMutation(context, {
    methodId,
    restrictionIds,
    shopId
  });

  return {
    clientMutationId,
    method
  };
}
