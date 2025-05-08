
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 text-invoice-purple">MS</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create, send, and track invoices with ease. Automate reminders and manage clients all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button 
              className="bg-invoice-purple hover:bg-invoice-darkPurple"
              onClick={() => navigate('/dashboard')}
              size="lg"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              className="bg-invoice-purple hover:bg-invoice-darkPurple"
              onClick={() => navigate('/auth')}
              size="lg"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
