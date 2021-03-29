const sgMail = require("@sendgrid/mail");



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   to: "barakfisher@gmail.com",
//   from: "barakfisher@gmail.com",
//   subject: "first mail",
//   text: "mail content here",
// });

const sendWelcomeEmail = (email, name) => {
  console.log("sending Email")
  sgMail.send({
    to: email,
    from: "barakf@pointer4u.co.il",
    subject: "Welcome to task manager",
    // text: `Welcome to the app ${name}. Let me know how you get along with the app`,
    html:'<h3>Welcome to the app ${name}. Let me know how you get along with the app</h3>'
  });
};

const sendCancelationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: "barakf@pointer4u.co.il",
        subject: "Sorry to see you go",
        // text: `Welcome to the app ${name}. Let me know how you get along with the app`,
        html:'<h3> Goodbye ${name}, hope to see you soon</h3>'
      });

}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
};
