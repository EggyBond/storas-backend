const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '75c1244f',
  apiSecret: 'pDzJyqFN1A0ioWmK',
});

const from = 'Storas ID';
const to = '6285275549761';
const text = 'Jancuk';

// nexmo.message.sendSms(from, to, text);


nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
      }
    }
  })
  