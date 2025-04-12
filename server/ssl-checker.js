const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Middleware
app.use(cors());
app.use(express.json());

// SSL Certificate Checker endpoint
app.get('/api/check-ssl', async (req, res) => {
    try {
        const { domain } = req.query;
        
        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        // Check cache first
        const cachedResult = cache.get(domain);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        // Use SSL Labs API
        const response = await axios.get(`https://api.ssllabs.com/api/v3/analyze`, {
            params: {
                host: domain,
                startNew: 'on',
                all: 'done'
            }
        });

        if (response.data.status === 'DNS' || response.data.status === 'IN_PROGRESS') {
            // If analysis is in progress, return a status indicating to retry
            return res.json({ status: 'in_progress' });
        }

        if (response.data.status === 'READY') {
            const cert = response.data.endpoints[0].details.cert;
            const result = {
                domain: domain,
                issuer: cert.issuerSubject,
                validFrom: cert.notBefore,
                expiresOn: cert.notAfter,
                valid: new Date(cert.notAfter) > new Date(),
                chain: cert.chain.map(c => ({
                    subject: c.subject,
                    issuer: c.issuer,
                    valid: new Date(c.notAfter) > new Date()
                }))
            };

            // Cache the result
            cache.set(domain, result);
            
            return res.json(result);
        }

        throw new Error('Certificate analysis failed');
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response?.status === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        }
        return res.status(500).json({ error: 'Failed to check SSL certificate' });
    }
});

app.listen(port, () => {
    console.log(`SSL Checker server running on port ${port}`);
}); 