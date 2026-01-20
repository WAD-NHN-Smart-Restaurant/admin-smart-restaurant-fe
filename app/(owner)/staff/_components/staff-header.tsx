import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StaffHeaderProps {
  onCreateClick: () => void;
}

export function StaffHeader({ onCreateClick }: StaffHeaderProps) {
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="ml-10 lg:ml-0 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage restaurant staff accounts and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
