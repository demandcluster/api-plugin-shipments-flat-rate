import orderMatchesDestinationRestriction from "./orderMatchesDestinationRestriction.js";
import orderMatchesItemAttributesRestriction from "./orderMatchesItemAttributesRestriction.js";

/**
 * @summary Check whether a common order passes all restrictions
 * @param {Object} commonOrder - hydrated order for current order
 * @param {Object} fulfillmentRestrictions - fulfillment method restrictions
 * @returns {boolean} true / false whether method is still valid after this check
 */
export default function orderPassesRestrictions(commonOrder, fulfillmentRestrictions) {
  return fulfillmentRestrictions.every((restriction) => {
    const { type } = restriction;
    if (type === "deny") {
      return !(
        orderMatchesItemAttributesRestriction(commonOrder, restriction) &&
          orderMatchesDestinationRestriction(commonOrder, restriction)
      );
    }

    // type === "allow"
    return orderMatchesItemAttributesRestriction(commonOrder, restriction) &&
      orderMatchesDestinationRestriction(commonOrder, restriction);
  });
}
