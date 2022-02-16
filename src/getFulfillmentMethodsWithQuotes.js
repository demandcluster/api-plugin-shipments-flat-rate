import Logger from "@reactioncommerce/logger";
import filterFulfillmentMethods from "./util/filterFulfillmentMethods.js";
import orderPassesGlobalRestrictions from "./util/isOrderShippingGloballyRestricted.js";
import handleNoFulfillmentMethodsWithQuotes from "./util/handleNoFulfillmentMethodsWithQuotes.js";

export const packageName = "flat-rate-shipping";

/**
 * @summary Returns a list of fulfillment method quotes based on the items in a fulfillment group.
 * @param {Object} context - Context
 * @param {Object} commonOrder - details about the purchase a user wants to make.
 * @param {Array} [previousQueryResults] - an array of shipping rates and
 * info about failed calls to the APIs of some shipping methods providers
 * e.g Shippo.
 * @returns {Array} - an array that contains two arrays: the first array will
 * be an updated list of shipping rates, and the second will contain info for
 * retrying this specific package if any errors occurred while retrieving the
 * shipping rates.
 * @private
 */
export default async function getFulfillmentMethodsWithQuotes(context, commonOrder, previousQueryResults = []) {
  const { collections } = context;
  const { Shipping } = collections;
  const [rates = [], retrialTargets = []] = previousQueryResults;

  if (retrialTargets.length > 0) {
    const isNotAmongFailedRequests = retrialTargets.every((target) => target.packageName !== packageName);
    if (isNotAmongFailedRequests) {
      return previousQueryResults;
    }
  }

  const { isShippingRatesFulfillmentEnabled } = await context.queries.appSettings(context, commonOrder.shopId);

  if (!isShippingRatesFulfillmentEnabled) {
    return [rates, retrialTargets];
  }

  const shippings = await Shipping.find({
    "shopId": commonOrder.shopId,
    "provider.enabled": true
  }).toArray();

  const initialNumOfRates = rates.length;

  if (!(await orderPassesGlobalRestrictions(context, commonOrder))) {
    return handleNoFulfillmentMethodsWithQuotes(rates, retrialTargets);
  }

  const awaitedMethods = shippings.map(async (shipping) => {
    const carrier = shipping.provider.label;
    // Check for method specific shipping restrictions
    const availableShippingMethods = await filterFulfillmentMethods(context, shipping.methods, commonOrder);
    for (const method of availableShippingMethods) {
      if (!method.rate) {
        method.rate = 0;
      }
      if (!method.handling) {
        method.handling = 0;
      }
      // Store shipping provider here in order to have it available in shipmentMethod
      // for cart and order usage
      if (!method.carrier) {
        method.carrier = carrier;
      }

      rates.push({
        carrier,
        handlingPrice: method.handling,
        method,
        rate: method.rate,
        shippingPrice: method.rate + method.handling,
        shopId: shipping.shopId
      });
    }
  });
  await Promise.all(awaitedMethods);

  if (rates.length === initialNumOfRates) {
    return handleNoFulfillmentMethodsWithQuotes(rates, retrialTargets);
  }

  Logger.debug("Flat rate getFulfillmentMethodsWithQuotes", rates);
  return [rates, retrialTargets];
}
