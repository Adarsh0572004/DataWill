import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // Use environment SMTP settings, or fallback to Ethereal (fake test email)
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Gmail App Password shortcut
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    } else {
      console.warn('⚠️  No email config set. Emails will be logged to console.');
      transporter = {
        sendMail: async (options) => {
          console.log('📧 [EMAIL SIMULATION]');
          console.log(`   To: ${options.to}`);
          console.log(`   Subject: ${options.subject}`);
          console.log(`   Body: ${options.text?.substring(0, 200)}...`);
          return { messageId: 'simulated-' + Date.now() };
        }
      };
    }
  }

  return transporter;
}

/**
 * Send the death protocol email to a contact with the user's credentials.
 */
export async function sendDeathProtocolEmail({ contactEmail, contactName, userName, assets }) {
  const mail = getTransporter();

  // Build credential list
  let credentialList = '';
  for (const asset of assets) {
    credentialList += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    credentialList += `📦 ${asset.name} (${asset.platform || asset.type})\n`;
    if (asset.username) credentialList += `   Username/Email: ${asset.username}\n`;
    if (asset.password) credentialList += `   Password: ${asset.password}\n`;
    if (asset.notes) credentialList += `   Notes: ${asset.notes}\n`;
  }

  const subject = `🔐 DataWill — Digital Estate of ${userName}`;
  const text = `Dear ${contactName},

This is an automated message from DataWill, a digital estate management platform.

${userName} has designated you as a trusted contact for their digital estate. They have not checked in for an extended period, and as per their instructions, we are sharing their digital account credentials with you.

═══════════════════════════════
   DIGITAL ACCOUNT CREDENTIALS
═══════════════════════════════
${credentialList}
━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT:
• These credentials are shared in confidence. Please handle them responsibly.
• Some accounts may have two-factor authentication enabled.
• Consider updating passwords after accessing the accounts.
• Contact the respective platforms if you need help with account recovery.

This email was sent automatically by DataWill (datawill.onrender.com).
If you believe you received this in error, please disregard this message.

With care,
DataWill — Digital Estate Management
`;

  const html = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 32px; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="color: #7EE2A8; margin: 0;">DataWill</h1>
    <p style="color: #8B949E; font-size: 14px;">Digital Estate Management</p>
  </div>
  
  <div style="background: #161B22; padding: 24px; border-radius: 8px; border: 1px solid #30363D;">
    <p>Dear <strong>${contactName}</strong>,</p>
    <p><strong>${userName}</strong> has designated you as a trusted contact for their digital estate. They have not checked in for an extended period, and as per their instructions, we are sharing their digital account credentials with you.</p>
  </div>

  <h2 style="color: #7EE2A8; margin-top: 24px;">🔐 Account Credentials</h2>
  
  ${assets.map(asset => `
  <div style="background: #161B22; padding: 16px; border-radius: 8px; border: 1px solid #30363D; margin-bottom: 12px;">
    <h3 style="color: #F0F6FC; margin: 0 0 8px;">📦 ${asset.name} <span style="color: #8B949E; font-weight: normal; font-size: 13px;">(${asset.platform || asset.type})</span></h3>
    ${asset.username ? `<p style="margin: 4px 0; color: #E6EDF3;"><strong>Username/Email:</strong> <code style="background: #0D1117; padding: 2px 6px; border-radius: 4px;">${asset.username}</code></p>` : ''}
    ${asset.password ? `<p style="margin: 4px 0; color: #E6EDF3;"><strong>Password:</strong> <code style="background: #0D1117; padding: 2px 6px; border-radius: 4px;">${asset.password}</code></p>` : ''}
    ${asset.notes ? `<p style="margin: 4px 0; color: #8B949E;"><strong>Notes:</strong> ${asset.notes}</p>` : ''}
  </div>
  `).join('')}

  <div style="background: #1C2128; padding: 16px; border-radius: 8px; margin-top: 24px; border-left: 4px solid #D29922;">
    <p style="margin: 0; color: #D29922;"><strong>⚠️ Important:</strong></p>
    <ul style="color: #8B949E; padding-left: 20px;">
      <li>Handle these credentials responsibly</li>
      <li>Some accounts may have 2FA enabled</li>
      <li>Consider updating passwords after access</li>
    </ul>
  </div>

  <p style="color: #484F58; text-align: center; font-size: 12px; margin-top: 32px;">
    Sent by DataWill — datawill.onrender.com
  </p>
</div>`;

  await mail.sendMail({
    from: process.env.SMTP_USER || process.env.GMAIL_USER || '"DataWill" <noreply@datawill.com>',
    to: contactEmail,
    subject,
    text,
    html,
  });

  console.log(`✅ Death protocol email sent to ${contactEmail} for user ${userName}`);
}

/**
 * Send a reminder email to the user about missed check-in.
 */
export async function sendCheckInReminder({ userEmail, userName, missedCount }) {
  const mail = getTransporter();

  await mail.sendMail({
    from: process.env.SMTP_USER || process.env.GMAIL_USER || '"DataWill" <noreply@datawill.com>',
    to: userEmail,
    subject: `⚠️ DataWill — You missed a check-in (${missedCount} missed)`,
    text: `Hi ${userName},\n\nYou've missed ${missedCount} check-in(s) on DataWill.\n\nIf you do not check in soon, your digital estate will be shared with your trusted contacts after ${3 - missedCount} more missed check-in(s).\n\nCheck in now: ${process.env.BETTER_AUTH_URL || 'https://datawill.onrender.com'}/dashboard\n\n— DataWill`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #D29922;">⚠️ Missed Check-in</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>You've missed <strong>${missedCount}</strong> check-in(s) on DataWill.</p>
      <p>If you do not check in soon, your digital estate will be shared with your trusted contacts after <strong>${3 - missedCount}</strong> more missed check-in(s).</p>
      <a href="${process.env.BETTER_AUTH_URL || 'https://datawill.onrender.com'}/dashboard" style="display: inline-block; background: #1A3A2A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">✅ Check In Now</a>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">— DataWill</p>
    </div>`
  });

  console.log(`📧 Reminder sent to ${userEmail} (${missedCount} missed)`);
}

/**
 * Send the 72-HOUR CHALLENGE email — LAST CHANCE before death protocol.
 */
export async function sendChallengeEmail({ userEmail, userName }) {
  const mail = getTransporter();
  const appUrl = process.env.BETTER_AUTH_URL || 'https://datawill.onrender.com';

  await mail.sendMail({
    from: process.env.SMTP_USER || process.env.GMAIL_USER || '"DataWill" <noreply@datawill.com>',
    to: userEmail,
    subject: `🚨 URGENT: DataWill — 72 hours to cancel credential sharing`,
    text: `URGENT — ${userName},\n\nYou have missed 3 consecutive check-ins on DataWill.\n\n⚠️ In 72 HOURS, your stored credentials will be shared with your trusted contacts.\n\nIf you are still alive, CANCEL NOW:\n${appUrl}/emergency\n\nYou need your email and 6-digit emergency PIN to cancel.\n\nIf you cannot access your account, go to ${appUrl}/emergency from ANY device — no login required.\n\n— DataWill`,
    html: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #0A0E14; color: #E6EDF3; padding: 32px; border-radius: 12px; border: 2px solid #F43F5E;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🚨</div>
        <h1 style="color: #F43F5E; margin: 0; font-size: 24px;">LAST CHANCE</h1>
        <p style="color: #8B949E; font-size: 14px;">72-Hour Challenge Window Active</p>
      </div>
      
      <div style="background: #161B22; padding: 24px; border-radius: 8px; border: 1px solid #30363D;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>You have <strong>missed 3 consecutive check-ins</strong>.</p>
        <p style="color: #F43F5E; font-weight: bold; font-size: 16px;">In 72 hours, your stored credentials will be shared with your trusted contacts.</p>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <p style="color: #8B949E; margin-bottom: 16px;">If you are alive, cancel the protocol now:</p>
        <a href="${appUrl}/emergency" style="display: inline-block; background: linear-gradient(135deg, #1A5C35, #2D7A4C); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: bold;">
          🛑 CANCEL DEATH PROTOCOL
        </a>
        <p style="color: #64748B; font-size: 12px; margin-top: 12px;">No login required — just your email + 6-digit emergency PIN</p>
      </div>

      <div style="background: #1C2128; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
        <p style="margin: 0; color: #F59E0B;"><strong>💡 Lost your phone/laptop?</strong></p>
        <p style="color: #8B949E; margin: 8px 0 0;">Go to <code style="background: #0D1117; padding: 2px 6px; border-radius: 4px;">${appUrl}/emergency</code> from ANY device — a friend's phone, a library computer, anything.</p>
      </div>

      <p style="color: #484F58; text-align: center; font-size: 12px; margin-top: 32px;">
        Sent by DataWill — datawill.onrender.com
      </p>
    </div>`
  });

  console.log(`🚨 72h CHALLENGE email sent to ${userEmail}`);
}
