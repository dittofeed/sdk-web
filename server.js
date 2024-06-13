const fastify = require("fastify")({ logger: true });
const fastifyCors = require("@fastify/cors");

// Enable CORS for all routes
fastify.register(fastifyCors, {
  origin: "*", // Allow all origins
  methods: ["GET", "POST"],
});

// Serve your HTML file at the root URL
fastify.get("/", async (request, reply) => {
  // Set Content-Type to text/html
  reply.type("text/html");

  // HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>DittoFeed Library Test</title>
      </head>
      <body>
        <h1>DittoFeed Library Test</h1>
        <script type="text/javascript">
          var _df = _df || [];

          (function () {
            var methods = ["track", "identify", "page", "flush"];
            methods.forEach(function (method) {
              _df[method] = function () {
                _df.push([method].concat(Array.prototype.slice.call(arguments)));
              };
            });
        
            var script = document.createElement("script");
            script.type = "module";
            script.async = true;
        
            // If you're self-hosting the Dittofeed dashboard, you'll need to to
            // specificy your own host.
            script.src = "https://dittofeed.com/dashboard/public/dittofeed.umd.js";
        
            script.id = "df-tracker";
            // Replace with your own write key found on: https://dittofeed.com/dashboard/dittofeed.umd.js
            script.setAttribute("data-write-key", "Basic my-write-key");
            // If you're self-hosting dittofeed, you'll need to to specificy your own host.
            // script.setAttribute("data-host", "http://localhost:3001");
        
            document.head.appendChild(script);
          })();
      
          _df.identify({
            userId: "123",
            email: "test@email.com"
          });
        </script>
      </body>
    </html>
  `;

  // Send the HTML content as the response
  return htmlContent;
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3100);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
