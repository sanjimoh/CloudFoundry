const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Basic authentication middleware
const authMiddleware = (req, res, next) => {
    console.log('Checking authentication...');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No authorization header found');
        return res.status(401).json({ error: 'No authorization header' });
    }

    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') {
        console.log('Invalid authorization type:', type);
        return res.status(401).json({ error: 'Invalid authorization type' });
    }

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
    console.log('Received credentials - username:', username);
    
    if (username !== process.env.AUTH_USER || password !== process.env.AUTH_PASSWORD) {
        console.log('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Authentication successful');
    next();
};

// Service catalog endpoint
app.get('/v2/catalog', authMiddleware, (req, res) => {
    console.log('Handling catalog request');
    const catalog = {
        services: [{
            id: 'simple-service-id',
            name: process.env.SERVICE_NAME || 'simple-service',
            description: 'A simple service for testing',
            bindable: true,
            plans: [{
                id: 'simple-plan-id',
                name: process.env.SERVICE_PLAN || 'shared',
                description: 'Shared plan for simple service',
                free: true
            }]
        }]
    };
    console.log('Sending catalog response:', JSON.stringify(catalog, null, 2));
    res.json(catalog);
});

// Provision endpoint
app.put('/v2/service_instances/:instance_id', authMiddleware, (req, res) => {
    const { instance_id } = req.params;
    console.log(`Provisioning instance: ${instance_id}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    res.status(201).json({
        dashboard_url: `https://example.com/dashboard/${instance_id}`,
        operation: 'provision'
    });
});

// Deprovision endpoint
app.delete('/v2/service_instances/:instance_id', authMiddleware, (req, res) => {
    const { instance_id } = req.params;
    console.log(`Deprovisioning instance: ${instance_id}`);
    
    res.status(200).json({
        operation: 'deprovision'
    });
});

// Bind endpoint
app.put('/v2/service_instances/:instance_id/service_bindings/:binding_id', authMiddleware, (req, res) => {
    const { instance_id, binding_id } = req.params;
    console.log(`Binding instance: ${instance_id}, binding: ${binding_id}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    res.status(201).json({
        credentials: {
            uri: `https://example.com/service/${instance_id}`,
            username: 'user',
            password: 'pass'
        }
    });
});

// Unbind endpoint
app.delete('/v2/service_instances/:instance_id/service_bindings/:binding_id', authMiddleware, (req, res) => {
    const { instance_id, binding_id } = req.params;
    console.log(`Unbinding instance: ${instance_id}, binding: ${binding_id}`);
    
    res.status(200).json({});
});

// Last Operation endpoint
app.get('/v2/service_instances/:instance_id/last_operation', authMiddleware, (req, res) => {
    const { instance_id } = req.params;
    res.json({
        state: 'succeeded',
        description: 'Operation completed successfully'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Service broker listening on port ${port}`);
    console.log('Environment variables:');
    console.log('AUTH_USER:', process.env.AUTH_USER);
    console.log('SERVICE_NAME:', process.env.SERVICE_NAME);
    console.log('SERVICE_PLAN:', process.env.SERVICE_PLAN);
}); 