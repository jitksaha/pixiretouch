import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Inbox, MessageSquare, FileText, Image as ImageIcon, Wrench, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/quotes", label: "Quotes", icon: Inbox },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { to: "/admin/services", label: "Services", icon: Wrench },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { navigate({ to: "/auth" }); return; }
      setEmail(u.user.email ?? "");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-3xl">Not authorized</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account ({email}) is signed in but does not have admin access.
        </p>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr] md:px-8">
      <aside className="space-y-1">
        <div className="mb-4 px-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Admin</p>
          <p className="truncate text-sm">{email}</p>
        </div>
        {nav.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="mt-4 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
