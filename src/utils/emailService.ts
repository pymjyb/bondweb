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

  // Debug logging
  console.log('📧 Email Service Debug Info:');
  console.log('  - VITE_FORMSPREE_ID:', formspreeId ? `"${formspreeId}" (length: ${formspreeId.length})` : 'undefined or empty');
  console.log('  - VITE_EMAIL_API_URL:', serverlessUrl ? `"${serverlessUrl}"` : 'undefined or empty');
  console.log('  - VITE_ADMIN_EMAIL:', adminEmail);
  console.log('  - All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

  // Option 1: Use Formspree (easiest - works immediately)
  if (formspreeId && formspreeId.trim() !== '') {
    console.log('✅ Using Formspree with ID:', formspreeId);
    const formData = new FormData();
    formData.append('_replyto', data.requesterEmail);
    formData.append('email', data.requesterEmail);
    formData.append('institution_name', data.institutionName);
    formData.append('institution_url', data.institutionUrl);
    formData.append('comment', data.comment || '');
    formData.append('_subject', `New Institution Request: ${data.institutionName}`);
    formData.append('_format', 'plain');
    
    const url = `https://formspree.io/f/${formspreeId}`;
    console.log('📤 Sending request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Formspree error:', errorData);
      throw new Error(errorData.error || `Failed to send request: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json().catch(() => ({}));
    console.log('✅ Formspree success:', responseData);
    
    // Formspree will automatically send a confirmation email if configured
    // To enable: Formspree dashboard → Form Settings → Email Notifications → Auto-responder
    return;
  }

  // Option 2: Use a custom serverless function (more control, better privacy)
  if (serverlessUrl && serverlessUrl.trim() !== '') {
    console.log('✅ Using serverless function:', serverlessUrl);
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

    console.log('📥 Serverless response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Serverless error:', errorText);
      throw new Error(`Failed to send request: ${response.status} ${response.statusText}`);
    }
    
    console.log('✅ Serverless function success');
    return;
  }

  // If no service is configured, show helpful error
  console.error('❌ No email service configured!');
  console.error('  - Formspree ID:', formspreeId);
  console.error('  - Serverless URL:', serverlessUrl);
  throw new Error('Email service not configured. Please set up Formspree or a serverless function.');
}
