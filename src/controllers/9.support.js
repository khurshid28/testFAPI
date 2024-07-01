let {
  InternalServerError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors.js");

let axios = require("axios");

class SupportController {
  async sendMessage(req, res, next) {
    try {
      let { message } = req.body;
      let text =
        "<b>Role</b> :" +
        req.user.role +
        "%0A<b>ID</b> : " +
        req.user.id +
        "%0A<b>message</b> " +
        `
: ${message}`;
      let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=-${process.env.GROUP_ID}&text=${text}&parse_mode=HTML`;
      let response = await axios
        .post(url)
        .then((response) => response)
        .catch((err) => {
          return err;
        });
      if (response.status == "200") {
        return res.status(200).json({
          message: "message sent successfully",
        });
      } else {
        return next(new BadRequestError(400, "Message didnot send"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500,  error));
    }
  }
}

module.exports = new SupportController();
