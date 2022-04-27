module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  // host: env("HOST", "192.168.1.27"),
  port: env.int("PORT", 1337),
});
