import resolveShopFromShopId from "@reactioncommerce/api-utils/graphql/resolveShopFromShopId.js";
import { encodeFulfillmentMethodOpaqueId } from "../../xforms/id.js";
import getMethodRestrictions from "../../util/getMethodRestrictions.js";

export default {
  _id: (node) => encodeFulfillmentMethodOpaqueId(node._id),
  shop: resolveShopFromShopId,
  isEnabled: (node) => !!node.enabled,
  restrictions: (node, _, context) => getMethodRestrictions(context, node._id)
};
