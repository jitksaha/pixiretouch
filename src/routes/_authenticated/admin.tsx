import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Wrench,
  LogOut,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  Library,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badgeKey?: "quotes" | "messages";
};

const primaryNav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/quotes", label: "Quote requests", icon: Inbox, badgeKey: "quotes" },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

const contentNav: NavItem[] = [
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { to: "/admin/media", label: "Media library", icon: Library },
  { to: "/admin/services", label: "Services", icon: Wrench },
];

const titleByPath: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Overview", subtitle: "Studio activity at a glance" },
  "/admin/quotes": { title: "Quote requests", subtitle: "Search, filter and manage incoming briefs" },
  "/admin/messages": { title: "Messages", subtitle: "Inbox, threading and replies" },
  "/admin/analytics": { title: "Analytics", subtitle: "Funnels, growth and CSV exports" },
  "/admin/blog": { title: "Blog", subtitle: "Stories, tutorials and announcements" },
  "/admin/portfolio": { title: "Portfolio", subtitle: "Before / after case studies" },
  "/admin/media": { title: "Media library", subtitle: "Upload, search and reuse images & videos" },
  "/admin/services": { title: "Services", subtitle: "Page content overrides" },
};


function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [counts, setCounts] = useState<{ quotes: number; messages: number }>({ quotes: 0, messages: 0 });

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

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [q, m] = await Promise.all([
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({ quotes: q.count ?? 0, messages: m.count ?? 0 });
    })();
  }, [isAdmin, path]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const header = useMemo(() => {
    const match = Object.entries(titleByPath)
      .filter(([p]) => (p === "/admin" ? path === p : path.startsWith(p)))
      .sort((a, b) => b[0].length - a[0].length)[0];
    return match?.[1] ?? { title: "Admin", subtitle: "" };
  }, [path]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 px-4 text-center">
        <ShieldCheck className="h-10 w-10 text-muted-foreground" />
        <h1 className="font-display text-3xl">Not authorized</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account ({email}) is signed in but does not have admin access.
        </p>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  const initials = (email || "A").slice(0, 2).toUpperCase();

  const renderItem = (item: NavItem) => {
    const active = item.exact ? path === item.to : path.startsWith(item.to);
    const Icon = item.icon;
    const badge = item.badgeKey ? counts[item.badgeKey] : 0;
    return (
      <SidebarMenuItem key={item.to}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <Link to={item.to} className="flex w-full items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="flex-1 truncate">{item.label}</span>
            {badge > 0 && (
              <Badge variant={active ? "secondary" : "default"} className="h-5 px-1.5 text-[10px]">
                {badge}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate font-display text-sm leading-tight">Pixi Retouch</p>
                <p className="truncate text-[11px] text-muted-foreground">Studio control room</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Inbox</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{primaryNav.map(renderItem)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{contentNav.map(renderItem)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View live site">
                  <Link to="/" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>View site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg leading-tight">{header.title}</h1>
              <p className="truncate text-xs text-muted-foreground">{header.subtitle}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-3 text-left text-sm shadow-sm transition-colors hover:bg-muted">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-foreground text-[11px] text-background">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[160px] truncate md:inline">{email}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Signed in</p>
                  <p className="truncate text-sm">{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
