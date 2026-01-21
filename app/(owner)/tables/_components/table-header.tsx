import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Plus, Users } from "lucide-react";

interface TableHeaderProps {
  onCreateClick: () => void;
  onDownloadAll: (format: "png" | "pdf") => void;
  onBulkAssignClick?: () => void;
}

export function TableHeader({
  onCreateClick,
  onDownloadAll,
  onBulkAssignClick,
}: TableHeaderProps) {
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="ml-10 lg:ml-0 flex flex-col md:flex-row gap-2 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Table Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage restaurant tables and QR codes
            </p>
          </div>
          <div className="flex gap-2">
            {onBulkAssignClick && (
              <Button variant="outline" onClick={onBulkAssignClick}>
                <Users className="mr-2 h-4 w-4" />
                Assign Waiter
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download All QR
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDownloadAll("png")}>
                  Download as PNG (ZIP)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadAll("pdf")}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
