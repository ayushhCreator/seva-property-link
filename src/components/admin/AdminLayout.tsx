import { ReactNode, useEffect, useState } from "react";
import { Navigate, NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, FileText, LogOut, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Leads", url: "/admin/leads", icon: Users, end: false },
];

function AdminSidebar({ onSignOut }: { onSignOut: () => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-4 border-b">
          {!collapsed ? (
            <div>
              <p className="font-bold text-lg text-primary">BhumiSeva</p>
              <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
          ) : (
            <p className="font-bold text-primary text-center">B</p>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <RouterNavLink
                      to={item.url}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </RouterNavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:bg-muted/50"
                  >
                    <FileText className="h-4 w-4" />
                    {!collapsed && (
                      <span className="flex items-center gap-1">
                        Sanity Studio <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-2">
          <Button variant="ghost" className="w-full justify-start" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && "Sign out"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkRole = async (userId: string) => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      const roles = (data ?? []).map((r) => r.role);
      if (!mounted) return;
      setHasAccess(roles.includes("admin") || roles.includes("moderator"));
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setAuthed(false);
        setHasAccess(false);
        setLoading(false);
        return;
      }
      setAuthed(true);
      setTimeout(() => checkRole(session.user.id), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      setAuthed(true);
      checkRole(data.session.user.id);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground max-w-md">
          Your account is signed in but has no admin role assigned. Contact the BhumiSeva owner to grant access.
        </p>
        <Button variant="outline" onClick={onSignOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar onSignOut={onSignOut} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b px-2 bg-background">
            <SidebarTrigger />
            <div className="ml-3 text-sm text-muted-foreground">BhumiSeva Admin</div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-muted/30">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
