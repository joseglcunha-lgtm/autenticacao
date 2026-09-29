import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Fingerprint, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  {
    icon: Fingerprint,
    title: "Cadastro sem formulário",
    description:
      "A conta nasce do primeiro login social. Sem senhas para criar, guardar ou redefinir.",
  },
  {
    icon: ShieldCheck,
    title: "Sessões seguras",
    description:
      "Tokens assinados e cookies httpOnly protegem cada sessão, do primeiro acesso ao logout.",
  },
  {
    icon: Building2,
    title: "Feito para empresas",
    description:
      "Uma base de autenticação pronta para times que querem lançar produtos — não construir login.",
  },
];

const steps = [
  {
    number: "01",
    title: "Escolha um provedor",
    description: "O usuário seleciona Google ou GitHub para continuar.",
  },
  {
    number: "02",
    title: "Autorize o acesso",
    description:
      "A confirmação acontece na conta do provedor. Nenhuma senha passa pelo produto.",
  },
  {
    number: "03",
    title: "Entre ou cadastre-se",
    description:
      "No primeiro acesso a conta é criada; nos seguintes, o login é imediato.",
  },
];

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  const primaryLabel = isLoading
    ? "..."
    : isAuthenticated
      ? "Ir para o painel"
      : "Criar conta";
  const primaryTarget = isAuthenticated ? "/dashboard" : "/auth?mode=signup";
  const secondaryTarget = isAuthenticated
    ? "#como-funciona"
    : "/auth?mode=login";
  const secondaryLabel = isAuthenticated ? "Ver como funciona" : "Entrar";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer text-sm font-semibold tracking-tight"
          >
            Minimal Auth Flow
          </button>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
          </nav>
          <button
            type="button"
            onClick={() =>
              navigate(isAuthenticated ? "/dashboard" : "/auth?mode=login")
            }
            className="cursor-pointer text-sm font-medium transition-colors hover:text-foreground md:hidden"
          >
            {isAuthenticated ? "Painel" : "Entrar"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(isAuthenticated ? "/dashboard" : "/auth?mode=login")
            }
            className="hidden h-9 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted md:inline-flex"
          >
            {isAuthenticated ? "Ir para o painel" : "Entrar"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-28 pb-24 text-center md:pt-40 md:pb-32">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
          >
            Autenticação para empresas
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl"
          >
            Cadastro e login com Google ou GitHub.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
          >
            Minimal Auth Flow é a camada de autenticação para o seu produto:
            seus usuários criam conta no primeiro acesso e entram nos
            seguintes — sem senha e sem atrito.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => navigate(primaryTarget)}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </button>
            {secondaryTarget.startsWith("#") ? (
              <a
                href={secondaryTarget}
                className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                {secondaryLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => navigate(secondaryTarget)}
                className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                {secondaryLabel}
              </button>
            )}
          </motion.div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="border-t" />
        </div>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto w-full max-w-5xl px-6 py-24">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Como funciona
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Três passos, nada mais.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.1}>
                <div>
                  <div className="text-sm font-medium tabular-nums text-muted-foreground">
                    {step.number}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="border-t" />
        </div>

        {/* Recursos */}
        <section id="recursos" className="mx-auto w-full max-w-5xl px-6 py-24">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Recursos
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              O essencial, bem feito.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <div>
                  <div className="flex size-10 items-center justify-center rounded-md border">
                    <feature.icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="border-t" />
        </div>

        {/* CTA final */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-28 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Autenticação pronta para o seu produto.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Adicione cadastro e login com Google e GitHub hoje. Configuração
              única, experiência imediata.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(primaryTarget)}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {primaryLabel}
                <ArrowRight className="size-4" />
              </button>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => navigate("/auth?mode=login")}
                  className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Entrar
                </button>
              )}
            </div>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>Minimal Auth Flow</span>
          <span>Cadastro e login social para empresas</span>
        </div>
      </footer>
    </div>
  );
}
