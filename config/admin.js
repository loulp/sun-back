module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8d0225b3132b133dd1edf4c5cc62ee36'),
  },
});
