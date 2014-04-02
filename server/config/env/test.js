module.exports = {
  debug: true,
  db: "mongodb://localhost:27017/test",
  app: {
    name: "Test - Modular Expressjs Boilerplate",
    sessions_secret: "I should probably change this"
  },
  auth: {
    google: {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://<domain>/api/auth/google/return"
    },
    facebook: {
      clientID: "",
      clientSecret: "",
      callbackURL: "/api/auth/facebook/return"
    },
    twitter: {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://<domain>/api/auth/twitter/return"
    },
    github: {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://<domain>/api/auth/github/return"
    }
  },
  email: {      
    defaultOptions: {
      from: "Test Email <team@domain.com>",
      replyTo: "Test Email <team@domain.com>"
    },
    connection: {
      service: "dev"
    }
  },
  pkgcloud: {
    storage: {
      region: "ORD",
      provider: "rackspace",
      username: "",
      apiKey: ""
    } 
  }
};