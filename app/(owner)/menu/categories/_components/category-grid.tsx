import { Card, CardContent } from "@/components/ui/card";
import { CategoryCard } from "./category-card";
import { Category } from "@/types/category-type";
import { Loader2, Grid3x3 } from "lucide-react";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  isStatusUpdating: boolean;
}

export function CategoryGrid({
  categories,
  isLoading,
  onEditCategory,
  onDeleteCategory,
  onToggleStatus,
  isStatusUpdating,
}: CategoryGridProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading categories...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Grid3x3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            No categories match your current filters. Try adjusting your search
            or filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
            onToggleStatus={onToggleStatus}
            isStatusUpdating={isStatusUpdating}
          />
        ))}
      </div>
    </div>
  );
}
