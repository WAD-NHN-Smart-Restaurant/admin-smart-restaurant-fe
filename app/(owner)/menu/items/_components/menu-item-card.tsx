"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Camera,
  Clock,
  DollarSign,
  Crown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem, MenuItemStatus } from "@/types/menu-item-type";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onView: (item: MenuItem) => void;
  onManagePhotos: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onView,
  onManagePhotos,
}: MenuItemCardProps) {
  const getStatusColor = (status: MenuItemStatus) => {
    switch (status) {
      case MenuItemStatus.AVAILABLE:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case MenuItemStatus.UNAVAILABLE:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case MenuItemStatus.SOLD_OUT:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusLabel = (status: MenuItemStatus) => {
    switch (status) {
      case MenuItemStatus.AVAILABLE:
        return "Available";
      case MenuItemStatus.UNAVAILABLE:
        return "Unavailable";
      case MenuItemStatus.SOLD_OUT:
        return "Sold Out";
      default:
        return status;
    }
  };

  // Find primary photo
  const primaryPhoto = item.menuItemPhotos.find((photo) => photo.isPrimary);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border py-0 overflow-clip">
      <CardContent className="p-0">
        {/* Header with image and status */}
        <div className="relative mb-3">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {primaryPhoto ? (
              <Image
                src={primaryPhoto.url}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge className={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>

          {/* Chef recommendation */}
          {item.isChefRecommended && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                <Crown className="h-3 w-3 mr-1" />
                Chef&apos;s Choice
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 px-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {item.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManagePhotos(item)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Manage Photos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground">
            {item.menuCategories.name}
          </p>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-1">
              {item.description}
            </p>
          )}

          {/* Footer info */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {item.price.toFixed(2)}
                </span>
              </div>

              {item.prepTimeMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.prepTimeMinutes}m</span>
                </div>
              )}
            </div>

            {/* <div className="text-xs text-muted-foreground">
              {item.photos.length} photo{item.photos.length !== 1 ? "s" : ""}
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
