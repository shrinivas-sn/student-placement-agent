import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile, useSaveUserProfile, useExportData, useImportData } from "@/hooks/use-resources";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Download, Upload, Palette, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
    const { user } = useAuth();
    const { data: profile } = useUserProfile();
    const saveProfile = useSaveUserProfile();
    const exportData = useExportData();
    const importData = useImportData();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile state
    const [name, setName] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [graduationYear, setGraduationYear] = useState("");

    // Settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Load profile data
    useEffect(() => {
        if (profile) {
            setName(profile.name || user?.displayName || "");
            setTargetRole(profile.targetRole || "");
            setGraduationYear(profile.graduationYear || "");
            setNotificationsEnabled(profile.notificationsEnabled || false);
            setTheme(profile.theme || "dark");
        } else if (user) {
            setName(user.displayName || "");
        }
    }, [profile, user]);

    // Apply theme
    useEffect(() => {
        document.documentElement.classList.toggle("light", theme === "light");
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleSaveProfile = async () => {
        try {
            await saveProfile.mutateAsync({
                name: name || user?.displayName || "",
                email: user?.email || "",
                targetRole,
                graduationYear,
                notificationsEnabled,
                theme
            });
            toast({ title: "Success", description: "Profile saved successfully!" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
        }
    };

    const handleExport = async () => {
        try {
            const data = await exportData.mutateAsync();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `placementos-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Success", description: "Data exported successfully!" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to export data", variant: "destructive" });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast({ title: "Error", description: "Please select a file first", variant: "destructive" });
            return;
        }

        try {
            const text = await selectedFile.text();
            const data = JSON.parse(text);
            await importData.mutateAsync(data);
            toast({ title: "Success", description: "Data imported and merged successfully!" });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to import data", variant: "destructive" });
        }
    };

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            toast({ title: "Error", description: "Browser doesn't support notifications", variant: "destructive" });
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setNotificationsEnabled(true);
            toast({ title: "Success", description: "Notifications enabled!" });
        } else {
            setNotificationsEnabled(false);
            toast({ title: "Error", description: "Notification permission denied", variant: "destructive" });
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold font-['Orbitron'] mb-2">Settings</h2>
                    <p className="text-muted-foreground">Manage your account and preferences</p>
                </header>

                <div className="space-y-6 max-w-4xl">
                    {/* Profile Settings */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-cyan-400" />
                                Profile Settings
                            </CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email (from Google)</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-white/5 border-white/10 opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Target Role</Label>
                                <Input
                                    id="role"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g., Software Engineer, Data Analyst"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Graduation Year</Label>
                                <Input
                                    id="year"
                                    value={graduationYear}
                                    onChange={(e) => setGraduationYear(e.target.value)}
                                    placeholder="e.g., 2025"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <Button onClick={handleSaveProfile} className="w-full bg-cyan-500 hover:bg-cyan-600">
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-yellow-400" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>Manage browser notifications (FREE - no external service needed)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="notifications">Enable Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get reminders for interviews and deadlines</p>
                                </div>
                                <Switch
                                    id="notifications"
                                    checked={notificationsEnabled}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            requestNotificationPermission();
                                        } else {
                                            setNotificationsEnabled(false);
                                        }
                                    }}
                                />
                            </div>
                            <Button onClick={handleSaveProfile} className="w-full bg-yellow-500 hover:bg-yellow-600">
                                Save Notification Settings
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Appearance Settings */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5 text-magenta-400" />
                                Appearance
                            </CardTitle>
                            <CardDescription>Customize the look and feel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <Select value={theme} onValueChange={(value: "dark" | "light") => setTheme(value)}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dark">Dark Mode</SelectItem>
                                        <SelectItem value="light">Light Mode</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSaveProfile} className="w-full bg-magenta-500 hover:bg-magenta-600">
                                Save Appearance
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="w-5 h-5 text-green-400" />
                                Data Management
                            </CardTitle>
                            <CardDescription>Export, import, or clear your data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Export Data</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Download all your data as JSON (applications, events, flashcards, etc.)
                                </p>
                                <Button onClick={handleExport} className="w-full bg-green-500 hover:bg-green-600">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All Data
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Import Data</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Upload exported JSON to merge with existing data (won't overwrite duplicates)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {selectedFile ? selectedFile.name : "Choose File"}
                                    </Button>
                                    <Button
                                        onClick={handleImport}
                                        disabled={!selectedFile}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Import
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <Label className="text-red-400">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Clear all data (cannot be undone)
                                </p>
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear All Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
