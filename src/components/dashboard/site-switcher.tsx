"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, ChevronsUpDown, Building2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SiteSwitcher() {
  const { data: session, update } = useSession();
  const [open, setOpen] = useState(false);

  const sites = session?.user?.siteAccess || [];
  const currentSiteId = session?.user?.currentSiteId;
  const currentSite = sites.find((s) => s.siteId === currentSiteId);

  const handleSiteChange = async (siteId: string) => {
    // Update the session with the new current site
    await update({
      ...session,
      user: {
        ...session?.user,
        currentSiteId: siteId,
      },
    });
    setOpen(false);
    // Refresh the page to load data for the new site
    window.location.reload();
  };

  if (sites.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {currentSite?.siteName || "Select Site"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search site..." />
          <CommandList>
            <CommandEmpty>No site found.</CommandEmpty>
            <CommandGroup heading="Your Sites">
              {sites.map((site) => (
                <CommandItem
                  key={site.siteId}
                  value={site.siteId}
                  onSelect={() => handleSiteChange(site.siteId)}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="truncate">{site.siteName}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentSiteId === site.siteId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
