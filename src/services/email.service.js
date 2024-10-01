import { newOtp } from "./otp.service";
import templateService from "./template.service";
import transport from "../dbs/init.nodemailler";
import { NotFoundError } from "../core/error.response";
import { replacePlaceholder } from "../utils";

const _sendEmailLinkVerify = ({
  html,
  toEmail,
  subject = "Xác nhận email đăng ký",
  text = "Xác nhận...",
}) => {
  try {
    const mailOptions = {
      from: ' "TTT" <clonemoitinh@gmail.vn>',
      to: toEmail,
      subject,
      text,
      html,
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Message sent::`, info.messageId);
    });
  } catch (error) {
    console.error(`error send Email::`, error);
    return error;
  }
};

const sendEmailToken = async ({ email = null }) => {
  // 1. generator token

  const otp = await newOtp(email);

  // 2. get template
  const template = await templateService.getTemplate("html email token");

  if (!template) {
    throw new NotFoundError("Template not found");
  }
  const content = replacePlaceholder(template.tem_html, {
    link_verify: `http://localhost:3000/v1/api/user/welcome-back?token=${otp.otp_token}`,
  });

  _sendEmailLinkVerify({
    html: content,
    toEmail: email,
    subject: "Vui lòng xác nhận địa chỉ email đăng ký shopDEV",
    text: "",
  });

  return 1;
};

export default { sendEmailToken };
