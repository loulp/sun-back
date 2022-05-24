module.exports = {
  routes: [
    {
      method: "POST",
      path: "/stripePaymentSuccess",
      handler: "webhook.stripePaymentSuccess",
    },
  ],
};
