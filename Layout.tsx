
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { useState } from "react";

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarLink = ({ to, children, active }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={`w-full justify-start ${active ? 'bg-accent text-accent-foreground' : ''}`}
      >
        {children}
      </Button>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Extract email username (before @) for display
  const username = user?.email ? user.email.split('@')[0] : "User";
  // Get first character for avatar
  const avatarInitial = username.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex fixed inset-y-0 left-0 z-50 md:relative md:z-0 w-64 flex-col bg-sidebar border-r bg-white`}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-invoice-purple">MS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink to="/dashboard" active={path === "/dashboard"}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/invoices" active={path === "/invoices" || path.includes("/invoice/")}>
            Invoices
          </SidebarLink>
          <SidebarLink to="/clients" active={path === "/clients"}>
            Clients
          </SidebarLink>
          <SidebarLink to="/settings" active={path === "/settings"}>
            Settings
          </SidebarLink>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-invoice-purple text-white flex items-center justify-center mr-3">
                {avatarInitial}
              </div>
              <div>
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="ml-2"
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-10 flex items-center justify-between px-4">
        <h2 className="text-xl font-bold text-invoice-purple">MS</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 md:p-8 p-4 md:pt-8 pt-20 bg-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;
