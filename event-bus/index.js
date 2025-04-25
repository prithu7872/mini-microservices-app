import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

// Array of services to notify
const services = [
  "http://localhost:2001/events",
  "http://localhost:2002/events",
  "http://localhost:2003/events",
];
/*I'll explain how the event bus works step by step when you send a POST request from your posts service.

1. **Initial POST Request to Posts Service**
When you make a POST request to `/post` in your posts service, here's what happens:

```javascript
const eventResponse = await axios.post("http://localhost:4005/events", {
  type: "PostCreated",
  data: { uuid, name, title, body },
});
```

2. **Event Bus Processing**
The event bus (`event-bus/index.js`) receives this request and processes it:

```javascript
app.post("/events", async (req, res) => {
  const event = req.body;  // This contains your PostCreated event
```

3. **Event Validation**
The event bus first validates the incoming event:
```javascript
if (!event || typeof event !== "object") {
  return res.status(400).json({
    status: "ERROR",
    message: "Invalid event data",
  });
}
```

4. **Broadcasting to Services**
The event bus then broadcasts this event to all registered services in parallel:
```javascript
const services = [
  "http://localhost:2001/events",
  "http://localhost:2002/events",
  "http://localhost:2003/events",
];

const promises = services.map((serviceUrl) =>
  axios.post(serviceUrl, event).catch((error) => ({
    service: serviceUrl,
    error: error.message,
  }))
);
```

5. **Response Handling**
The event bus waits for all services to respond and then:
- If all services receive the event successfully:
```javascript
res.status(200).json({
  status: "SUCCESS",
  message: "Event successfully broadcasted to all services",
});
```
- If some services fail:
```javascript
res.status(500).json({
  status: "PARTIAL_SUCCESS",
  message: "Some services failed to receive the event",
  failures: failures.map((f) => f.reason),
});
```

Here's a visual flow of what happens:

```
[Posts Service]                    [Event Bus]                    [Other Services]
     |                                |                                |
     | 1. POST /post                  |                                |
     |------------------------------->|                                |
     |                                |                                |
     | 2. POST /events                |                                |
     |------------------------------->|                                |
     |                                |                                |
     |                                | 3. Validate Event              |
     |                                |                                |
     |                                | 4. Broadcast to Services       |
     |                                |------------------------------->|
     |                                |                                |
     |                                | 5. Wait for Responses          |
     |                                |<------------------------------|
     |                                |                                |
     | 6. Return Response             |                                |
     |<------------------------------|                                |
     |                                |                                |
```

The key benefits of this architecture are:
1. **Decoupling**: Services don't need to know about each other
2. **Reliability**: The event bus handles retries and error cases
3. **Scalability**: New services can be added by just registering their endpoints
4. **Parallel Processing**: Events are sent to all services simultaneously

When you get the `eventResponse` back in your posts service, it contains:
- Success case: A 200 status with a success message
- Partial success: A 500 status with details about which services failed
- Error case: A 500 status with an error message

This is why it's important to handle the `eventResponse` properly in your posts service, as it tells you whether the event was successfully broadcasted to all other services in your microservices architecture.
*/ 
app.post("/events", async (req, res) => {
  const event = req.body;

  // Validate event data
  if (!event || typeof event !== "object") {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid event data",
    });
  }

  try {
    // Send event to all services in parallel
    const promises = services.map((serviceUrl) =>
      axios.post(serviceUrl, event).catch((error) => ({
        service: serviceUrl,
        error: error.message,
      }))
    );

    const results = await Promise.allSettled(promises);

    // Check if any services failed
    const failures = results.filter((result) => result.status === "rejected");

    if (failures.length > 0) {
      console.error("Some services failed to receive the event:", failures);
      return res.status(500).json({
        status: "PARTIAL_SUCCESS",
        message: "Some services failed to receive the event",
        failures: failures.map((f) => f.reason),
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Event successfully broadcasted to all services",
    });
  } catch (error) {
    console.error("Error broadcasting event:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to broadcast event",
    });
  }
});

app.listen(4005, () => {
  console.log("Event Bus listening on port 4005");
});
