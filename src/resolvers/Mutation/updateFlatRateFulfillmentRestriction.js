import {
  decodeFulfillmentMethodOpaqueId,
  decodeFulfillmentRestrictionOpaqueId,
  decodeShopOpaqueId
} from "../../xforms/id.js";
import updateFlatRateFulfillmentRestrictionMutation from "../../mutations/updateFlatRateFulfillmentRestriction.js";

/**
 * @name Mutation/updateFlatRateFulfillmentRestriction
 * @method
 * @memberof Fulfillment/GraphQL
 * @summary resolver for the updateFlatRateFulfillmentRestriction GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args - update mutation args
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} args.input.restrictionId - The ID of the restriction you want to update
 * @param {Object} args.input.restriction - The full updated restriction object, without ID
 * @param {String} args.input.shopId - The shop to update this flat rate fulfillment restriction for
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} updateFlatRateFulfillmentRestrictionPayload
 */
export default async function updateFlatRateFulfillmentRestriction(parentResult, { input }, context) {
  const { clientMutationId = null, restriction, restrictionId: opaqueRestrictionId, shopId: opaqueShopId } = input;

  const shopId = decodeShopOpaqueId(opaqueShopId);
  const restrictionId = decodeFulfillmentRestrictionOpaqueId(opaqueRestrictionId);

  if (restriction.methodIds && Array.isArray(restriction.methodIds)) {
    restriction.methodIds = restriction.methodIds.map(decodeFulfillmentMethodOpaqueId);
  }

  const { restriction: updatedRestriction } = await updateFlatRateFulfillmentRestrictionMutation(context, {
    restriction,
    restrictionId,
    shopId
  });

  return {
    clientMutationId,
    restriction: updatedRestriction
  };
}
