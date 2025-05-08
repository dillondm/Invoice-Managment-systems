
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Edit, Trash, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const InvoiceDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"paid" | "pending" | "overdue" | "draft">("pending");

  // Mock invoice data - in a real app, you'd fetch this based on the id
  const invoice = {
    id: id || "INV-001",
    client: {
      name: "Acme Corporation",
      email: "billing@acmecorp.com",
      address: "123 Main St, Suite 101\nAnytown, CA 12345",
    },
    issueDate: "May 3, 2023",
    dueDate: "May 17, 2023",
    status: status,
    amount: 3400.00,
    items: [
      { id: 1, description: "Website Design", quantity: 1, price: 2500.00 },
      { id: 2, description: "Hosting (Annual)", quantity: 1, price: 600.00 },
      { id: 3, description: "Domain Registration", quantity: 2, price: 150.00 },
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((total, item) => total + calculateItemTotal(item.quantity, item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleMarkAsPaid = () => {
    setStatus("paid");
    toast({
      title: "Invoice marked as paid",
      description: `Invoice #${invoice.id} has been marked as paid.`,
    });
  };

  const handleSendInvoice = () => {
    toast({
      title: "Invoice sent",
      description: `Invoice #${invoice.id} has been sent to ${invoice.client.email}.`,
    });
  };

  const renderStatus = (status: string) => {
    return <span className={`status-badge ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/invoices" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice #{invoice.id}</h1>
          <div className="flex items-center gap-3 mt-2">
            {renderStatus(invoice.status)}
            <span className="text-muted-foreground">
              <Calendar className="h-4 w-4 inline mr-1" />
              Due {invoice.dueDate}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          {invoice.status === "draft" && (
            <Button onClick={handleSendInvoice} className="gap-2 bg-invoice-purple hover:bg-invoice-darkPurple">
              <Send className="h-4 w-4" />
              Send
            </Button>
          )}
          
          {invoice.status === "pending" && (
            <Button onClick={handleMarkAsPaid} className="gap-2 bg-green-600 hover:bg-green-700">
              Mark as Paid
            </Button>
          )}
          
          <Button variant="destructive" className="gap-2">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Billed To</h3>
                  <p className="text-lg font-medium">{invoice.client.name}</p>
                  <p className="text-muted-foreground whitespace-pre-line">{invoice.client.address}</p>
                  <p className="text-muted-foreground">{invoice.client.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Invoice Info</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span>#{invoice.id}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span>{invoice.issueDate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead className="border-b text-left">
                  <tr>
                    <th className="py-3 font-medium">Description</th>
                    <th className="py-3 font-medium text-right">Qty</th>
                    <th className="py-3 font-medium text-right">Unit Price</th>
                    <th className="py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4">{item.description}</td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-4 text-right">{formatCurrency(calculateItemTotal(item.quantity, item.price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 ml-auto w-full md:w-1/2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <p>{renderStatus(invoice.status)}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount Due</h3>
                <p className="text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Timeline</h3>
                
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-invoice-purple mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Invoice Created</p>
                    <p className="text-sm text-muted-foreground">{invoice.issueDate}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Invoice Sent</p>
                    <p className="text-sm text-muted-foreground">{invoice.issueDate}</p>
                  </div>
                </div>

                {invoice.status === "paid" && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Payment Received</p>
                      <p className="text-sm text-muted-foreground">May 10, 2023</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDetail;
