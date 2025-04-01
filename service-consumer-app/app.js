const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse VCAP_SERVICES
app.use((req, res, next) => {
  try {
    req.services = JSON.parse(process.env.VCAP_SERVICES);
  } catch {
    req.services = {};
  }
  next();
});

// Display service credentials
app.get('/', (req, res) => {
  const serviceName = Object.keys(req.services)[0] || 'No services bound';
  const credentials = req.services[serviceName]?.[0]?.credentials || {};
  
  res.json({
    service_binding: serviceName,
    credentials: credentials
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

