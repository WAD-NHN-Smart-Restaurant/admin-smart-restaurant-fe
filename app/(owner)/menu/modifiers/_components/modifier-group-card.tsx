import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Plus, Settings, Tag } from "lucide-react";
import {
  ModifierGroup,
  ModifierOption,
  ModifierSelectionType,
} from "@/types/modifier-type";

interface ModifierGroupCardProps {
  group: ModifierGroup;
  onEdit: (group: ModifierGroup) => void;
  onDelete: (group: ModifierGroup) => void;
  onCreateOption: (group: ModifierGroup) => void;
  onEditOption: (option: ModifierOption, group: ModifierGroup) => void;
  onDeleteOption: (option: ModifierOption, group: ModifierGroup) => void;
  isUpdating: boolean;
}

export function ModifierGroupCard({
  group,
  onEdit,
  onDelete,
  onCreateOption,
  onEditOption,
  onDeleteOption,
  isUpdating,
}: ModifierGroupCardProps) {
  const getSelectionTypeDisplay = (type: ModifierSelectionType) => {
    return type === ModifierSelectionType.SINGLE
      ? "Single Selection"
      : "Multiple Selection";
  };

  const getSelectionRangeDisplay = () => {
    if (group.selectionType === ModifierSelectionType.SINGLE) {
      return group.isRequired ? "Required (1)" : "Optional (0-1)";
    }
    return `${group.minSelections}-${group.maxSelections} selections`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return price > 0
      ? `+$${price.toFixed(2)}`
      : `-$${Math.abs(price).toFixed(2)}`;
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <Badge
                variant={group.status === "active" ? "default" : "secondary"}
              >
                {group.status.toLowerCase()}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                {getSelectionTypeDisplay(group.selectionType)}
              </div>
              <span>•</span>
              <span>{getSelectionRangeDisplay()}</span>
              <span>•</span>
              <span>Order: {group.displayOrder}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(group)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Group
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(group)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Options Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="font-medium">
                Options ({group.modifierOptions.length})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateOption(group)}
              className="gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Option
            </Button>
          </div>

          {group.modifierOptions.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No modifierOptions added yet
            </div>
          ) : (
            <div className="space-y-2">
              {group.modifierOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.name}</span>
                      <Badge
                        variant={
                          option.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {option.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(option.priceAdjustment)}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={isUpdating}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEditOption(option, group)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit Option
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeleteOption(option, group)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete Option
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
