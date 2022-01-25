import Mailgun from "mailgun.js";
import formData from "form-data";
import Logger from "../core/Logger";

const mailgun = new Mailgun(formData);

const options = {
  username: "api",
  key: process.env.MAILGUN_API_KEY || ""
};

const apiUrl = process.env.MAILGUN_API_URL;

const mg = mailgun.client(apiUrl ? { ...options, url: apiUrl } : options);

interface Data {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
}

export default (data: Data) => {
  if (!process.env.MAILGUN_DOMAIN) {
    return Promise.reject(new Error("Mailgun domain not set"));
  }

  return mg.messages.create(process.env.MAILGUN_DOMAIN as string, data);
};
