import operators from "@reactioncommerce/api-utils/operators.js";
import propertyTypes from "@reactioncommerce/api-utils/propertyTypes.js";

/**
 * @summary Access nested object property providing accessor with "." separator
 * Example:
 * const object = {
 *   property: {
 *     value: 10
 *   }
 * }
 * getNestedProperty(object, "property.value") // Outputs: 10
 * @param {Object} object - the object
 * @param {Object} propertyAccessorString - property accessor with "." separator
 * @returns {Object | undefined} - the property of the object
 */
function getNestedProperty(object, propertyAccessorString) {
  if (!propertyAccessorString) return object;

  const propertyAccessors = propertyAccessorString.split(".");
  let resultObjectProperty = object;

  for (const propertyAccessor of propertyAccessors) {
    resultObjectProperty = resultObjectProperty[propertyAccessor];

    if (resultObjectProperty === undefined) {
      break;
    }
  }

  return resultObjectProperty;
}

/**
 * @summary Check whether an attribute of an order matches with a provided value based on a provided comparison operator
 * @param {Object} order - a common order
 * @param {Object} orderAttribute - order attribute restriction definition
 * @returns {boolean} true / false whether an order attribute matches a value
 */
function orderMatchesAttribute(order, { operator, property, propertyType, value }) {
  const orderProperty = property.includes(".") ?
    getNestedProperty(order, property) :
    order[property];

  return operators[operator](
    orderProperty,
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
