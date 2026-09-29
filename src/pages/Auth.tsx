import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.11-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1v3.11c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [pending, setPending] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleOAuth = async (provider: "google" | "github") => {
    setPending(provider);
    try {
      await signIn(provider, { redirectTo: redirect });
      // On success the browser is redirected away by the OAuth flow.
      setPending(null);
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast.error("Não foi possível entrar", {
        description:
          error instanceof Error
            ? error.message
            : "Verifique a configuração do provedor e tente novamente.",
      });
      setPending(null);
    }
  };

  const isGooglePending = pending === "google";
  const isGitHubPending = pending === "github";

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Authly
            </p>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              Entrar na plataforma
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use sua conta do Google ou do GitHub para continuar.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer gap-3 text-sm font-medium"
              disabled={pending !== null || authLoading}
              onClick={() => handleOAuth("google")}
            >
              {isGooglePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <GoogleIcon className="size-4" />
              )}
              Continuar com Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer gap-3 text-sm font-medium"
              disabled={pending !== null || authLoading}
              onClick={() => handleOAuth("github")}
            >
              {isGitHubPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <GitHubIcon className="size-4" />
              )}
              Continuar com GitHub
            </Button>
          </div>

          <p className="mt-10 border-t pt-6 text-center text-xs leading-5 text-muted-foreground">
            Sem senha e sem cadastro manual: a autenticação é feita pelo
            provedor escolhido.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
