"use strict";

const stripe = require("stripe")(
  "sk_test_51KXq5eJSoM2Bze2H0tQtx2F8oHoCWvvp3PVybCj0PG5iUv3TURe5HXYRYMVWI7am4SUclQpA4x5LXIzOZXolf46A00csgdYKrq"
);

/**
 *  commande controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::commande.commande",
  ({ strapi }) => ({

    async createPaymentIntent(ctx) {
      
      //TODO Envoyé prix total et liste des id produits pour le calcul coté back du prix
      try {
        console.log(ctx.request.body);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: 10 * 100,
          currency: "eur",
        });

        const secret = paymentIntent.client_secret;

        return secret;
      } catch (err) {
        console.log(err);
      }
    },
  })
);
