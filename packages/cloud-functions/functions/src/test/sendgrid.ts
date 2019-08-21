export const testSendGrid = async () => {
  console.log('Testing send grid API');
  const sgMail = require('@sendgrid/mail');
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    const errMsg = 'Not provided with SendGrid API key';
    console.error(errMsg);
    throw new Error(errMsg);
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
    const [res] = await sgMail.send(msg);
    return res;
  } catch (err) {
    console.error(`Failed to send email: ${err}`);
    throw err;
  }
};
