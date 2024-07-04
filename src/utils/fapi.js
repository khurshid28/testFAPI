let axios = require("axios");
class Fapi {
  async login() {
    try {
      const login = process.env.FAPI_LOGIN;
      const response1 = await axios.post(
        login,
        {
          client_id: process.env.CLIENT_ID,
          grant_type: process.env.GRANT_TYPE,
          client_secret: process.env.CLIENT_SECRET,
          username: process.env.FAPI_USERNAME,
          password: process.env.FAPI_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response1.data;
    } catch (error) {
      console.log("error to fetch ", error);
    }
  }
}

module.exports = new Fapi();
