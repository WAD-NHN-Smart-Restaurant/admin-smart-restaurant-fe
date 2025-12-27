import { Card, CardContent } from "@/components/ui/card";
import { ModifierGroupCard } from "./modifier-group-card";
import { ModifierGroup, ModifierOption } from "@/types/modifier-type";
import { Loader2, Settings } from "lucide-react";

interface ModifierGroupGridProps {
  modifierGroups: ModifierGroup[];
  isLoading: boolean;
  onEditGroup: (group: ModifierGroup) => void;
  onDeleteGroup: (group: ModifierGroup) => void;
  onCreateOption: (group: ModifierGroup) => void;
  onEditOption: (option: ModifierOption, group: ModifierGroup) => void;
  onDeleteOption: (option: ModifierOption, group: ModifierGroup) => void;
  isUpdating: boolean;
}

export function ModifierGroupGrid({
  modifierGroups,
  isLoading,
  onEditGroup,
  onDeleteGroup,
  onCreateOption,
  onEditOption,
  onDeleteOption,
  isUpdating,
}: ModifierGroupGridProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading modifier groups...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modifierGroups.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No modifier groups found
          </h3>
          <p className="text-muted-foreground mb-4">
            No modifier groups match your current filters. Try adjusting your
            search or filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modifier Groups */}
      <div className="space-y-4">
        {modifierGroups.map((group) => (
          <ModifierGroupCard
            key={group.id}
            group={group}
            onEdit={onEditGroup}
            onDelete={onDeleteGroup}
            onCreateOption={onCreateOption}
            onEditOption={onEditOption}
            onDeleteOption={onDeleteOption}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
}
