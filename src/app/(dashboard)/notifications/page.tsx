"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Settings, AlertCircle, Info, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const notifications = [
  { id: "1", type: "alert", title: "SLA Breach Warning", message: "Ticket #TKT-2024-089 is about to breach SLA in 2 hours", time: "10 minutes ago", read: false },
  { id: "2", type: "info", title: "New Work Order Assigned", message: "Work Order #WO-2024-015 has been assigned to you", time: "30 minutes ago", read: false },
  { id: "3", type: "success", title: "Inspection Completed", message: "Daily inspection for Main Lobby scored 95%", time: "1 hour ago", read: false },
  { id: "4", type: "warning", title: "AMC Expiring Soon", message: "Fire Safety Equipment AMC expires in 15 days", time: "2 hours ago", read: true },
  { id: "5", type: "info", title: "Leave Request Approved", message: "Your leave request for Jan 20-21 has been approved", time: "3 hours ago", read: true },
  { id: "6", type: "alert", title: "Critical Incident Reported", message: "New incident reported at Floor 2 - Chemical Spill", time: "4 hours ago", read: true },
  { id: "7", type: "success", title: "Training Completed", message: "Safety Induction Training marked as complete", time: "Yesterday", read: true },
  { id: "8", type: "info", title: "New Document Uploaded", message: "Employee Handbook 2024 has been uploaded", time: "Yesterday", read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "alert": return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const markAsRead = (id: string) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
    toast({ title: "Notification deleted" });
  };

  const clearAll = () => {
    setNotificationList([]);
    toast({ title: "All notifications cleared" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={clearAll} disabled={notificationList.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{notificationList.length}</p></div><Bell className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Unread</p><p className="text-2xl font-bold text-blue-600">{unreadCount}</p></div><Badge>{unreadCount}</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Alerts</p><p className="text-2xl font-bold text-red-600">{notificationList.filter(n => n.type === "alert").length}</p></div><AlertCircle className="h-8 w-8 text-red-600" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Warnings</p><p className="text-2xl font-bold text-yellow-600">{notificationList.filter(n => n.type === "warning").length}</p></div><AlertTriangle className="h-8 w-8 text-yellow-600" /></div></CardContent></Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {notificationList.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No notifications</p></CardContent></Card>
          ) : (
            notificationList.map((notification) => (
              <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-primary" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-2">
          {notificationList.filter(n => !n.read).map((notification) => (
            <Card key={notification.id} className="border-l-4 border-l-primary">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}><CheckCheck className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-2">
          {notificationList.filter(n => n.type === "alert").map((notification) => (
            <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-red-500" : ""}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
