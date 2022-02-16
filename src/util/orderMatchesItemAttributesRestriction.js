import operators from "@reactioncommerce/api-utils/operators.js";
import propertyTypes from "@reactioncommerce/api-utils/propertyTypes.js";

/**
 * @summary Check whether an attribute of an items matches with a provided value based on a provided comparison operator
 * @param {Object} item - item from an order
 * @param {Object} itemAttribute - item attribute restriction definition
 * @returns {boolean} true / false whether an item attribute matches a value
 */
function itemMatchesAttribute(item, { operator, property, propertyType, value }) {
  return operators[operator](
    item[property],
    propertyTypes[propertyType](value)
  );
}

/**
 * @summary Check whether an order matches any of the item attribute rules
 * @param {Object} commonOrder - hydrated order for current order
 * @param {Object} restriction - fulfillment restriction
 * @returns {boolean} true / false whether order matches any of the item attribute rules
 */
export default function orderMatchesItemAttributesRestriction(commonOrder, restriction) {
  const { itemAttributes } = restriction;

  if (!Array.isArray(itemAttributes)) return true;

  const { items } = commonOrder;
  const { type } = restriction;

  if (type === "deny") {
    return items.some((item) =>
      itemAttributes.every((itemAttributesRestriction) =>
        itemMatchesAttribute(item, itemAttributesRestriction)));
  }

  return items.every((item) =>
    itemAttributes.every((itemAttributesRestriction) =>
      itemMatchesAttribute(item, itemAttributesRestriction)));
}
