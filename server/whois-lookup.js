const express = require('express');
const cors = require('cors');
const whois = require('whois');
const NodeCache = require('node-cache');
const app = express();

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to parse whois data
function parseWhoisData(data) {
    const result = {
        domain: null,
        registrar: null,
        registrant: null,
        creationDate: null,
        expirationDate: null,
        nameServers: [],
        status: null
    };

    // Common patterns for different TLDs
    const patterns = {
        domain: /Domain Name:\s*(.+)/i,
        registrar: /Registrar:\s*(.+)|Registrar Name:\s*(.+)/i,
        registrant: /Registrant Name:\s*(.+)|Registrant Organization:\s*(.+)/i,
        creationDate: /Creation Date:\s*(.+)|Created On:\s*(.+)|Registered On:\s*(.+)/i,
        expirationDate: /Expiration Date:\s*(.+)|Registry Expiry Date:\s*(.+)|Expires On:\s*(.+)/i,
        nameServer: /Name Server:\s*(.+)/gi,
        status: /Domain Status:\s*(.+)/i
    };

    // Extract information using patterns
    for (const [key, pattern] of Object.entries(patterns)) {
        if (key === 'nameServer') {
            let match;
            while ((match = pattern.exec(data)) !== null) {
                result.nameServers.push(match[1].trim());
            }
        } else {
            const match = data.match(pattern);
            if (match) {
                result[key] = match[1] || match[2] || match[3];
            }
        }
    }

    return result;
}

// Whois lookup endpoint
app.get('/api/whois', async (req, res) => {
    const { domain } = req.query;

    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }

    try {
        // Check cache first
        const cachedResult = cache.get(domain);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        // Perform whois lookup
        const data = await new Promise((resolve, reject) => {
            whois.lookup(domain, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        // Parse the whois data
        const parsedData = parseWhoisData(data);

        // Cache the result
        cache.set(domain, parsedData);

        // Send response
        res.json(parsedData);
    } catch (error) {
        console.error('Whois lookup error:', error);
        res.status(500).json({ error: 'Failed to perform whois lookup' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Whois lookup server running on port ${PORT}`);
}); 