import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { emailOtp } from "./auth/emailOtp";

// Credentials are read from AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET and
// AUTH_GITHUB_ID / AUTH_GITHUB_SECRET (see SETUP.md).
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    emailOtp,
    Anonymous,
    GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
  ],
});
