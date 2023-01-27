import orderMatchesDestinationRestriction from "./orderMatchesDestinationRestriction.js";
import orderMatchesItemAttributesRestriction from "./orderMatchesItemAttributesRestriction.js";
import orderMatchesOrderAttributesRestriction from "./orderMatchesOrderAttributesRestriction.js";

/**
 * @summary Check whether a common order passes all restrictions
 * @param {Object} commonOrder - hydrated order for current order
 * @param {Object} fulfillmentRestrictions - fulfillment method restrictions
 * @returns {boolean} true / false whether method is still valid after this check
 */
export default function orderPassesRestrictions(commonOrder, fulfillmentRestrictions) {
  return fulfillmentRestrictions.every((restriction) => {
    const { type } = restriction;

    const matchesRestriction = orderMatchesOrderAttributesRestriction(commonOrder, restriction) &&
      orderMatchesItemAttributesRestriction(commonOrder, restriction) &&
      orderMatchesDestinationRestriction(commonOrder, restriction);

    return type === "deny" ? !matchesRestriction : true;
  });
}
