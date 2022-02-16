import { packageName } from "../getFulfillmentMethodsWithQuotes.js";

/**
 * @summary Add a single error rate to the rates list as a fallback
 * if package filters all fulfillment methods
 * @param {Object[]} rates All fulfillment rates
 * @param {Object} retrialTargets retrial targets
 * @return {[Object[], Object]} - rates and retrialTargets array tuple
 */
export default function handleNoFulfillmentMethodsWithQuotes(rates, retrialTargets) {
  const currentMethodInfo = { packageName };
  const errorDetails = {
    requestStatus: "error",
    shippingProvider: packageName,
    message: "Flat rate shipping did not return any shipping methods."
  };
  rates.push(errorDetails);
  retrialTargets.push(currentMethodInfo);
  return [rates, retrialTargets];
}
