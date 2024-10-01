const { Created, OK } = require("../core/success.response");
const templateService = require("../services/template.service");
class EmailController {
  newTemplate = async (req, res, next) => {
    new Created({
      message: "new template",
      metadata: await templateService.newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();