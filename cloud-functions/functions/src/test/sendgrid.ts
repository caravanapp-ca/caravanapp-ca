import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import sgMail from '@sendgrid/mail';

import { loadLocalEnv } from './loadenv';

export const testSendGrid: HttpFunction = async (req, res) => {
  console.log('Testing send grid API');
  if (!process.env.FUNCTION_TARGET) {
    // In development
    console.log('Testing locally');
    loadLocalEnv();
  }
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    const errMsg = 'Unable to find SendGrid API Key in environment variables.';
    console.error(new Error(errMsg));
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
