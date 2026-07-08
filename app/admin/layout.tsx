import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Film, Megaphone, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { SidebarNavLink } from "./sidebar-nav-link";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Iklan", href: "/admin/iklan", icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-dvh w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" render={<SidebarNavLink href="/admin" />}>
                  <Film className="size-5" />
                  <span className="font-semibold">Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton render={<SidebarNavLink href={item.href} />}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <form action={logout}>
                  <SidebarMenuButton
                    render={<button type="submit" />}
                    className="text-red-600 hover:text-red-800"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">
          <div className="flex items-center border-b border-gray-200 bg-white px-4 h-14">
            <span className="text-sm font-medium text-gray-900">
              Movie & Iklan Admin
            </span>
            <SidebarTrigger className="ml-auto text-gray-700" />
          </div>
          <div className="bg-white">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
