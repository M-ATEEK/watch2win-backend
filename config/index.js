const dotenv = require("dotenv");

// Inject .env Variables into process.env
dotenv.config();

module.exports = {
  CLIENT_ID:process.env.CLIENT_ID || "478158737536-ehhhrrodvdmnn123c0m2n74bn573fav4.apps.googleusercontent.com",
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
  }
};
