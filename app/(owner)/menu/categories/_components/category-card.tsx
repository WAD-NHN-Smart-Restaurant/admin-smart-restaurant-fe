import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";
import { Category, CategoryStatus } from "@/types/category-type";
import { format } from "date-fns";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  isStatusUpdating: boolean;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
  isStatusUpdating,
}: CategoryCardProps) {
  const isActive = category.status === CategoryStatus.ACTIVE;

  return (
    <Card
      className={`h-full transition-all hover:shadow-md ${
        !isActive ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {category.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Order #{category.displayOrder}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(category)}
                disabled={isStatusUpdating}
              >
                {isActive ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(category)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {category.description && (
          <CardDescription className="text-sm text-muted-foreground">
            {category.description}
          </CardDescription>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{category.itemCount} items</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-xs text-muted-foreground border-t">
          Created {format(new Date(category.createdAt), "MMM dd, yyyy")}
        </div>
      </CardContent>
    </Card>
  );
}
