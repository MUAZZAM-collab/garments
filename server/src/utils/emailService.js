import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: { user, pass },
    });
  } else {
    // Mock logger if no credentials configured
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n✉️ --- [MOCK EMAIL DISPATCHED] ---');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('------------------------------------\n');
        return { messageId: `mock_${Date.now()}` };
      },
    };
  }
  return transporter;
};

export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const transport = getTransporter();
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E8E2DC;">
            <strong style="color: #1C1A19; font-size: 14px;">${item.title}</strong>
            <div style="color: #6B6560; font-size: 12px;">Size: ${item.variant.size} | Color: ${item.variant.color} | Qty: ${item.qty}</div>
          </td>
          <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #E8E2DC; color: #1C1A19; font-weight: 500;">
            PKR ${(item.price * item.qty).toLocaleString()}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F7F2EE; margin: 0; padding: 24px; color: #1C1A19; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #E8E2DC; }
          .header { background: #1C1A19; color: #F7F2EE; padding: 36px 24px; text-align: center; }
          .brand { font-size: 24px; letter-spacing: 4px; text-transform: uppercase; font-family: Georgia, serif; margin: 0; }
          .subtitle { color: #C9A961; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 16px; margin-bottom: 16px; font-weight: 500; }
          .badge { display: inline-block; background: #F8EEF0; color: #7B3F4C; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
          .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          .summary { background: #FAF7F4; padding: 16px; border-radius: 4px; margin-top: 16px; }
          .discreet-box { background: #Fdfbf9; border-left: 3px solid #C9A961; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #6B6560; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #9C958E; border-top: 1px solid #E8E2DC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">VELOURA Privé</h1>
            <div class="subtitle">Haute Intimates & Loungewear</div>
          </div>
          <div class="content">
            <span class="badge">Order Confirmed</span>
            <h2 style="font-size: 20px; margin-top: 12px; color: #1C1A19;">Thank you for your order, ${order.shippingAddress.recipientName}</h2>
            <p style="color: #6B6560; font-size: 14px; line-height: 1.6;">
              Your order <strong>${order.orderNumber}</strong> has been received with care. Our atelier is currently preparing your pieces.
            </p>

            <div class="discreet-box">
              🔒 <strong>Discreet Delivery Guarantee:</strong> All VELOURA Privé parcels are shipped in completely unbranded, opaque outer packaging with zero product descriptions on the shipping label for your absolute privacy and comfort.
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th style="text-align: left; font-size: 12px; text-transform: uppercase; color: #9C958E; padding-bottom: 8px;">Item</th>
                  <th style="text-align: right; font-size: 12px; text-transform: uppercase; color: #9C958E; padding-bottom: 8px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #6B6560;">
                <span>Subtotal:</span>
                <span>PKR ${order.subtotal.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #6B6560;">
                <span>Delivery (${order.shippingAddress.city}):</span>
                <span>${order.shipping === 0 ? 'FREE' : `PKR ${order.shipping.toLocaleString()}`}</span>
              </div>
              ${
                order.discount > 0
                  ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #B76E79;">
                      <span>Privilege Discount:</span>
                      <span>- PKR ${order.discount.toLocaleString()}</span>
                    </div>`
                  : ''
              }
              <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #E8E2DC; font-size: 16px; font-weight: 600; color: #1C1A19;">
                <span>Total Amount:</span>
                <span>PKR ${order.total.toLocaleString()}</span>
              </div>
              <div style="margin-top: 8px; font-size: 12px; color: #6B6560;">
                <strong>Payment Method:</strong> ${order.paymentMethod}
              </div>
            </div>

            <div style="margin-top: 24px; font-size: 13px; color: #6B6560;">
              <strong>Delivery Address:</strong><br />
              ${order.shippingAddress.recipientName}<br />
              ${order.shippingAddress.streetAddress} ${order.shippingAddress.apartment || ''}<br />
              ${order.shippingAddress.city}, Pakistan<br />
              Phone: ${order.shippingAddress.phone}
            </div>
          </div>
          <div class="footer">
            VELOURA Privé • Karachi • Lahore • Islamabad • Nationwide Delivery<br />
            Questions? WhatsApp our luxury concierge at +92 300 1234567 or email concierge@veloura.pk
          </div>
        </div>
      </body>
      </html>
    `;

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'VELOURA Privé <concierge@veloura.pk>',
      to: customerEmail,
      subject: `Order Confirmation: ${order.orderNumber} - VELOURA Privé`,
      html,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
  }
};
