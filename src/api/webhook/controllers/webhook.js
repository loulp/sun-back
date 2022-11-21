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
                  $eq: paymentIntentSuccess.id,
                },
              },
            }
          );

          const entry = entries[0];

          await strapi.entityService.update(
            "api::commande.commande",
            entry.id,
            {
              data: {
                paymentConfirmed: true,
              },
            }
          );

          let itemList = `<ul>`;
          entry.produits.forEach((element) => {
            itemList =
              itemList +
              `<li>Bijou: ${element.nom}, taille: ${element.size}, prix: ${element.prix}€</li>`;
          });
          itemList = itemList + `</ul>`;

          const sellerEmailTemplate = {
            subject: "Une nouvelle commande à été passée !",
            text: null,
            html: `<h1>TEMA LA TAILLE DE LA COMMANDE</h1>
              <p>Une nouvelle commande a été reçu :<p>
              <ul>
              <li>Id strapi de la commande : ${entry.id}</li>
              <li>Total : ${entry.prix_total}€</li>
              </ul>
              ${itemList}
              `,
          };

          await strapi.plugins[
            "email-designer"
          ].services.email.sendTemplatedEmail(
            {
              to: entry.email,
              // TODO change with SUN email (dans strapi -> mail setting aussi)
              from: "contact@sunjewelry.fr",
            },
            {
              templateReferenceId: 1,
              subject: `Confirmation de votre commande`,
            },
            {
              order: {
                produits: entry.produits,
              },
              address: {
                street: entry.LIVR_adresse.slice(0, entry.LIVR_adresse.indexOf(",")),
                city: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.lastIndexOf(",") + 2,
                  entry.LIVR_adresse.length
                ),
                postalCode: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.indexOf(",") + 2,
                  entry.LIVR_adresse.lastIndexOf(",")
                ),
              },
              idCommand: entry.id,
            }
          );

          await strapi.plugins["email"].services.email.sendTemplatedEmail(
            {
              // TODO Mail de typhen
              to: "contact@sunjewelry.fr",
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
              to: entry.email,
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
