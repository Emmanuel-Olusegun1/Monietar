const { Mono } = require('mono-node');

export const mono = new Mono({
  secretKey: process.env.MONO_SECRET_KEY!,
  webhookSecret: process.env.MONO_WEBHOOK_SECRET!,
});

export const MONO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY!,
};