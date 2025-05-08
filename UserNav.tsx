
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

export function UserNav() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-invoice-lightPurple p-1">
          <User className="h-5 w-5 text-invoice-purple" />
        </div>
        <div>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        className="border-invoice-purple text-invoice-purple hover:bg-invoice-lightPurple hover:text-invoice-darkPurple"
      >
        Sign out
      </Button>
    </div>
  );
}
