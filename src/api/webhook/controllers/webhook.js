"use strict";

const stripe = require("stripe");
const endpointSecret =
  "whsec_cb68cdc6f0e967d2a51110dc7900541d0bd9ce27cdeb1bb7b72336f803ebc2a1";

/**
 *  webhook controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::webhook.webhook", ({ strapi }) => ({
  async stripePaymentSuccess(ctx) {
    try {
        ctx.body = 'ok';
        console.log("test");
      } catch (err) {
        ctx.body = err;
      }
    // const sig = ctx.request.headers["stripe-signature"];

    // let event;

    // try {
    //   event = stripe.webhooks.constructEvent(ctx.request.body, sig, endpointSecret);
    // } catch (err) {
    //     ctx.response.status(400).send(`Webhook Error: ${err.message}`);
    //   return;
    // }

    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // response.send();
  },
}));
