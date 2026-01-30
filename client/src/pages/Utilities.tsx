import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApplications, useCreateApplication, useUpdateApplication, useDeleteApplication } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Utilities() {
  const { data: applications } = useApplications();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const { toast } = useToast();

  const [newApp, setNewApp] = useState({ company: "", position: "", status: "applied", salary: "" });
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!newApp.company || !newApp.position) return;
    await createApplication.mutateAsync(newApp);
    setOpen(false);
    setNewApp({ company: "", position: "", status: "applied", salary: "" });
    toast({ title: "Application Added" });
  };

  const columns = [
    { id: "applied", title: "Applied", color: "border-blue-500/50" },
    { id: "interview", title: "Interview", color: "border-yellow-500/50" },
    { id: "offer", title: "Offer", color: "border-green-500/50" },
    { id: "rejected", title: "Rejected", color: "border-red-500/50" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-blue-400">Application Tracker</h2>
            <p className="text-muted-foreground">Manage your job search pipeline.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2"/> Add Application</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-foreground">
              <DialogHeader>
                <DialogTitle>New Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Company Name" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} />
                <Input placeholder="Position" value={newApp.position} onChange={e => setNewApp({...newApp, position: e.target.value})} />
                <Input placeholder="Expected Salary (Optional)" value={newApp.salary} onChange={e => setNewApp({...newApp, salary: e.target.value})} />
                <Select value={newApp.status} onValueChange={v => setNewApp({...newApp, status: v})}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSubmit} className="w-full bg-blue-600">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col.id} className={`flex flex-col bg-white/5 rounded-xl border-t-4 ${col.color} h-full p-4`}>
              <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-muted-foreground">{col.title}</h3>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {applications?.filter(app => app.status === col.id).map(app => (
                  <Card key={app.id} className="bg-card hover:bg-white/10 cursor-pointer transition-colors border-white/5">
                    <CardContent className="p-4 relative group">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteApplication.mutate(app.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <h4 className="font-bold">{app.company}</h4>
                      <p className="text-sm text-blue-400">{app.position}</p>
                      {app.salary && <p className="text-xs text-muted-foreground mt-2">{app.salary}</p>}
                    </CardContent>
                  </Card>
                ))}
                {applications?.filter(app => app.status === col.id).length === 0 && (
                   <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-white/5 rounded-lg">
                      No items
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
