import crypto from 'crypto';
import express from 'express';
export const rawBodyMiddleware = express.raw({ type: 'application/json' });

export const verifyClerkSignature = (req, res, next) => {
  const signature = req.headers['clerk-signature'];
  if (!signature) return res.status(401).send('Missing signature');

  // Use raw body buffer for HMAC calculation, don’t stringify
  const expected = crypto
    .createHmac('sha256', process.env.CLERK_WEBHOOK_SECRET)
    .update(req.body) // req.body is Buffer here because of raw middleware
    .digest('hex');

  if (signature !== expected) return res.status(401).send('Invalid signature');
  next();
};
