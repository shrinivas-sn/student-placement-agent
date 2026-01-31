import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Trash2, Plus } from "lucide-react";
import { useEvents, useCreateEvent, useDeleteEvent } from "@/hooks/use-resources";
import { useToast } from "@/hooks/use-toast";
import { Timestamp } from "firebase/firestore";

interface CalendarModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
    const { data: events = [] } = useEvents();
    const createEvent = useCreateEvent();
    const deleteEvent = useDeleteEvent();
    const { toast } = useToast();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !date || !time) {
            toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }

        try {
            // Parse DD/MM/YYYY format to YYYY-MM-DD
            let isoDate = date;
            if (date.includes('/')) {
                const [day, month, year] = date.split('/');
                isoDate = `${year}-${month}-${day}`;
            }

            const dateTime = new Date(`${isoDate}T${time}`);
            await createEvent.mutateAsync({
                title,
                date: Timestamp.fromDate(dateTime),
                notes
            });

            toast({ title: "Success", description: "Event scheduled!" });
            setTitle("");
            setDate("");
            setTime("");
            setNotes("");
        } catch (error) {
            toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
        }
    };

    const handleDelete = async (eventId: string) => {
        try {
            await deleteEvent.mutateAsync(eventId);
            toast({ title: "Success", description: "Event deleted" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
        }
    };

    // Get upcoming events (future only)
    const upcomingEvents = events
        .filter(event => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
            return eventDate > new Date();
        })
        .sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-purple-400" />
                        Schedule Event
                    </DialogTitle>
                    <DialogDescription>
                        Schedule interviews, deadlines, and important events. Your upcoming events will appear on the dashboard.
                    </DialogDescription>
                </DialogHeader>

                {/* Add Event Form */}
                <form onSubmit={handleSubmit} className="space-y-6 border-b border-white/10 pb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Event Title *</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Google Interview - Round 2"
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Date * (DD/MM/YYYY)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="DD/MM/YYYY"
                                    className="bg-white/5 border-white/10 flex-1"
                                    required
                                />
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('date-picker-hidden') as HTMLInputElement;
                                            if (input) {
                                                input.showPicker?.();
                                            }
                                        }}
                                        className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-md transition-colors"
                                        title="Select Date from Calendar"
                                    >
                                        <Calendar className="w-5 h-5 text-cyan-400" />
                                    </button>
                                    <input
                                        id="date-picker-hidden"
                                        type="date"
                                        onChange={(e) => {
                                            // Convert YYYY-MM-DD to DD/MM/YYYY
                                            const [year, month, day] = e.target.value.split('-');
                                            setDate(`${day}/${month}/${year}`);
                                        }}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        style={{ pointerEvents: 'none' }}
                                        aria-label="Select date"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Time * (HH:MM)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    placeholder="HH:MM"
                                    className="bg-white/5 border-white/10 flex-1"
                                    required
                                />
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('time-picker-hidden') as HTMLInputElement;
                                            if (input) {
                                                input.showPicker?.();
                                            }
                                        }}
                                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-md transition-colors"
                                        title="Select Time from Clock"
                                    >
                                        <Clock className="w-5 h-5 text-purple-400" />
                                    </button>
                                    <input
                                        id="time-picker-hidden"
                                        type="time"
                                        onChange={(e) => setTime(e.target.value)}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        style={{ pointerEvents: 'none' }}
                                        aria-label="Select time"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Notes (Optional)</label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional details..."
                            className="bg-white/5 border-white/10 min-h-[100px]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={createEvent.isPending}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {createEvent.isPending ? "Scheduling..." : "Schedule Event"}
                    </Button>
                </form>

                {/* Upcoming Events List */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Events ({upcomingEvents.length})
                    </h3>

                    {upcomingEvents.length === 0 ? (
                        <p className="text-gray-400 text-sm italic py-4 text-center">
                            No upcoming events scheduled
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {upcomingEvents.map((event) => {
                                const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
                                const isToday = eventDate.toDateString() === new Date().toDateString();
                                const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

                                return (
                                    <div
                                        key={event.id}
                                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {isToday ? "Today" : isTomorrow ? "Tomorrow" : eventDate.toLocaleDateString()}
                                                    </span>
                                                    <Clock className="w-3 h-3 ml-2" />
                                                    <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                {event.notes && (
                                                    <p className="text-sm text-gray-500 mt-2">{event.notes}</p>
                                                )}
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDelete(event.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
