const config = {
  fileSystem: {
    path: "./DB",
  },
  mongodb: {
    cnxStr:
      "mongodb+srv://FranCeballos:asd456@cluster0.aqj1gaa.mongodb.net/ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  firebase: {
    "type": "service_account",
    "project_id": "coderhouse-backend-2000",
    "private_key_id": "7230cb6e2c6a6b457010cfd226e25612b9c78f9c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrEQf17gdxL4bn\nuVCPoGiuSkYaRvg2bh/u6SLvu59RW72P5B6P7AHRKt+yTWBLoEY8NaG/b5n5C8SO\nNRWOgIEh1rnQyv6CYeTvqXjeyd88MbzLyJ3ifIaR6RuKgwmfQIRJKP97S+AmuYVE\nInC6kU2vlPw6Qf423dv2OT69Y6oaVCPKjmkU7iikzz7IcNdo/NA2CU9iEq0bxuNo\nVFFt9QUZGk5H/H4w5QomWupq0vu+e7MQf9a9UjxY8E4kvLiENJeqExboeLmAS9qF\nINsRI8mA6Irys7Ydqc49H7X7p09ZyJixcX/zXmW1tBIoGZyAZ8AReWlICp8moNks\n/mw1uP5HAgMBAAECggEAGqF/nkMMiIvQEiHwzzM3KK7qY+vZd0vEj+JebHjGcBl6\nlLx8H4arr77fbTgLfip41KW6xP0gOLuiwUq1TOZnc/ekHMOFRJHt3HuDFBfUN2A8\n1nKoVZpyLqPeBD2rEU4vad5Gi5C/1/d4ric4amr1b5iffYhJhYwbUqUNxdkOoaNn\nZcdr72NAG5I3JCeRYH/w3XegFYDKcy7+slgiTCNgIqhZfM2du7cAWTcQsK9XWXmP\nx3FNBZh+hSgAcYQGzgP5H6HFmNBqY//KUrLbJOEMwOZJHvdmiGJJGrujL8bKOEip\nTf4WCRcvZrEUNqWnPgvkDoI9qha+tXXclKJzr8cewQKBgQDbhr3PDBj6wpAn+fI+\npeyljsoAAFrVeGWGiyU7Kyc569qrogfrYRc7ObrrFXlNdiJzB/5emcjQAwWmBxop\nd97nniGf8hbNurbx43dREdbChA2lbZf9NJE1IAhPyE/UUH1OS3X3TSavmYRCTI+j\n0A9SOVeDqmDuUlhc+yu5Akr5QQKBgQDHfR3hHLA02eudl0mAYizmdLMu4m4camxR\ngFxZYzFzp8kCggvYZVIUH1ARzqs3TS5ZY3MEaukIbbDOCq3HhDRJcXrsxEYQWGo0\n76sfsIhXWIPG6gCSqdGjdq0JZn379OKEaC5LQe6uf3AwBD3IXpFPT1lbs9vhLRgY\nKnhmFndNhwKBgQCs+ebmFmo4bMaaOWCf7K4jZffVOHJacpvNACc+ECrAgQ+03d/P\noJllmX+nbSw/1S4f5dSRRivte/Qfdskuk72YVAm6tk8xnEY7IzkJMD1A2DzIdSql\n4Z3pdmwWMYh1i1axMtSpIKmzBAwrEZi9Q1xPNc+3d7EZGNl3qpIxHZVmAQKBgQCy\ne5McMhrFbqSMXyt4Hl6l4oveyuBRtDYtxXba0xEPtXL3N3t5pU2Gi22MQSiXVgq+\nF2h072KIE/w4nP1WoUZW351n8UPuo+yCaFznAX87BwsAEaVpk17preirnHPj1fpF\nFSE2XEs8/PBXRbQxbcr89rWwgn+cPEhudrE6RaeASQKBgDeZ+uoKEiUSO6TyjMNr\nXqIqTfJ2C6Y/Ki2SLkxLsjCM0ApG4zSlgESAxSh4K+GIVlySdjmrgRWAANZOmee3\nzkJt/74aBfxZz2/fjPv+6Afldo6coOYiuKOgXA5cuGLLZTZSN2sKk9IigD5LFj7G\nPdUmxeCB6MBZlKTVDFZYKCKq\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-komwf@coderhouse-backend-2000.iam.gserviceaccount.com",
    "client_id": "100693186074588302410",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-komwf%40coderhouse-backend-2000.iam.gserviceaccount.com"
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      port: 3306,
      database: "test",
    },
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: `./DB/ecommerce.sqlite`,
    },
    useNullAsDefault: true,
  },
};

export default config;
