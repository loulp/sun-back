"use strict";

const stripe = require("stripe");
const unparsed = Symbol.for("unparsedBody");
const endpointSecret = "whsec_6uP7GaHyAicSG9X7oJJYIq7hyZYkTpdo";
// DEV const endpointSecret = "whsec_cQtVFceYbn0dkr4Nmg639VPNSxwoFaB5";

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

          await strapi.plugins[
            "email-designer"
          ].services.email.sendTemplatedEmail(
            {
              to: entry.email,
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
              deliveryAddress: {
                street: entry.LIVR_adresse.slice(
                  0,
                  entry.LIVR_adresse.indexOf(",")
                ),
                city: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.lastIndexOf(",") + 2,
                  entry.LIVR_adresse.length
                ),
                postalCode: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.indexOf(",") + 2,
                  entry.LIVR_adresse.lastIndexOf(",")
                ),
              },
              billingAddress: {
                street: entry.FACT_adresse.slice(
                  0,
                  entry.FACT_adresse.indexOf(",")
                ),
                city: entry.FACT_adresse.slice(
                  entry.FACT_adresse.lastIndexOf(",") + 2,
                  entry.FACT_adresse.length
                ),
                postalCode: entry.FACT_adresse.slice(
                  entry.FACT_adresse.indexOf(",") + 2,
                  entry.FACT_adresse.lastIndexOf(",")
                ),
              },
              idCommand: entry.id,
            }
          );

          await strapi.plugins[
            "email-designer"
          ].services.email.sendTemplatedEmail(
            {
              to: "contact@sunjewelry.fr",
              from: "contact@sunjewelry.fr",
            },
            {
              templateReferenceId: 3,
              subject: `Une commande a été passée !`,
            },
            {
              firstname: entry.FACT_prenom,
              lastname: entry.FACT_nom,
              email: entry.email,
              delPhone: entry.LIVR_telephone,
              bilPhone: entry.FACT_telephone,
              idCommand: entry.id,
              total: entry.prix_total,
              retrait: entry.LIVR_retrait_atelier === true ? "Oui" : "Non",
              suivi: entry.suivi_commande === true ? "Oui" : "Non",
              deliveryAddress: {
                street: entry.LIVR_adresse.slice(
                  0,
                  entry.LIVR_adresse.indexOf(",")
                ),
                city: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.lastIndexOf(",") + 2,
                  entry.LIVR_adresse.length
                ),
                postalCode: entry.LIVR_adresse.slice(
                  entry.LIVR_adresse.indexOf(",") + 2,
                  entry.LIVR_adresse.lastIndexOf(",")
                ),
              },
              billingAddress: {
                street: entry.FACT_adresse.slice(
                  0,
                  entry.FACT_adresse.indexOf(",")
                ),
                city: entry.FACT_adresse.slice(
                  entry.FACT_adresse.lastIndexOf(",") + 2,
                  entry.FACT_adresse.length
                ),
                postalCode: entry.FACT_adresse.slice(
                  entry.FACT_adresse.indexOf(",") + 2,
                  entry.FACT_adresse.lastIndexOf(",")
                ),
              },
              order: {
                produits: entry.produits,
              },
            }
          );
          break;

        case "payment_intent.payment_failed":
          await strapi.plugins[
            "email-designer"
          ].services.email.sendTemplatedEmail(
            {
              to: entry.email,
              from: "contact@sunjewelry.fr",
            },
            {
              templateReferenceId: 2,
              subject: `Erreur lors de votre commande`,
            }
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
