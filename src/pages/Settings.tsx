
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences.
          </p>
        </div>
        <SidebarTrigger />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@communitybank.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Financial Institution</Label>
                <Input id="institution" defaultValue="Community First Bank" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="doc-upload" className="block">Document Uploads</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when new documents are uploaded
                </p>
              </div>
              <Switch id="doc-upload" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="insights" className="block">New Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when new insights are identified
                </p>
              </div>
              <Switch id="insights" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status" className="block">Status Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when loan status changes
                </p>
              </div>
              <Switch id="status" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif" className="block">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send all notifications to email
                </p>
              </div>
              <Switch id="email-notif" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
