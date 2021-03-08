const sgMail = require("@sendgrid/mail");

const sendgridApiKey =
  "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";

sgMail.setApiKey(sendgridApiKey);

// sgMail.send({
//   to: "barakfisher@gmail.com",
//   from: "barakfisher@gmail.com",
//   subject: "first mail",
//   text: "mail content here",
// });

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "barakfisher@gmail.com",
    subject: "Welcome to task manager",
    // text: `Welcome to the app ${name}. Let me know how you get along with the app`,
    html:'<h3>Welcome to the app ${name}. Let me know how you get along with the app</h3>'
  });
};

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: "barakfisher@gmail.com",
        subject: "Sorry to see yoy go",
        // text: `Welcome to the app ${name}. Let me know how you get along with the app`,
        html:'<h3> Goodbye ${name}, hope to see you soon</h3>'
      });

}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
};
