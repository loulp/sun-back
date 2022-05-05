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
    checkPrice(products) {
      let totalPrice = 0;

      products.forEach((el) => {
        strapi
          .service("api::bijou.bijou")
          .findOne(el.id)
          .then(
            (res) => {
              console.log("bijou " + el.id);
              this.totalPrice = this.totalPrice + res.prix;
            },
            (err) => {
              console.log(err);
            }
          );
      });

      console.log("function total : " + totalPrice);
      return totalPrice;
    },

    async createPaymentIntent(ctx) {
      try {
        //TODO Envoyé prix total et liste des id produits pour le calcul coté back du prix
        // const totalPrice = this.checkPrice(ctx.request.body.produits);
        console.log(ctx.request.body);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: ctx.request.body.prix_total * 100,
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
