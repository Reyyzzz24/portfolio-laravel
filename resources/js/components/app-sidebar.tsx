import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutDashboard,
    LayoutGrid,
    Image,
    Briefcase,
    Cpu,
    Navigation,
    Mail,
    LayoutPanelLeft,
    Users,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { dashboard } from '@/routes';

const navGroups = [
    {
        title: "Content Management",
        icon: LayoutGrid,
        items: [
            { title: 'Navbar', href: '/admin/navbar', icon: Navigation },
            { title: 'Hero', href: '/admin/hero', icon: Image },
            { title: 'Services', href: '/admin/services', icon: Briefcase },
            { title: 'Projects', href: '/admin/projects', icon: FolderGit2 },
            { title: 'Contact', href: '/admin/contact', icon: Mail },
            { title: 'Footer', href: '/admin/footer', icon: LayoutPanelLeft },
            { title: 'Skills & Edu', href: '/admin/skills-educations', icon: Cpu },
            { title: 'App Gallery', href: '/admin/website-app', icon: BookOpen },
            { title: 'Design & Photography', href: '/admin/design-photography', icon: Image },
        ],
    },
    {
        title: "System & Security",
        icon: ShieldCheck,
        items: [
            { title: 'User Management', href: '/admin/users', icon: Users },
            { title: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
        ],
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard Utama */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin">
                                <LayoutDashboard /> <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Render Nav Groups */}
                    {navGroups.map((group) => (
                        <Collapsible key={group.title} defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <group.icon /> <span>{group.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {group.items.map((item) => (
                                            <SidebarMenuSubItem key={item.href}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={item.href}>
                                                        <item.icon className="w-4 h-4" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}