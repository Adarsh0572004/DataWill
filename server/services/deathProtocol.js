import Asset from '../models/Asset.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import { decrypt } from '../utils/encryption.js';
import { sendDeathProtocolEmail } from './emailService.js';

/**
 * Triggers the death protocol for a user:
 * 1. Decrypts all credentials
 * 2. Finds all trusted contacts/beneficiaries
 * 3. Sends email with credentials to each contact
 */
export async function triggerDeathProtocol(userId) {
  console.log(`🚨 DEATH PROTOCOL TRIGGERED for user: ${userId}`);

  try {
    // 1. Get user info
    const user = await User.findById(userId);
    if (!user) {
      console.error(`  ❌ User ${userId} not found`);
      return;
    }

    // 2. Get all assets with decrypted credentials
    const assets = await Asset.find({ userId });
    const decryptedAssets = assets
      .filter(a => a.credentialUsername || a.credentialPassword) // Only assets with credentials
      .map(a => ({
        name: a.name,
        platform: a.platform,
        type: a.type,
        username: a.credentialUsername ? decrypt(a.credentialUsername) : '',
        password: a.credentialPassword ? decrypt(a.credentialPassword) : '',
        notes: a.credentialNotes ? decrypt(a.credentialNotes) : '',
      }));

    if (decryptedAssets.length === 0) {
      console.log(`  ⚠️ No credentials stored for user ${user.name}. Skipping.`);
      return;
    }

    // 3. Get all trusted contacts
    const contacts = await Contact.find({ userId });
    if (contacts.length === 0) {
      console.log(`  ⚠️ No contacts found for user ${user.name}. Cannot send credentials.`);
      return;
    }

    // 4. Send email to each contact
    let sentCount = 0;
    for (const contact of contacts) {
      try {
        await sendDeathProtocolEmail({
          contactEmail: contact.email,
          contactName: contact.name,
          userName: user.name,
          assets: decryptedAssets,
        });
        sentCount++;
      } catch (emailError) {
        console.error(`  ❌ Failed to email ${contact.email}: ${emailError.message}`);
      }
    }

    console.log(`  ✅ Death protocol complete: ${sentCount}/${contacts.length} emails sent for ${user.name}`);
    return { sentCount, totalContacts: contacts.length };
  } catch (error) {
    console.error(`  ❌ Death protocol error: ${error.message}`);
    throw error;
  }
}
