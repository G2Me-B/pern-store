import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

import "dotenv/config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      // block all bots except search engines
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        // full list  at https://arcjet.com/bot-list
      ],
    }),
    // rate limit
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // tokens per second
      capacity: 10, // max tokens
      interval: 10, // seconds
    }),
  ],
});
