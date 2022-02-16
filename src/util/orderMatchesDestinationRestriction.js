/**
 * @summary Returns true if the given shipping address matches any of the destination rules
 * @param {Object} commonOrder - hydrated order for current order
 * @param {Object} restriction - fulfillment restriction
 * @return {true | false} whether the address of the order matches any of the destination rules
 */
export default function orderMatchesDestinationRestriction(commonOrder, restriction) {
  const { shippingAddress } = commonOrder;
  if (!shippingAddress) return true;

  const { destination } = restriction;
  if (!destination) return true;

  const {
    country: restrictionCountry,
    postal: restrictionPostal,
    region: restrictionRegion
  } = destination;

  // Start checking at the micro-level, and move more macro as we go on
  if (restrictionPostal && restrictionPostal.includes(shippingAddress.postal)) {
    return true;
  }

  if (restrictionRegion && restrictionRegion.includes(shippingAddress.region)) {
    return true;
  }

  return restrictionCountry && restrictionCountry.includes(shippingAddress.country);
}
