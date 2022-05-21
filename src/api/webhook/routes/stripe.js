module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/stripePaymentSuccess',
        handler: 'webhook.stripePaymentSuccess',
      }
    ]
  }