import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  {
    icon: Fingerprint,
    title: "Uma identidade",
    description:
      "Entre com a conta que você já tem. Sem senhas para lembrar, sem formulários de cadastro.",
  },
  {
    icon: ShieldCheck,
    title: "Sessões seguras",
    description:
      "Tokens assinados e cookies httpOnly cuidam da sua sessão do início ao fim.",
  },
  {
    icon: KeyRound,
    title: "Pronto para crescer",
    description:
      "Google e GitHub hoje. Novos provedores podem ser adicionados sem mudar o seu fluxo.",
  },
];

const steps = [
  {
    number: "01",
    title: "Escolha o provedor",
    description: "Google ou GitHub — dois toques e o fluxo começa.",
  },
  {
    number: "02",
    title: "Autorize o acesso",
    description:
      "A autenticação acontece no provedor. Nenhum dado de senha passa por aqui.",
  },
  {
    number: "03",
    title: "Entre direto",
    description: "Você volta para a plataforma já autenticado.",
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

  const ctaLabel = isLoading ? "..." : isAuthenticated ? "Ir para o painel" : "Entrar";
  const ctaTarget = isAuthenticated ? "/dashboard" : "/auth";

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
            Authly<span className="text-muted-foreground">.</span>
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
            onClick={() => navigate(ctaTarget)}
            className="cursor-pointer text-sm font-medium transition-colors hover:text-foreground md:hidden"
          >
            {ctaLabel}
          </button>
          <button
            type="button"
            onClick={() => navigate(ctaTarget)}
            className="hidden h-9 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted md:inline-flex"
          >
            {ctaLabel}
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
            Autenticação sem atrito
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl"
          >
            Entre com o Google
            <br />o GitHub.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
          >
            Um autenticador simples para a web: dois provedores, uma sessão
            segura e nenhuma senha para gerenciar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => navigate(ctaTarget)}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {ctaLabel}
              <ArrowRight className="size-4" />
            </button>
            <a
              href="#como-funciona"
              className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Ver como funciona
            </a>
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
              Pronto para entrar?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Leva menos de um minuto. Escolha um provedor e comece a usar.
            </p>
            <button
              type="button"
              onClick={() => navigate(ctaTarget)}
              className="mt-10 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {ctaLabel}
              <ArrowRight className="size-4" />
            </button>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>
            Authly<span className="ml-0.5">.</span>
          </span>
          <span>Login social com Google e GitHub</span>
        </div>
      </footer>
    </div>
  );
}
