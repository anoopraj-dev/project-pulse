import { Webhook } from "svix";

export const verifyClerkSignature = (req, res, next) => {
  const svixId = req.headers["svix-id"];
  const svixTimestamp = req.headers["svix-timestamp"];
  const svixSignature = req.headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(401).send("Missing Svix headers");
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    // req.body MUST be a raw buffer (NOT JSON-parsed)
    const evt = wh.verify(req.body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    // Attach parsed event payload
    req.clerkEvent = evt;

    next();
  } catch (err) {
    console.error("Clerk signature verification failed:", err.message);
    return res.status(401).send("Invalid signature");
  }
};
