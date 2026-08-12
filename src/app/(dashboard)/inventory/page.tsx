"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const inventoryItems = [
  {
    id: "1",
    name: "Floor Cleaner",
    code: "CLN-001",
    category: "Cleaning Supplies",
    unit: "Ltr",
    currentStock: 25,
    minStock: 20,
    maxStock: 100,
    unitPrice: 150,
    status: "normal",
  },
  {
    id: "2",
    name: "Toilet Cleaner",
    code: "CLN-002",
    category: "Cleaning Supplies",
    unit: "Ltr",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 120,
    status: "low",
  },
  {
    id: "3",
    name: "Garbage Bags (Large)",
    code: "CNS-001",
    category: "Consumables",
    unit: "Pcs",
    currentStock: 200,
    minStock: 100,
    maxStock: 500,
    unitPrice: 5,
    status: "normal",
  },
  {
    id: "4",
    name: "Safety Gloves",
    code: "PPE-001",
    category: "PPE",
    unit: "Pairs",
    currentStock: 5,
    minStock: 20,
    maxStock: 100,
    unitPrice: 80,
    status: "critical",
  },
  {
    id: "5",
    name: "Hand Sanitizer",
    code: "CNS-002",
    category: "Consumables",
    unit: "Ltr",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 200,
    status: "normal",
  },
];

const stockStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  normal: { label: "Normal", variant: "success" },
  low: { label: "Low Stock", variant: "warning" },
  critical: { label: "Critical", variant: "destructive" },
  excess: { label: "Excess", variant: "secondary" },
};

const recentTransactions = [
  { id: "1", item: "Floor Cleaner", type: "in", qty: 50, date: "2024-01-15", by: "Store Manager" },
  { id: "2", item: "Safety Gloves", type: "out", qty: 10, date: "2024-01-14", by: "Supervisor" },
  { id: "3", item: "Toilet Cleaner", type: "out", qty: 15, date: "2024-01-14", by: "Team Lead" },
  { id: "4", item: "Garbage Bags", type: "in", qty: 200, date: "2024-01-13", by: "Store Manager" },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const stats = {
    totalItems: 156,
    lowStock: 12,
    totalValue: 245000,
    pendingIndents: 5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage stock and materials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDown className="mr-2 h-4 w-4" />
            Stock In
          </Button>
          <Button variant="outline">
            <ArrowUp className="mr-2 h-4 w-4" />
            Stock Out
          </Button>
          <Button asChild>
            <Link href="/inventory/items/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">Rs. {stats.totalValue.toLocaleString()}</p>
              </div>
              <span className="text-2xl">Rs.</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Indents</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingIndents}</p>
              </div>
              <Badge variant="warning" className="h-8 px-3">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Stock Items</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="indents">Material Indents</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
                <SelectItem value="ppe">PPE</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Items Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => {
                    const stockPercentage = Math.min(
                      (item.currentStock / item.maxStock) * 100,
                      100
                    );
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <div className="w-[150px] space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{item.currentStock} / {item.maxStock}</span>
                              <span className="text-muted-foreground">
                                Min: {item.minStock}
                              </span>
                            </div>
                            <Progress
                              value={stockPercentage}
                              className={`h-2 ${
                                item.status === "critical"
                                  ? "[&>div]:bg-red-500"
                                  : item.status === "low"
                                  ? "[&>div]:bg-yellow-500"
                                  : ""
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          Rs. {item.unitPrice}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatusConfig[item.status].variant}>
                            {stockStatusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ArrowDown className="mr-2 h-4 w-4" />
                                Stock In
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUp className="mr-2 h-4 w-4" />
                                Stock Out
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.item}</TableCell>
                      <TableCell>
                        <Badge
                          variant={txn.type === "in" ? "success" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {txn.type === "in" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUp className="h-3 w-3" />
                          )}
                          {txn.type === "in" ? "Stock In" : "Stock Out"}
                        </Badge>
                      </TableCell>
                      <TableCell>{txn.qty}</TableCell>
                      <TableCell>{txn.by}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Material Indents</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Indent
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Material indent requests will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
