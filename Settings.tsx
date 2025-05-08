
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated."
    });
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Company details updated",
      description: "Your company details have been updated."
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="bg-white rounded-lg shadow-sm border">
        <TabsList className="border-b w-full rounded-none p-0 h-auto">
          <div className="container px-6">
            <div className="flex overflow-x-auto">
              <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-invoice-purple">
                Profile
              </TabsTrigger>
              <TabsTrigger value="company" className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-invoice-purple">
                Company Details
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-invoice-purple">
                Notifications
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        
        <TabsContent value="profile" className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-invoice-purple text-white flex items-center justify-center text-2xl font-semibold">
                  U
                </div>
                <div>
                  <Button type="button" variant="outline">Change Photo</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="User Name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="America/New_York" className="mt-1" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Change Password</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="mt-1" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-invoice-purple hover:bg-invoice-darkPurple">
                Save Changes
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="company" className="p-6">
          <form onSubmit={handleSaveCompany} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Business Information</h2>
              
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Invoice Zenith, LLC" className="mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-email">Business Email</Label>
                  <Input id="business-email" type="email" defaultValue="hello@invoicezenith.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="business-phone">Business Phone</Label>
                  <Input id="business-phone" defaultValue="+1 (555) 987-6543" className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <textarea 
                  id="business-address" 
                  className="w-full min-h-[100px] border rounded p-2 mt-1"
                  defaultValue="123 Business Avenue, Suite 101&#10;San Francisco, CA 94107"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                  <Input id="tax-id" defaultValue="US-123456789" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input id="currency" defaultValue="USD ($)" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="10" className="mt-1" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Payment Information</h2>
              
              <div>
                <Label htmlFor="payment-methods">Accepted Payment Methods</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="bank-transfer" defaultChecked />
                    <label htmlFor="bank-transfer">Bank Transfer</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="credit-card" defaultChecked />
                    <label htmlFor="credit-card">Credit Card</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="paypal" defaultChecked />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="other" />
                    <label htmlFor="other">Other</label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="payment-instructions">Payment Instructions (shown on invoice)</Label>
                <textarea 
                  id="payment-instructions" 
                  className="w-full min-h-[100px] border rounded p-2 mt-1"
                  defaultValue="Please make payment within 14 days of receipt.&#10;Bank transfers should include the invoice number as a reference."
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-invoice-purple hover:bg-invoice-darkPurple">
                Save Changes
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="notifications" className="p-6">
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Email Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invoice Payment Received</p>
                    <p className="text-sm text-muted-foreground">Get notified when a client pays an invoice</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invoice Payment Reminder</p>
                    <p className="text-sm text-muted-foreground">Send reminders to clients for upcoming or overdue payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Comment</p>
                    <p className="text-sm text-muted-foreground">Receive notifications when clients comment on invoices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly Summary</p>
                    <p className="text-sm text-muted-foreground">Monthly report of your invoice activity</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Client Reminders</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder-days-before">Days before due date to send reminder</Label>
                  <Input id="reminder-days-before" type="number" defaultValue="3" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="reminder-days-after">Days after due date to send reminder</Label>
                  <Input id="reminder-days-after" type="number" defaultValue="1" className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-reminders" defaultChecked />
                <Label htmlFor="auto-reminders">Enable automatic payment reminders</Label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-invoice-purple hover:bg-invoice-darkPurple">
                Save Changes
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Settings;
