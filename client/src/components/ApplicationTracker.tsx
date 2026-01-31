import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Briefcase } from "lucide-react";
import { useApplications, useCreateApplication, useUpdateApplication, useDeleteApplication } from "@/hooks/use-resources";
import { useToast } from "@/hooks/use-toast";

export function ApplicationTracker() {
    const { data: applications = [] } = useApplications();
    const createApp = useCreateApplication();
    const updateApp = useUpdateApplication();
    const deleteApp = useDeleteApplication();
    const { toast } = useToast();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        status: "applied" as "applied" | "interview" | "offer" | "rejected",
        salary: "",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.company || !formData.position) {
            toast({ title: "Error", description: "Company and Position are required", variant: "destructive" });
            return;
        }

        try {
            if (editingId) {
                await updateApp.mutateAsync({ id: editingId, ...formData });
                toast({ title: "Success", description: "Application updated!" });
            } else {
                await createApp.mutateAsync(formData);
                toast({ title: "Success", description: "Application added!" });
            }

            setIsOpen(false);
            resetForm();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save application", variant: "destructive" });
        }
    };

    const handleEdit = (app: any) => {
        setEditingId(app.id);
        setFormData({
            company: app.company,
            position: app.position,
            status: app.status,
            salary: app.salary || "",
            notes: app.notes || ""
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this application?")) {
            try {
                await deleteApp.mutateAsync(id);
                toast({ title: "Success", description: "Application deleted" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
            }
        }
    };

    const resetForm = () => {
        setFormData({ company: "", position: "", status: "applied", salary: "", notes: "" });
        setEditingId(null);
    };

    const statusColors = {
        applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        interview: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        offer: "bg-green-500/20 text-green-400 border-green-500/30",
        rejected: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                    Application Tracker
                </h2>
                <Button onClick={() => { resetForm(); setIsOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                </Button>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                    <Card key={app.id} className="glass-card hover:border-purple-500/50 transition-all">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{app.company}</CardTitle>
                                    <p className="text-sm text-gray-400 mt-1">{app.position}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(app)} className="h-8 w-8">
                                        <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(app.id)} className="h-8 w-8 text-red-400">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium border inline-block ${statusColors[app.status]}`}>
                                {app.status.toUpperCase()}
                            </div>
                            {app.salary && (
                                <p className="text-sm text-gray-300">💰 {app.salary}</p>
                            )}
                            {app.notes && (
                                <p className="text-xs text-gray-500 line-clamp-2">{app.notes}</p>
                            )}
                            <p className="text-xs text-gray-600">
                                Applied: {app.dateApplied?.toDate ? app.dateApplied.toDate().toLocaleDateString() : 'N/A'}
                            </p>
                        </CardContent>
                    </Card>
                ))}

                {applications.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No applications yet. Click "Add Application" to get started!</p>
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="bg-black/95 border-white/10">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Application" : "Add New Application"}</DialogTitle>
                        <DialogDescription>
                            Track your job applications by adding company details, status, and notes.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Company *</label>
                            <Input
                                placeholder="e.g., Google"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Position *</label>
                            <Input
                                placeholder="e.g., Software Engineer"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="applied">Applied</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="offer">Offer</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Salary (Optional)</label>
                            <Input
                                placeholder="e.g., $120k - $150k"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                            <Textarea
                                placeholder="Add any notes..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="bg-white/5 border-white/10 min-h-[80px]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={createApp.isPending || updateApp.isPending}>
                                {editingId ? "Update" : "Add"} Application
                            </Button>
                            <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
