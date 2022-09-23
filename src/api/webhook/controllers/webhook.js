"use strict";

const stripe = require("stripe");
const unparsed = Symbol.for("unparsedBody");
const endpointSecret =
  // "whsec_cb68cdc6f0e967d2a51110dc7900541d0bd9ce27cdeb1bb7b72336f803ebc2a1";
  "whsec_cQtVFceYbn0dkr4Nmg639VPNSxwoFaB5";

/**
 *  webhook controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::webhook.webhook", ({ strapi }) => ({
  async stripePaymentSuccess(ctx) {
    try {
      ctx.body = "ok";
      const sig = ctx.request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          ctx.request.body[unparsed],
          sig,
          endpointSecret
        );
      } catch (err) {
        console.log(err);
        ctx.response.badRequest(`Webhook Error: ${err.message}`);
        return;
      }

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSuccess = event.data.object;

          const entries = await strapi.entityService.findMany(
            "api::commande.commande",
            {
              filters: {
                paymentIntent: {
                  //TODO remove test intent
                  $eq: paymentIntentSuccess.id,
                  // $eq: "pi_3L2cVqJSoM2Bze2H1UgqmS7I",
                },
              },
            }
          );

          const entry = await strapi.entityService.update(
            "api::commande.commande",
            entries[0].id,
            {
              data: {
                paymentConfirmed: true,
              },
            }
          );

          let itemList = `<ul>`;
          entries[0].produits.forEach((element) => {
            itemList =
              itemList +
              `<li>Bijou: ${element.nom}, taille: ${element.size}, prix: ${element.prix}€</li>`;
          });
          itemList = itemList + `</ul>`;

          const clientEmailTemplate = {
            subject: "Confirmation de votre commande",
            text: null,
            html: `<h1>Votre commande chez SUN</h1>
              <p>Votre commande a bien été reçu<p>
              ${itemList}
              `,
          };

          const sellerEmailTemplate = {
            subject: "Une nouvelle commande à été passée !",
            text: null,
            html: `<h1>TEMA LA TAILLE DE LA COMMANDE</h1>
              <p>Une nouvelle commande a été reçu :<p>
              <ul>
              <li>Id strapi de la commande : ${entries[0].id}</li>
              <li>Total : ${entries[0].prix_total}€</li>
              </ul>
              ${itemList}
              `,
          };

          await strapi.plugins["email"].services.email.sendTemplatedEmail(
            {
              to: entries[0].email,
            },
            clientEmailTemplate
          );

          // TODO uncomment for prod
          await strapi.plugins["email"].services.email.sendTemplatedEmail(
            {
              to: "louislepogam@gmail.com",
            },
            sellerEmailTemplate
          );
          break;
        case "payment_intent.payment_failed":
          //  Then define and call a function to handle the event payment_intent.succeeded
          // TODO Send mail to client
          const failTemplate = {
            subject: "Echec du paiement",
            text: null,
            html: `<h1>Votre commande chez SUN</h1>
              <p>Votre commande n'a pas été reçu<p>`,
          };

          await strapi.plugins["email"].services.email.sendTemplatedEmail(
            {
              to: entries[0].email,
            },
            failTemplate
          );
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      ctx.response.status = 200;
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
}));
