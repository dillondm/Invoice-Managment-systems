
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StatsRow from "@/components/dashboard/StatsRow";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { Invoice } from "@/components/dashboard/RecentInvoices";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        if (data) {
          // Format the invoices to match the expected Invoice type
          const formattedInvoices = data.map(invoice => ({
            id: invoice.invoice_number,
            client: invoice.client_name,
            amount: Number(invoice.total),
            date: new Date(invoice.issue_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }),
            dueDate: new Date(invoice.due_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }),
            status: invoice.status as "paid" | "pending" | "overdue" | "draft"
          }));
          setInvoices(formattedInvoices);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast({
          title: "Error",
          description: "Failed to fetch invoices. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInvoices();
    }
  }, [user, toast]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your invoice activities</p>
        </div>
        <Link to="/invoice/new">
          <Button className="bg-invoice-purple hover:bg-invoice-darkPurple">
            New Invoice
          </Button>
        </Link>
      </div>

      <StatsRow userId={user?.id} />
      
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-invoice-purple"></div>
          </div>
        ) : invoices.length > 0 ? (
          <RecentInvoices invoices={invoices} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button 
              onClick={() => navigate('/invoice/new')}
              className="bg-invoice-purple hover:bg-invoice-darkPurple"
            >
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
