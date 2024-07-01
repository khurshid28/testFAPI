let {
  InternalServerError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors.js");

let axios = require("axios");

class ErrorController {
  async sendError(req, res, next) {
    try {
      let { message , device } = req.body;
      if (message.length > 299) {
        message = message.substring(0, 300)
      }
      message = message.replaceAll(">","}").replaceAll("<","{").replaceAll("#","$");
      let text = "<b>ERROR ON " + device + "</b> : %0A " + `${message}`;
      let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=-${process.env.ERROR_GROUP_ID}&text=${text}&parse_mode=HTML`;
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

        console.log("> Error"+response.status);
        console.log("> Error"+response.data);
        return next(new BadRequestError(400, "Message didnot send"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500,  error));
    }
  }
}

module.exports = new ErrorController();
