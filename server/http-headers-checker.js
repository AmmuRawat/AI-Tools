const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Security header checks
const securityHeaders = {
    'Content-Security-Policy': {
        check: (value) => value && value.length > 0,
        message: 'Protects against XSS and other code injection attacks'
    },
    'X-Content-Type-Options': {
        check: (value) => value === 'nosniff',
        message: 'Prevents MIME type sniffing'
    },
    'X-Frame-Options': {
        check: (value) => ['DENY', 'SAMEORIGIN'].includes(value),
        message: 'Protects against clickjacking'
    },
    'Strict-Transport-Security': {
        check: (value) => value && value.includes('max-age='),
        message: 'Enforces HTTPS connections'
    },
    'X-XSS-Protection': {
        check: (value) => value === '1; mode=block',
        message: 'Enables XSS filtering'
    },
    'Referrer-Policy': {
        check: (value) => value && value.length > 0,
        message: 'Controls referrer information'
    },
    'Permissions-Policy': {
        check: (value) => value && value.length > 0,
        message: 'Controls browser features'
    }
};

// HTTP Headers Checker endpoint
app.get('/api/check-headers', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Check cache first
        const cachedResult = cache.get(url);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        // Make request to the URL
        const response = await axios.get(url, {
            maxRedirects: 5,
            timeout: 10000,
            validateStatus: (status) => status < 500
        });

        // Extract headers
        const headers = response.headers;

        // Analyze security headers
        const securityAnalysis = {};
        Object.entries(securityHeaders).forEach(([header, config]) => {
            const value = headers[header.toLowerCase()];
            securityAnalysis[header] = {
                present: !!value,
                value: value || null,
                status: value ? config.check(value) : false,
                message: config.message
            };
        });

        const result = {
            url,
            headers,
            securityAnalysis
        };

        // Cache the result
        cache.set(url, result);

        // Send response
        res.json(result);
    } catch (error) {
        console.error('HTTP Headers Checker error:', error);
        if (error.code === 'ECONNREFUSED') {
            res.status(500).json({ error: 'Could not connect to the server' });
        } else if (error.code === 'ETIMEDOUT') {
            res.status(500).json({ error: 'Connection timed out' });
        } else if (error.response) {
            res.status(error.response.status).json({ error: 'Server returned an error' });
        } else {
            res.status(500).json({ error: 'Failed to check HTTP headers' });
        }
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`HTTP Headers Checker server running on port ${PORT}`);
}); 