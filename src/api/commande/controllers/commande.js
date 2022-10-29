"use strict";

// TODO add env var
const stripe = require("stripe")(process.env.STRIPE_TOKEN);

/**
 *  commande controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::commande.commande",
  ({ strapi }) => ({
    async createPaymentIntent(ctx) {
      try {
        let totalPrice = 0;
        let promise = await Promise.all(
          ctx.request.body.produits.map(async (el) => {
            await strapi
              .service("api::bijou.bijou")
              .findOne(el.id)
              .then(
                (res) => {
                  totalPrice = totalPrice + res.prix;
                },
                (err) => {
                  console.log(err);
                }
              );
          })
        );

        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalPrice * 100,
          currency: "eur",
          automatic_payment_methods: { enabled: true },
        });

        const secret = paymentIntent;

        return secret;
      } catch (err) {
        console.log(err);
      }
    },
  })
);
