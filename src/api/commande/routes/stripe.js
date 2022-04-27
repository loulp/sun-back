module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/createPaymentIntent',
        handler: 'commande.createPaymentIntent',
      }
    ]
  }