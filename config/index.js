const dotenv = require("dotenv");

// Inject .env Variables into process.env
dotenv.config();

module.exports = {
  siteURL: process.env.SITE_URL || "http://localhost",
  appURL: process.env.APP_URL || "https://inventally.com",
  port: process.env.PORT || "8000",
  API_URL: process.env.API_URL || "http://localhost:8000",
  mongooseUriString:
    process.env.MONGOOSE_URI_STRING || "mongodb://localhost:27017/inventaly",
  secret: process.env.JWT_SECRET || "inventally",
  roles: {
    adminRoles: ["admin", "manager", "inspector"],
    customerRoles: ["client", "contact"],
    types: {
      1: "landlord",
      2: "tenant",
      3: "business"
    }
  },
  mailCredentials: {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 465,
    secure: process.env.MAIL_USE_SECURE === 'true'? true : false,
    requireTLS: process.env.REQUIRE_TLS  === 'true'? true : false,
    auth: {
      user: process.env.MAIL_AUTH_USER || "",
      pass: process.env.MAIL_AUTH_PASS || ""
    }
  },
  guestRoutes: {
    admin: ["/authenticate", "/create"]
  },
  superAdmin: {
    email: "admin@inventally.com",
    password: "admin123"
  },
  job: {
    statuses: [
      "requested",
      "pending",
      "rescheduled",
      "cancelled",
      "completed",
      "pre-approved",
      "approved"
    ],
    cities: ["dubai", "jeddah", "abu-dhabi", "sharjah", "bermingham"],
    timezones: ["8am-12pm", "4pm-6pm", "8pm-12am"],
    types: ["all", "check-in", "check-out", "interim-condition"],
    positions: ["all", "business", "landlord", "tenant"]
  },
  bankDetails: {
    accountNo: process.env.NODE_ENV == 'production'? '1002425039' : '0000000000000',
    ban: process.env.NODE_ENV == 'production'? 'AE390230000001002425039' : 'AE000000000000000000000',
    accountHolder: process.env.NODE_ENV == 'production'? 'inventally DMCC' : 'Test',
    bank: process.env.NODE_ENV == 'production'? 'Commercial Bank of Dubai' : 'Bank of Dubai',
    mob: process.env.NODE_ENV == 'production'? '+971 58 548 1500' : '971 00 000 0000',
    email: process.env.NODE_ENV == 'production'? 'sales@inventally.com' : 'test@gmail.com',
  }
};
