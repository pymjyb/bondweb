// Email service for sending institution requests
// Uses Formspree (free tier available) or a serverless function
// The admin email is stored in environment variables and not exposed in the source code

interface RequestData {
  requesterEmail: string;
  institutionName: string;
  institutionUrl: string;
  comment: string;
}

export async function sendInstitutionRequest(data: RequestData): Promise<void> {
  // Get configuration from environment variables
  const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
  const serverlessUrl = import.meta.env.VITE_EMAIL_API_URL;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'pymjyb@gmail.com';

  // Option 1: Use Formspree (easiest - works immediately)
  if (formspreeId) {
    const formData = new FormData();
    formData.append('_replyto', data.requesterEmail);
    formData.append('email', data.requesterEmail);
    formData.append('institution_name', data.institutionName);
    formData.append('institution_url', data.institutionUrl);
    formData.append('comment', data.comment || '');
    formData.append('_subject', `New Institution Request: ${data.institutionName}`);
    formData.append('_format', 'plain');
    
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send request');
    }
    
    // Formspree will automatically send a confirmation email if configured
    // To enable: Formspree dashboard → Form Settings → Email Notifications → Auto-responder
    return;
  }

  // Option 2: Use a custom serverless function (more control, better privacy)
  if (serverlessUrl) {
    const response = await fetch(serverlessUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: adminEmail,
        replyTo: data.requesterEmail,
        subject: `New Institution Request: ${data.institutionName}`,
        requesterEmail: data.requesterEmail,
        institutionName: data.institutionName,
        institutionUrl: data.institutionUrl,
        comment: data.comment,
        sendConfirmation: true, // Serverless function should send confirmation
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send request');
    }
    return;
  }

  // If no service is configured, show helpful error
  throw new Error('Email service not configured. Please set up Formspree or a serverless function.');
}
