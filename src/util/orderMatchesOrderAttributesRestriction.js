import operators from "@reactioncommerce/api-utils/operators.js";
import propertyTypes from "@reactioncommerce/api-utils/propertyTypes.js";

/**
 * @summary Check whether an attribute of an order matches with a provided value based on a provided comparison operator
 * @param {Object} order - a common order
 * @param {Object} orderAttribute - order attribute restriction definition
 * @returns {boolean} true / false whether an order attribute matches a value
 */
function orderMatchesAttribute(order, { operator, property, propertyType, value }) {
  return operators[operator](
    order[property],
    propertyTypes[propertyType](value)
  );
}

/**
 * @summary Check whether an order matches any of the order attribute rules
 * @param {Object} commonOrder - hydrated order for current order
 * @param {Object} restriction - fulfillment restriction
 * @returns {boolean} true / false whether order matches any of the order attribute rules
 */
export default function orderMatchesOrderAttributesRestriction(commonOrder, restriction) {
  const { orderAttributes } = restriction;

  if (!Array.isArray(orderAttributes)) return true;

  return orderAttributes.every((orderAttributesRestriction) =>
    orderMatchesAttribute(commonOrder, orderAttributesRestriction));
}
