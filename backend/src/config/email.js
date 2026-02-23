const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Email templates
const emailTemplates = {
    orderConfirmation: (order, user) => ({
        subject: `Order Confirmation - #${order.id}`,
        html: `
      <h2>Thank you for your order!</h2>
      <p>Dear ${user.name || 'Customer'},</p>
      <p>Your order #${order.id} has been received and is being processed.</p>
      <h3>Order Details:</h3>
      <ul>
        <li>Order ID: ${order.id}</li>
        <li>Total Amount: Rs. ${order.totalAmount.toFixed(2)}</li>
        <li>Status: ${order.status}</li>
        <li>Date: ${new Date(order.createdAt).toLocaleString()}</li>
      </ul>
      <p>We will notify you once your order is shipped.</p>
      <p>Thank you for shopping with us!</p>
    `,
    }),

    paymentSuccess: (order, payment, user) => ({
        subject: `Payment Successful - Order #${order.id}`,
        html: `
      <h2>Payment Confirmed!</h2>
      <p>Dear ${user.name || 'Customer'},</p>
      <p>We have received your payment for order #${order.id}.</p>
      <h3>Payment Details:</h3>
      <ul>
        <li>Amount Paid: Rs. ${payment.amount.toFixed(2)}</li>
        <li>Payment Method: ${payment.method}</li>
        <li>Transaction ID: ${payment.pidx || 'N/A'}</li>
        <li>Date: ${new Date(payment.createdAt).toLocaleString()}</li>
      </ul>
      <p>Your order will be processed and shipped soon.</p>
      <p>Thank you!</p>
    `,
    }),

    orderStatusUpdate: (order, user) => ({
        subject: `Order Status Update - #${order.id}`,
        html: `
      <h2>Order Status Updated</h2>
      <p>Dear ${user.name || 'Customer'},</p>
      <p>Your order #${order.id} status has been updated to: <strong>${order.status}</strong></p>
      ${order.status === 'SHIPPED' ? '<p>Your order is on its way! You will receive it soon.</p>' : ''}
      ${order.status === 'DELIVERED' ? '<p>Your order has been delivered. Thank you for shopping with us!</p>' : ''}
      <p>Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <p>Thank you!</p>
    `,
    }),
};

// Send email function
async function sendEmail(to, template) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: template.subject,
            html: template.html,
        });
        console.log(`Email sent to ${to}: ${template.subject}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

module.exports = {
    sendEmail,
    emailTemplates,
};
