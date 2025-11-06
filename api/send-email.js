// Serverless function for sending emails
// Deploy this to Vercel, Netlify Functions, or AWS Lambda
// This keeps the email address completely hidden from the client

// Example for Vercel/Netlify:
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { requesterEmail, institutionName, institutionUrl, comment } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'pymjyb@gmail.com';

  // Use a service like SendGrid, Mailgun, or Nodemailer
  // For now, this is a template - you'll need to configure your email service
  
  try {
    // Example using Nodemailer or similar
    // const transporter = nodemailer.createTransport({...});
    // 
    // // Send to admin
    // await transporter.sendMail({
    //   from: 'noreply@yourdomain.com',
    //   to: adminEmail,
    //   subject: `New Institution Request: ${institutionName}`,
    //   html: `
    //     <h2>New Institution Request</h2>
    //     <p><strong>Requester Email:</strong> ${requesterEmail}</p>
    //     <p><strong>Institution Name:</strong> ${institutionName}</p>
    //     <p><strong>Website:</strong> <a href="${institutionUrl}">${institutionUrl}</a></p>
    //     <p><strong>Comment:</strong> ${comment || 'None'}</p>
    //   `,
    //   replyTo: requesterEmail,
    // });
    //
    // // Send confirmation to requester
    // await transporter.sendMail({
    //   from: 'noreply@yourdomain.com',
    //   to: requesterEmail,
    //   subject: 'Your Institution Request Has Been Received',
    //   html: `
    //     <p>Thank you for requesting to add <strong>${institutionName}</strong> to our database.</p>
    //     <p>We've received your submission and will review it shortly.</p>
    //   `,
    // });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

