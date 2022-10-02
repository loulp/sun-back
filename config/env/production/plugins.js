module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      // TODO update with SUN email
      providerOptions: {
        host: env("SMTP_HOST", "smtp.office365.com"),
        port: env("SMTP_PORT", 587),
        secureConnection: false, // TLS requires secureConnection to be false
        logger: true,
        auth: {
          user: env("EMAIL"),
          pass: env("EMAIL_PASS"),
        },
        tls: {
          ciphers:'SSLv3'
      }
      },
      settings: {
        defaultFrom: "llp_dev@outlook.com",
        defaultReplyTo: "llp_dev@outlook.com",
      },
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
});
