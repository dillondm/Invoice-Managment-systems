
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Invoice } from "@/components/dashboard/RecentInvoices";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const InvoiceList = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user.id);

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

    fetchInvoices();
  }, [user, toast]);

  const filteredInvoices = invoices
    .filter(invoice => filter === "all" || invoice.status === filter)
    .filter(invoice => 
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderStatus = (status: Invoice["status"]) => {
    return <span className={`status-badge ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
        </div>
        <Link to="/invoice/new">
          <Button className="bg-invoice-purple hover:bg-invoice-darkPurple">
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoices</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-invoice-purple mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading invoices...</p>
          </div>
        ) : (
          <>
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Link to={`/invoice/${invoice.id}`} className="text-invoice-purple hover:underline">
                            #{invoice.id}
                          </Link>
                        </TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{renderStatus(invoice.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No invoices found</p>
                <Link to="/invoice/new" className="mt-4 inline-block">
                  <Button className="bg-invoice-purple hover:bg-invoice-darkPurple">
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceList;
