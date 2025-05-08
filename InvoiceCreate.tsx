
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const InvoiceCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [client, setClient] = useState({
    name: "",
    email: "",
    address: ""
  });
  
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, price: 0 }
  ]);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value
    });
  };

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    setItems([...items, { id: newId, description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item.quantity, item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!client.name || !issueDate || !dueDate || items.some(item => !item.description)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you'd save this data
    toast({
      title: "Invoice created",
      description: "Your invoice has been saved as a draft."
    });
    
    // Redirect to the invoices list
    navigate("/invoices");
  };

  const handleSaveAndSend = () => {
    // Similar validation as handleSubmit
    if (!client.name || !issueDate || !dueDate || items.some(item => !item.description)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invoice sent",
      description: `The invoice has been sent to ${client.email || "the client"}.`
    });
    
    navigate("/invoices");
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
        <h1 className="text-3xl font-bold">Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Client Information</h2>
            
            <div>
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                name="name"
                value={client.name}
                onChange={handleClientChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="client-email">Client Email</Label>
              <Input
                id="client-email"
                name="email"
                type="email"
                value={client.email}
                onChange={handleClientChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client-address">Client Address</Label>
              <textarea
                id="client-address"
                name="address"
                value={client.address}
                onChange={handleClientChange}
                className="w-full min-h-[100px] border rounded p-2 mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Invoice Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                value="INV-009"
                className="mt-1"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Items</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Description</th>
                  <th className="text-right py-3 font-medium w-24">Quantity</th>
                  <th className="text-right py-3 font-medium w-32">Price</th>
                  <th className="text-right py-3 font-medium w-32">Total</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </td>
                    <td className="py-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                        className="text-right"
                        required
                      />
                    </td>
                    <td className="py-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, "price", parseFloat(e.target.value) || 0)}
                        className="text-right"
                        required
                      />
                    </td>
                    <td className="py-3 text-right">
                      {formatCurrency(calculateItemTotal(item.quantity, item.price))}
                    </td>
                    <td className="py-3 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="mt-4 flex items-center gap-2"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        <div className="mt-8 ml-auto w-full md:w-1/2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="submit" variant="outline">
              Save as Draft
            </Button>
            <Button 
              type="button" 
              className="bg-invoice-purple hover:bg-invoice-darkPurple"
              onClick={handleSaveAndSend}
            >
              Save & Send
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default InvoiceCreate;
