import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Painel
          </p>

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
