"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  Plus,
  Layers,
  Users,
  ChevronRight,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const siteData = {
  id: "1",
  name: "Main Office",
  code: "SITE001",
  company: "Demo Company",
  address: "123 Business Park, Tech City",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  pincode: "400001",
  phone: "+91 9876543210",
  email: "mainoffice@demo.com",
  status: "active",
  buildings: [
    {
      id: "b1",
      name: "Building A",
      code: "BLDG-A",
      floors: [
        {
          id: "f1",
          name: "Ground Floor",
          code: "GF",
          zones: [
            {
              id: "z1",
              name: "Lobby Area",
              code: "LOBBY",
              areas: [
                { id: "a1", name: "Main Lobby", type: "Reception", sqft: 500 },
                { id: "a2", name: "Waiting Area", type: "Common Area", sqft: 200 },
              ],
            },
            {
              id: "z2",
              name: "Office Zone",
              code: "OFFICE",
              areas: [
                { id: "a3", name: "Open Office", type: "Office Space", sqft: 2000 },
              ],
            },
          ],
        },
        {
          id: "f2",
          name: "First Floor",
          code: "1F",
          zones: [
            {
              id: "z3",
              name: "Conference Zone",
              code: "CONF",
              areas: [
                { id: "a4", name: "Conference Room A", type: "Conference Room", sqft: 300 },
                { id: "a5", name: "Conference Room B", type: "Conference Room", sqft: 200 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "b2",
      name: "Building B",
      code: "BLDG-B",
      floors: [
        {
          id: "f3",
          name: "Ground Floor",
          code: "GF",
          zones: [
            {
              id: "z4",
              name: "Cafeteria",
              code: "CAFE",
              areas: [
                { id: "a6", name: "Main Cafeteria", type: "Pantry", sqft: 800 },
              ],
            },
          ],
        },
      ],
    },
  ],
  stats: {
    totalBuildings: 2,
    totalFloors: 3,
    totalAreas: 6,
    totalEmployees: 156,
    totalSqft: 4000,
  },
};

function BuildingTree({ building }: { building: typeof siteData.buildings[0] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{building.name}</p>
                <p className="text-xs text-muted-foreground">{building.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{building.floors.length} floors</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Building
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Floor
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="p-4 space-y-3">
            {building.floors.map((floor) => (
              <FloorTree key={floor.id} floor={floor} />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function FloorTree({ floor }: { floor: typeof siteData.buildings[0]["floors"][0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg ml-6">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              <Layers className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium text-sm">{floor.name}</p>
                <p className="text-xs text-muted-foreground">{floor.code}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {floor.zones.reduce((acc, z) => acc + z.areas.length, 0)} areas
            </Badge>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="p-3 space-y-2">
            {floor.zones.map((zone) => (
              <div key={zone.id} className="ml-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{zone.name}</span>
                  <span className="text-xs text-muted-foreground">({zone.code})</span>
                </div>
                <div className="grid gap-2 ml-4">
                  {zone.areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
                    >
                      <span>{area.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {area.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {area.sqft} sqft
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default function SiteDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sites">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {siteData.name}
              </h1>
              <Badge variant="success">{siteData.status}</Badge>
            </div>
            <p className="text-muted-foreground">{siteData.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/sites/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Site
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Buildings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{siteData.stats.totalBuildings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Floors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{siteData.stats.totalFloors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{siteData.stats.totalAreas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{siteData.stats.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{siteData.stats.totalSqft.toLocaleString()} sqft</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList>
          <TabsTrigger value="structure">Site Structure</TabsTrigger>
          <TabsTrigger value="details">Site Details</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          {siteData.buildings.map((building) => (
            <BuildingTree key={building.id} building={building} />
          ))}
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{siteData.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Site Code</p>
                  <p className="font-medium">{siteData.code}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Address</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p>{siteData.address}</p>
                    <p>{siteData.city}, {siteData.state} - {siteData.pincode}</p>
                    <p>{siteData.country}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{siteData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{siteData.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees at this Site</CardTitle>
              <CardDescription>
                {siteData.stats.totalEmployees} employees assigned to this site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href={`/employees?site=${params.id}`}>
                  <Users className="mr-2 h-4 w-4" />
                  View All Employees
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
