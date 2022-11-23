"use strict";

/**
 *  message controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::message.message", ({ strapi }) => ({
  async sendMail(ctx) {
    try {
      ctx.body = "ok";

      await strapi.plugins["email"].services.email.send({
        to: "contact@sunjewelry.fr",
        replyTo: ctx.request.body.email,
        subject: ctx.request.body.subject,
        text: `${ctx.request.body.message} 
        - Email envoyé depuis le formulaire de contact du site web
        `,
        html: `${ctx.request.body.message}
        <br/>
        <br/>
        Numéro de téléphone : ${ctx.request.body.phoneNumber}
        `,
      });
      ctx.response.status = 200;
    } catch (err) {
      console.log(err);
      ctx.body = err;
      ctx.response.status = 500;
    }
  },
}));
