"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ModifierGroup,
  ModifierGroupStatus,
  ModifierOption,
} from "@/types/modifier-type";
import {
  ModifierGroupFilterForm,
  CreateModifierGroupForm,
  UpdateModifierGroupForm,
  CreateModifierOptionForm,
  UpdateModifierOptionForm,
} from "@/schema/modifier-schema";
import {
  useModifierGroupsQuery,
  useCreateModifierGroupMutation,
  useUpdateModifierGroupMutation,
  useDeleteModifierGroupMutation,
  useCreateModifierOptionMutation,
  useUpdateModifierOptionMutation,
  useDeleteModifierOptionMutation,
} from "./use-modifier-query";
import { ModifierGroupHeader } from "../_components/modifier-group-header";
import { ModifierGroupFilters } from "../_components/modifier-group-filters";
import { ModifierGroupGrid } from "../_components/modifier-group-grid";
import { ModifierGroupFormDialog } from "../_components/modifier-group-form-dialog";
import { ModifierOptionFormDialog } from "../_components/modifier-option-form-dialog";
import { DeleteModifierGroupDialog } from "../_components/delete-modifier-group-dialog";
import { DeleteModifierOptionDialog } from "../_components/delete-modifier-option-dialog";

export function Content() {
  // Filter state
  const [filters, setFilters] = useState<ModifierGroupFilterForm>({
    search: "",
    status: undefined,
    selectionType: undefined,
    sortBy: "displayOrder",
    sortOrder: "asc",
  });

  // Dialog states
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [isCreateOptionDialogOpen, setIsCreateOptionDialogOpen] =
    useState(false);
  const [isEditOptionDialogOpen, setIsEditOptionDialogOpen] = useState(false);
  const [isDeleteOptionDialogOpen, setIsDeleteOptionDialogOpen] =
    useState(false);

  // Selected items
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | null>(
    null,
  );
  const [selectedOption, setSelectedOption] = useState<ModifierOption | null>(
    null,
  );
  const [selectedGroupForOption, setSelectedGroupForOption] =
    useState<ModifierGroup | null>(null);

  // Queries and mutations
  const modifierGroupsQuery = useModifierGroupsQuery(filters);
  const createGroupMutation = useCreateModifierGroupMutation();
  const updateGroupMutation = useUpdateModifierGroupMutation();
  const deleteGroupMutation = useDeleteModifierGroupMutation();
  const createOptionMutation = useCreateModifierOptionMutation();
  const updateOptionMutation = useUpdateModifierOptionMutation();
  const deleteOptionMutation = useDeleteModifierOptionMutation();

  // Memoized data
  const modifierGroups = useMemo(
    () => modifierGroupsQuery.data || [],
    [modifierGroupsQuery.data],
  );

  const totalGroups = useMemo(() => modifierGroups.length, [modifierGroups]);
  const activeGroups = useMemo(
    () =>
      modifierGroups.filter(
        (group) => group.status === ModifierGroupStatus.ACTIVE,
      ).length,
    [modifierGroups],
  );

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<ModifierGroupFilterForm>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const handleCreateGroup = useCallback(() => {
    setSelectedGroup(null);
    setIsCreateGroupDialogOpen(true);
  }, []);

  const handleEditGroup = useCallback((group: ModifierGroup) => {
    setSelectedGroup(group);
    setIsEditGroupDialogOpen(true);
  }, []);

  const handleDeleteGroup = useCallback((group: ModifierGroup) => {
    setSelectedGroup(group);
    setIsDeleteGroupDialogOpen(true);
  }, []);

  const handleCreateOption = useCallback((group: ModifierGroup) => {
    setSelectedGroupForOption(group);
    setSelectedOption(null);
    setIsCreateOptionDialogOpen(true);
  }, []);

  const handleEditOption = useCallback(
    (option: ModifierOption, group: ModifierGroup) => {
      setSelectedOption(option);
      setSelectedGroupForOption(group);
      setIsEditOptionDialogOpen(true);
    },
    [],
  );

  const handleDeleteOption = useCallback(
    (option: ModifierOption, group: ModifierGroup) => {
      setSelectedOption(option);
      setSelectedGroupForOption(group);
      setIsDeleteOptionDialogOpen(true);
    },
    [],
  );

  const handleGroupFormSubmit = useCallback(
    (data: {
      name: string;
      selectionType: string;
      isRequired: boolean;
      minSelections: number;
      maxSelections: number;
      displayOrder: number;
      status: string;
    }) => {
      if (selectedGroup) {
        // Edit mode
        updateGroupMutation.mutate(
          {
            id: selectedGroup.id,
            data: { ...data } as UpdateModifierGroupForm,
          },
          {
            onSuccess: () => {
              setIsEditGroupDialogOpen(false);
              setSelectedGroup(null);
            },
          },
        );
      } else {
        // Create mode
        createGroupMutation.mutate(data as CreateModifierGroupForm, {
          onSuccess: () => {
            setIsCreateGroupDialogOpen(false);
          },
        });
      }
    },
    [selectedGroup, updateGroupMutation, createGroupMutation],
  );

  const handleOptionFormSubmit = useCallback(
    (data: { name: string; priceAdjustment: number; status: string }) => {
      if (!selectedGroupForOption) return;

      if (selectedOption) {
        // Edit mode
        updateOptionMutation.mutate(
          {
            id: selectedOption.id,
            data: {
              ...data,
            } as UpdateModifierOptionForm,
          },
          {
            onSuccess: () => {
              setIsEditOptionDialogOpen(false);
              setSelectedOption(null);
              setSelectedGroupForOption(null);
            },
          },
        );
      } else {
        // Create mode
        createOptionMutation.mutate(
          {
            groupId: selectedGroupForOption.id,
            data: {
              ...data,
            } as CreateModifierOptionForm,
          },
          {
            onSuccess: () => {
              setIsCreateOptionDialogOpen(false);
              setSelectedGroupForOption(null);
            },
          },
        );
      }
    },
    [
      selectedOption,
      selectedGroupForOption,
      updateOptionMutation,
      createOptionMutation,
    ],
  );

  const handleConfirmDeleteGroup = useCallback(() => {
    if (selectedGroup) {
      deleteGroupMutation.mutate(selectedGroup.id, {
        onSuccess: () => {
          setIsDeleteGroupDialogOpen(false);
          setSelectedGroup(null);
        },
      });
    }
  }, [selectedGroup, deleteGroupMutation]);

  const handleConfirmDeleteOption = useCallback(() => {
    if (selectedOption) {
      deleteOptionMutation.mutate(selectedOption.id, {
        onSuccess: () => {
          setIsDeleteOptionDialogOpen(false);
          setSelectedOption(null);
          setSelectedGroupForOption(null);
        },
      });
    }
  }, [selectedOption, deleteOptionMutation]);

  // Loading state
  const isLoading = modifierGroupsQuery.isLoading;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <ModifierGroupHeader
        totalGroups={totalGroups}
        activeGroups={activeGroups}
        onCreateClick={handleCreateGroup}
      />

      {/* Filters */}
      <ModifierGroupFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* Content Grid */}
      <ModifierGroupGrid
        modifierGroups={modifierGroups}
        isLoading={isLoading}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onCreateOption={handleCreateOption}
        onEditOption={handleEditOption}
        onDeleteOption={handleDeleteOption}
        isUpdating={
          createOptionMutation.isPending ||
          updateOptionMutation.isPending ||
          deleteOptionMutation.isPending
        }
      />

      {/* Create Group Dialog */}
      <ModifierGroupFormDialog
        isOpen={isCreateGroupDialogOpen}
        onClose={() => setIsCreateGroupDialogOpen(false)}
        onSubmit={handleGroupFormSubmit}
        isLoading={createGroupMutation.isPending}
        mode="create"
      />

      {/* Edit Group Dialog */}
      <ModifierGroupFormDialog
        isOpen={isEditGroupDialogOpen}
        onClose={() => {
          setIsEditGroupDialogOpen(false);
          setSelectedGroup(null);
        }}
        onSubmit={handleGroupFormSubmit}
        isLoading={updateGroupMutation.isPending}
        mode="edit"
        initialData={selectedGroup}
      />

      {/* Delete Group Dialog */}
      <DeleteModifierGroupDialog
        isOpen={isDeleteGroupDialogOpen}
        onClose={() => {
          setIsDeleteGroupDialogOpen(false);
          setSelectedGroup(null);
        }}
        onConfirm={handleConfirmDeleteGroup}
        isLoading={deleteGroupMutation.isPending}
        modifierGroup={selectedGroup}
      />

      {/* Create Option Dialog */}
      <ModifierOptionFormDialog
        isOpen={isCreateOptionDialogOpen}
        onClose={() => {
          setIsCreateOptionDialogOpen(false);
          setSelectedGroupForOption(null);
        }}
        onSubmit={handleOptionFormSubmit}
        isLoading={createOptionMutation.isPending}
        mode="create"
        groupName={selectedGroupForOption?.name}
      />

      {/* Edit Option Dialog */}
      <ModifierOptionFormDialog
        isOpen={isEditOptionDialogOpen}
        onClose={() => {
          setIsEditOptionDialogOpen(false);
          setSelectedOption(null);
          setSelectedGroupForOption(null);
        }}
        onSubmit={handleOptionFormSubmit}
        isLoading={updateOptionMutation.isPending}
        mode="edit"
        initialData={selectedOption}
        groupName={selectedGroupForOption?.name}
      />

      {/* Delete Option Dialog */}
      <DeleteModifierOptionDialog
        isOpen={isDeleteOptionDialogOpen}
        onClose={() => {
          setIsDeleteOptionDialogOpen(false);
          setSelectedOption(null);
          setSelectedGroupForOption(null);
        }}
        onConfirm={handleConfirmDeleteOption}
        isLoading={deleteOptionMutation.isPending}
        modifierOption={selectedOption}
        groupName={selectedGroupForOption?.name}
      />
    </div>
  );
}
