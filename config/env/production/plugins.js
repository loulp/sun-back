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
        host: env("SMTP_HOST", "ssl0.ovh.net"),
        port: env("SMTP_PORT", 587),
        secureConnection: false, // TLS requires secureConnection to be false
        logger: true,
        auth: {
          user: env("EMAIL"),
          pass: env("EMAIL_PASS"),
        },
        tls: {
          ciphers: "SSLv3",
        },
      },
      settings: {
        defaultFrom: "contact@sunjewelry.fr",
        defaultReplyTo: "contact@sunjewelry.fr",
      },
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
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
});
