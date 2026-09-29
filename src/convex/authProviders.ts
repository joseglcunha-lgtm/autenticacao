import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/**
 * Provedores de autenticação vinculados ao usuário atual, do mais recente
 * para o mais antigo (ex.: ["google"], ["github", "google"]).
 */
export const myProviders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { providers: [] as string[] };
    }
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    const sorted = [...accounts].sort(
      (a, b) => b._creationTime - a._creationTime,
    );
    return { providers: sorted.map((account) => account.provider) };
  },
});
