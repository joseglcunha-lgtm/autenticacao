import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Github, LogOut, ShieldCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

const providerLabels: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const providerIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  google: GoogleIcon,
  github: Github,
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const providerData = useQuery(api.authProviders.myProviders);
  const greetedRef = useRef(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Mensagem de boas-vindas exibida uma vez, ao chegar autenticado.
  useEffect(() => {
    if (!user || greetedRef.current) return;
    // A tela aparece quando o usuário acaba de completar um login: seja pela
    // flag gravada em /auth, seja pelo ?code= que o Convex emite no redirect
    // pós-autenticação.
    const params = new URLSearchParams(window.location.search);
    const justLoggedIn =
      sessionStorage.getItem("auth:welcome") === "1" || params.has("code");
    if (!justLoggedIn) return;
    greetedRef.current = true;
    sessionStorage.removeItem("auth:welcome");
    if (params.has("code")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
    setShowGreeting(true);
  }, [user]);

  // A tela de boas-vindas fecha automaticamente após alguns segundos.
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  }, [showGreeting]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (user?.name ?? user?.email ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const latestProvider = providerData?.providers?.[0];
  const LatestProviderIcon = latestProvider
    ? providerIcons[latestProvider]
    : undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Minimal Auth Flow
          </p>

          {showGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-6 flex flex-col items-start gap-2 rounded-md border bg-muted/40 px-6 py-8 sm:items-center sm:text-center"
            >
              {LatestProviderIcon ? (
                <LatestProviderIcon className="size-6 shrink-0" />
              ) : (
                <ShieldCheck
                  className="size-6 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
              )}
              <p className="text-2xl font-bold tracking-tight">
                Obrigado por logar!!!
              </p>
              <p className="text-sm text-muted-foreground">
                {latestProvider
                  ? `Você entrou via ${providerLabels[latestProvider] ?? latestProvider}.`
                  : "Sessão iniciada com sucesso."}
              </p>
            </motion.div>
          )}

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 border">
                <AvatarImage src={user?.image} alt={user?.name ?? "Avatar"} />
                <AvatarFallback className="text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {user?.name ?? "Usuário"}
                </h1>
                {user?.email && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer gap-2 self-start"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-12"
        >
          <div className="border-t" />

          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Conta</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b pb-3">
                  <dt className="text-muted-foreground">Nome</dt>
                  <dd className="text-right font-medium">
                    {user?.name ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b pb-3">
                  <dt className="text-muted-foreground">E-mail</dt>
                  <dd className="text-right font-medium">
                    {user?.email ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b pb-3">
                  <dt className="text-muted-foreground">Login via</dt>
                  <dd className="text-right font-medium">
                    {providerData === undefined
                      ? "—"
                      : providerData.providers.length > 0
                        ? providerData.providers
                            .map((p) => providerLabels[p] ?? p)
                            .join(", ")
                        : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="text-right font-mono text-xs leading-5">
                    {user ? String(user._id) : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Segurança
              </h2>
              <div className="mt-4 flex items-start gap-3 border-b pb-3">
                <ShieldCheck
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div className="text-sm leading-6">
                  <p className="font-medium">Login social ativo</p>
                  <p className="mt-1 text-muted-foreground">
                    Sua sessão é gerenciada com tokens assinados e cookies
                    httpOnly. Não há senha para proteger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
