module.exports = {
  routes: [
    {
      method: "POST",
      path: "/sendMail",
      handler: "message.sendMail",
    },
  ],
};
