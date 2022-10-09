export const environment = {
  MySQLConfig: {
    host: process.env.MY_SQL_URL || "localhost",
    user: process.env.MY_SQL_USER || "root",
    password: process.env.MY_SQL_PASSWORD || "",
    database: process.env.MY_SQL_DATABASE || "GSS",
    port: Number(process.env.MY_SQL_PORT) || 3306,
  },
  apiKeyTwoFactor:
    process.env.TWO_FACTOR_API_KEY || "1c3a9a32-d857-11ec-9c12-0200cd936042",
  razarPayClient: {
    id: process.env.RAZOR_KEY_ID || "rzp_test_yZOgOCCzISGGfu",
    key: process.env.RAZOR_KEY_SECRET || "EAA7yxk0UkepDgq22ADyjQc2",
  },
};
