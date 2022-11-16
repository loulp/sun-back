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
      providerOptions: {
        host: env("SMTP_HOST", "smtp.office365.com"),
        port: env("SMTP_PORT", 587),
        secureConnection: false, // TLS requires secureConnection to be false
        logger: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          ciphers: "SSLv3",
        },
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

  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::bijou.bijou",
          modelName: "bijou",
          transliterate: true,
          queryConstraints: {
            populate: ["photo"],
            where: {
              $and: [
                {
                  publishedAt: { $notNull: true },
                },
              ],
            },
          },
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -600,
            limit: 10,
            keys: [
              {
                name: "nom",
                weight: 100,
              },
              {
                name: "collection",
                weight: 100,
              },
            ],
          },
        },
        // {
        //   uid: "api::collection.collection",
        //   modelName: "collection",
        //   transliterate: true,
        //   queryConstraints: {
        //     populate: ["bijoux"],
        //     where: {
        //       $and: [
        //         {
        //           publishedAt: { $notNull: true },
        //         },
        //       ],
        //     },
        //   },
        //   fuzzysortOptions: {
        //     characterLimit: 300,
        //     threshold: -600,
        //     limit: 10,
        //     keys: [
        //       {
        //         name: "name",
        //         weight: 100,
        //       },
        //     ],
        //   },
        // },
        // {
        //   uid: "api::category.category",
        //   modelName: "category",
        //   transliterate: true,
        //   queryConstraints: {
        //     populate: ["bijoux"],
        //     where: {
        //       $and: [
        //         {
        //           publishedAt: { $notNull: true },
        //         },
        //       ],
        //     },
        //   },
        //   fuzzysortOptions: {
        //     characterLimit: 300,
        //     threshold: -600,
        //     limit: 10,
        //     keys: [
        //       {
        //         name: "type",
        //         weight: 100,
        //       },
        //     ],
        //   },
        // },
      ],
    },
  },
});
