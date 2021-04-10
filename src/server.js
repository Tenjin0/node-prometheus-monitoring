const Fastify = require('fastify')

// Constants
const PORT = 5000;
const HOST = '0.0.0.0';

const app =  Fastify({
logger: true
})

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({timeout: 5000})

const counter = new client.Counter({
    name: 'node_request_operations_total',
    help: 'The total number of processed requests'
});

const histogram = new client.Histogram({
    name: 'node_request_duration_seconds',
    help: 'Histogram for the duration in seconds.',
    buckets: [0.05, 0.1, 0.5, 1, 3, 5, 10]
});

const summary = new client.Summary({
    name: 'http_request_summary_seconds',
    help: 'request duration in seconds summary',
    labelNames: ['status_code', 'method', 'route'],
    percentiles: [0.5, 0.9, 0.95, 0.99],
})

app.get('/', function (request, res) {

    const start = new Date()
    const simulateTime = 1000
  
    setTimeout(function(argument) {
      // execution time simulated with setTimeout function
      const end = new Date() - start
      histogram.observe(end / 1000); //convert to seconds
      summary.observe(end / 1000)
    }, simulateTime)
  
    counter.inc();
    // console.log(client.register.contentType)
    res.header('Content-Type', client.register.contentType)
    res.send("Hello world")
})

app.get('/metrics2', function(req, res) {
    res.header('Content-Type', client.register.contentType)
    res.send("Hello world")
})

app.get('/metrics', (req, res) => {
    res.header('Content-Type', client.register.contentType)
    return client.register.metrics()
})
  
// Run the server!
app.listen(PORT, HOST, function (err, address) {
if (err) {
    app.log.error(err)
    process.exit(1)
}

app.log.info(`server listening on ${address}`)
})
