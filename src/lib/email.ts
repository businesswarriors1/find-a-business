import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Find a Business <noreply@findabusiness.com.au>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@findabusiness.com.au";

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${html.slice(0, 200)}...`);
    return { id: "mock-" + Date.now() };
  }
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export async function sendListingApprovedEmail(business: {
  name: string;
  slug: string;
  contact_email?: string;
}) {
  const listingUrl = `https://findabusiness.com.au/business/${business.slug}`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0D6EFD;">Your Business is Now Listed!</h2>
      <p>Hi there,</p>
      <p>Great news — <strong>${business.name}</strong> has been approved and is now live on Find a Business!</p>
      <p>You can view your listing here:</p>
      <a href="${listingUrl}" style="display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Listing</a>
      <p style="margin-top: 24px; color: #6B7280;">If you have any questions, just reply to this email.</p>
      <p style="color: #6B7280;">— The Find a Business team</p>
    </div>
  `;
  const to = business.contact_email ?? ADMIN_EMAIL;
  return sendEmail(to, `Your business "${business.name}" is live on Find a Business!`, html);
}

export async function sendListingRejectedEmail(
  businessName: string,
  reason: string,
  contactEmail?: string,
) {
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DC2626;">Listing Request Update</h2>
      <p>Hi there,</p>
      <p>Thank you for submitting <strong>${businessName}</strong> to Find a Business.</p>
      <p>Unfortunately, we weren't able to approve this submission at this time because:</p>
      <blockquote style="border-left: 4px solid #E5E7EB; padding-left: 16px; color: #6B7280; margin: 16px 0;">
        ${reason}
      </blockquote>
      <p>If you think this was a mistake, please reply to this email or resubmit with corrected information.</p>
      <p style="color: #6B7280;">— The Find a Business team</p>
    </div>
  `;
  const to = contactEmail ?? ADMIN_EMAIL;
  return sendEmail(to, `Update on your "${businessName}" listing request`, html);
}

export async function sendDay7NurtureEmail(business: {
  name: string;
  slug: string;
  contact_email?: string;
}) {
  const listingUrl = `https://findabusiness.com.au/business/${business.slug}`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0D6EFD;">One Week on Find a Business!</h2>
      <p>Hi there,</p>
      <p>It's been a week since <strong>${business.name}</strong> went live on Find a Business. Here are a few tips to make the most of your listing:</p>
      <ul>
        <li>Make sure your description is detailed — it helps with search visibility.</li>
        <li>Encourage happy customers to leave a review on your listing.</li>
        <li>Share your listing link on social media.</li>
      </ul>
      <a href="${listingUrl}" style="display: inline-block; background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Listing</a>
      <p style="margin-top: 24px; color: #6B7280;">— The Find a Business team</p>
    </div>
  `;
  const to = business.contact_email ?? ADMIN_EMAIL;
  return sendEmail(to, `Tips for your Find a Business listing`, html);
}

export async function sendDay30UpgradeEmail(business: {
  name: string;
  slug: string;
  contact_email?: string;
}) {
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0D6EFD;">Upgrade Your Listing for More Visibility</h2>
      <p>Hi there,</p>
      <p>Your listing for <strong>${business.name}</strong> has been live for 30 days!</p>
      <p>Want to stand out from the competition? Upgrading your listing gives you:</p>
      <ul>
        <li>Priority placement in search results</li>
        <li>Featured badge on your listing</li>
        <li>Photo gallery</li>
        <li>Social media links</li>
      </ul>
      <p style="color: #6B7280;">Premium plans coming soon — stay tuned!</p>
      <p style="color: #6B7280;">— The Find a Business team</p>
    </div>
  `;
  const to = business.contact_email ?? ADMIN_EMAIL;
  return sendEmail(to, `Take your Find a Business listing to the next level`, html);
}

export async function sendDay60SalesEmail(business: {
  name: string;
  slug: string;
  contact_email?: string;
}) {
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #F97316;">Still getting value from your free listing?</h2>
      <p>Hi there,</p>
      <p>Your business <strong>${business.name}</strong> has been on Find a Business for 60 days now. We hope it's been bringing you customers!</p>
      <p>Soon we'll be launching premium features including:</p>
      <ul>
        <li>Advanced analytics on listing views and clicks</li>
        <li>Lead generation forms</li>
        <li>Customer engagement tools</li>
      </ul>
      <p style="color: #6B7280;">Want early access? Reply to this email.</p>
      <p style="color: #6B7280;">— The Find a Business team</p>
    </div>
  `;
  const to = business.contact_email ?? ADMIN_EMAIL;
  return sendEmail(to, `Your Find a Business journey — 60 days in`, html);
}
