import SimpleSchema from "simpl-schema";

/**
 * @name Attributes
 * @memberof Schemas
 * @type {SimpleSchema}
 * @property {String} property required
 * @property {String} value required
 * @property {String} propertyType required
 * @property {String} operator required
 */
export const Attributes = new SimpleSchema({
  property: String,
  value: String,
  propertyType: String,
  operator: String
});

/**
 * @name Destination
 * @memberof Schemas
 * @type {SimpleSchema}
 * @property {String} country optional
 * @property {String} region optional
 * @property {String} postal optional
 */
export const Destination = new SimpleSchema({
  "country": {
    type: Array,
    optional: true
  },
  "country.$": String,
  "region": {
    type: Array,
    optional: true
  },
  "region.$": String,
  "postal": {
    type: Array,
    optional: true
  },
  "postal.$": String
});

export const FulfillmentRestriction = new SimpleSchema({
  "name": {
    type: String,
    optional: true
  },
  "methodIds": {
    type: Array,
    optional: true
  },
  "methodIds.$": String,
  "type": String,
  "orderAttributes": {
    type: Array,
    optional: true
  },
  "orderAttributes.$": Attributes,
  "itemAttributes": {
    type: Array,
    optional: true
  },
  "itemAttributes.$": Attributes,
  "destination": {
    type: Destination,
    optional: true
  }
});

export const FulfillmentMethod = new SimpleSchema({
  "_id": {
    type: String,
    optional: true
  },
  "cost": {
    type: Number,
    optional: true
  },
  "fulfillmentTypes": {
    type: Array,
    minCount: 1
  },
  "fulfillmentTypes.$": String,
  "group": String,
  "handling": Number,
  "isEnabled": Boolean,
  "label": String,
  "name": String,
  "rate": Number
});
