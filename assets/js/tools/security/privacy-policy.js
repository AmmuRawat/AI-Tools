document.addEventListener('DOMContentLoaded', function() {
    const privacyPolicyForm = document.getElementById('privacyPolicyForm');
    const resultContainer = document.getElementById('resultContainer');
    const privacyPolicyText = document.getElementById('privacyPolicyText');
    const copyButton = document.getElementById('copyResult');

    // Template sections
    const templates = {
        introduction: (companyName, websiteUrl) => `
Privacy Policy for ${companyName}

Last updated: ${new Date().toLocaleDateString()}

This Privacy Policy describes how ${companyName} ("we", "us", or "our") collects, uses, and shares your personal information when you visit our website at ${websiteUrl} (the "Website").
        `,

        informationCollection: (collectPersonal, collectUsage, collectPayment) => {
            let sections = [];
            
            if (collectPersonal) {
                sections.push(`
Personal Information
We collect personal information that you voluntarily provide to us when you:
- Register for an account
- Subscribe to our newsletter
- Contact us through our website
- Make a purchase

The personal information we collect may include:
- Name
- Email address
- Phone number
- Mailing address
- Other information you choose to provide
                `);
            }

            if (collectUsage) {
                sections.push(`
Usage Data
We automatically collect certain information about your device and how you interact with our Website, including:
- IP address
- Browser type and version
- Pages visited
- Time spent on pages
- Referring website
- Device information
                `);
            }

            if (collectPayment) {
                sections.push(`
Payment Information
When you make a purchase through our Website, we collect payment information, including:
- Credit card details
- Billing address
- Transaction history

Note: We do not store your complete credit card information. All payment processing is handled by our secure payment processor.
                `);
            }

            return sections.join('\n\n');
        },

        cookies: (hasCookies) => hasCookies ? `
Use of Cookies
We use cookies and similar tracking technologies to:
- Remember your preferences
- Analyze website traffic
- Improve user experience
- Deliver targeted advertising

You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our Website.
        ` : '',

        thirdParty: (hasThirdParty) => hasThirdParty ? `
Third-Party Services
We may use third-party services that collect, monitor, and analyze information about our users. These services may include:
- Analytics providers
- Advertising networks
- Payment processors
- Social media platforms

These third parties have their own privacy policies and may collect information about you independently.
        ` : '',

        children: (hasChildren) => hasChildren ? `
Children's Privacy
Our Website is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        ` : '',

        dataProtection: (country) => {
            const laws = {
                'US': 'California Consumer Privacy Act (CCPA) and other applicable state laws',
                'EU': 'General Data Protection Regulation (GDPR)',
                'UK': 'UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018',
                'CA': 'Personal Information Protection and Electronic Documents Act (PIPEDA)',
                'AU': 'Privacy Act 1988 and Australian Privacy Principles',
                'other': 'applicable data protection laws'
            };

            return `
Data Protection Rights
Under ${laws[country] || laws['other']}, you have certain rights regarding your personal information:
- Right to access your personal information
- Right to correct inaccurate information
- Right to request deletion of your information
- Right to restrict or object to processing
- Right to data portability
- Right to withdraw consent
        `;
        },

        contact: (contactEmail) => `
Contact Us
If you have any questions about this Privacy Policy or our data practices, please contact us at:
Email: ${contactEmail}
        `
    };

    // Generate privacy policy
    function generatePrivacyPolicy(formData) {
        const {
            companyName,
            websiteUrl,
            contactEmail,
            country,
            collectPersonal,
            collectUsage,
            collectPayment,
            hasCookies,
            hasThirdParty,
            hasChildren
        } = formData;

        const sections = [
            templates.introduction(companyName, websiteUrl),
            templates.informationCollection(collectPersonal, collectUsage, collectPayment),
            templates.cookies(hasCookies),
            templates.thirdParty(hasThirdParty),
            templates.children(hasChildren),
            templates.dataProtection(country),
            templates.contact(contactEmail)
        ];

        return sections.filter(section => section.trim()).join('\n\n');
    }

    // Copy to clipboard
    copyButton.addEventListener('click', function() {
        const text = privacyPolicyText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });

    // Handle form submission
    privacyPolicyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            companyName: document.getElementById('companyName').value,
            websiteUrl: document.getElementById('websiteUrl').value,
            contactEmail: document.getElementById('contactEmail').value,
            country: document.getElementById('country').value,
            collectPersonal: document.getElementById('collectPersonal').checked,
            collectUsage: document.getElementById('collectUsage').checked,
            collectPayment: document.getElementById('collectPayment').checked,
            hasCookies: document.getElementById('hasCookies').checked,
            hasThirdParty: document.getElementById('hasThirdParty').checked,
            hasChildren: document.getElementById('hasChildren').checked
        };

        const policy = generatePrivacyPolicy(formData);
        privacyPolicyText.textContent = policy;
        resultContainer.style.display = 'block';
    });
}); 