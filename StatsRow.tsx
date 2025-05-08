
import React, { useEffect, useState } from "react";
import { DataCard } from "../ui/data-card";
import { DollarSign, FileText, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatsRowProps {
  userId?: string;
}

const StatsRow = ({ userId }: StatsRowProps) => {
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    invoicesSent: 0,
    overdue: 0,
    paidThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Get all invoices for the user
        const { data: invoices, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", userId);
          
        if (error) {
          throw error;
        }

        if (invoices) {
          // Current date and start of month
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          // Calculate stats
          let totalOutstanding = 0;
          let invoicesSent = 0;
          let overdue = 0;
          let paidThisMonth = 0;
          
          invoices.forEach(invoice => {
            // Count total invoices
            invoicesSent++;
            
            // Calculate totals based on status
            if (invoice.status === 'pending') {
              totalOutstanding += Number(invoice.total);
            } else if (invoice.status === 'overdue') {
              overdue += Number(invoice.total);
            } else if (invoice.status === 'paid') {
              const paidDate = new Date(invoice.updated_at);
              if (paidDate >= startOfMonth) {
                paidThisMonth += Number(invoice.total);
              }
            }
          });
          
          setStats({
            totalOutstanding,
            invoicesSent,
            overdue,
            paidThisMonth
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DataCard
        title="Total Outstanding"
        value={formatCurrency(stats.totalOutstanding)}
        icon={<DollarSign />}
        trend={stats.totalOutstanding > 0 ? { value: 0, isPositive: true } : undefined}
      />
      <DataCard
        title="Invoices Sent"
        value={stats.invoicesSent.toString()}
        icon={<FileText />}
        trend={stats.invoicesSent > 0 ? { value: 0, isPositive: true } : undefined}
      />
      <DataCard
        title="Overdue"
        value={formatCurrency(stats.overdue)}
        icon={<Clock />}
        trend={stats.overdue > 0 ? { value: 0, isPositive: false } : undefined}
      />
      <DataCard
        title="Paid This Month"
        value={formatCurrency(stats.paidThisMonth)}
        icon={<CheckCircle />}
        trend={stats.paidThisMonth > 0 ? { value: 0, isPositive: true } : undefined}
      />
    </div>
  );
};

export default StatsRow;
