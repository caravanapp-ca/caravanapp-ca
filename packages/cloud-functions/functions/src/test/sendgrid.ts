import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';

export const testSendGrid = async (req: Request, res: Response) => {
  console.log('Testing send grid API');
  if (!process.env.FUNCTION_TARGET) {
    // In development
    console.log('Testing locally');
    // TODO: Find a way to get .env.staging.yaml vars into process.env
  }
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    const errMsg = 'Unable to find SendGrid API Key in environment variables.';
    console.error(errMsg);
    return res.status(500).send(errMsg);
  }
  const msg = {
    to: 'mxttcherry@gmail.com',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  try {
    console.log(`Sending email: ${JSON.stringify(msg)}`);
    const [mailResponse] = await sgMail.send(msg);
    return res.status(200).send(mailResponse);
  } catch (err) {
    const errMsg = `Failed to send email. ${err}`;
    console.error(new Error(errMsg));
    return res.status(500).send(errMsg);
  }
};
