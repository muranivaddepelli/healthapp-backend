const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCartEmail = async (user, items) => {
  try {
    let total = 0;

    const rows = items.map(item => {
      const name = item.name;
      const qty = item.quantity;
      const price = item.price;

      total += price * qty;

      return `
        <tr>
          <td>${name}</td>
          <td>${qty}</td>
          <td>₹${price}</td>
        </tr>
      `;
    }).join("");

    const html = `
<h2>Hello ${user.firstName} ${user.lastName || ""},</h2>
      <p>Your prescription has been approved. Here are your medicines:</p>

      <table border="1" cellpadding="10" cellspacing="0">
        <tr>
          <th>Medicine</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${rows}
      </table>

      <h3>Total Amount: ₹${total}</h3>

      <p>Please proceed to payment.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your Prescription is Approved",
      html,
    });

  } catch (err) {
    console.error("Cart Email Error:", err);
  }
};

module.exports = sendCartEmail;