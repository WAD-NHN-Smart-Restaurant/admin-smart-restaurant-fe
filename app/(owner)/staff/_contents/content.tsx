"use client";

import { useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth-guard";
import { useStaffQuery } from "./use-staff-query";
import { StaffHeader } from "../_components/staff-header";
import { StaffFiltersSection } from "../_components/staff-filters";
import { StaffStats } from "../_components/staff-stats";
import { StaffTable } from "../_components/staff-table";
import { StaffForm } from "../_components/staff-form";
import { EditStaffForm } from "../_components/edit-staff-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffMember, StaffFilter } from "@/types/staff-management-type";
import { Pagination } from "@/components/pagination";

export function StaffContent() {
  // State management
  const [filters, setFilters] = useState<StaffFilter>({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Queries and mutations
  const { staffQuery, createMutation, updateMutation, toggleStatusMutation } =
    useStaffQuery(filters);

  const { data: staffData, isLoading, error } = staffQuery;

  const staff = Array.isArray(staffData?.items) ? staffData.items : [];
  console.log("Fetched staff members:", staff);
  const pagination = staffData?.pagination;

  // Filter staff by search query (client-side filtering for name)
  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staff)) return [];
    if (!searchQuery) return staff;
    const query = searchQuery.toLowerCase();
    return staff.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        (member.email && member.email.toLowerCase().includes(query)),
    );
  }, [staff, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    if (!Array.isArray(staff)) {
      return { total: 0, active: 0, inactive: 0, admins: 0 };
    }
    return {
      total: staff.length,
      active: staff.filter((s) => s.isActive).length,
      inactive: staff.filter((s) => !s.isActive).length,
      admins: staff.filter((s) => s.role === "admin").length,
    };
  }, [staff]);

  // Handlers
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = (data: any) => {
    const { role, ...staffData } = data;
    createMutation.mutate(
      { role, data: staffData },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
        },
      },
    );
  };

  const handleEditClick = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    if (!editingStaff) return;
    updateMutation.mutate(
      { id: editingStaff.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingStaff(null);
        },
      },
    );
  };

  const handleToggleStatusClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusDialogOpen(true);
  };

  const handleToggleStatusConfirm = () => {
    if (!selectedStaff) return;
    toggleStatusMutation.mutate(
      { id: selectedStaff.id, currentStatus: selectedStaff.isActive },
      {
        onSuccess: () => {
          setToggleStatusDialogOpen(false);
          setSelectedStaff(null);
        },
      },
    );
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <StaffHeader onCreateClick={handleCreateClick} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <StaffFiltersSection
            filters={filters}
            searchQuery={searchQuery}
            onFiltersChange={setFilters}
            onSearchChange={setSearchQuery}
          />

          {/* Stats */}
          <StaffStats stats={stats} />

          {/* Staff Table */}
          <StaffTable
            staff={filteredStaff}
            onEdit={handleEditClick}
            onToggleStatus={handleToggleStatusClick}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Create Staff Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to your restaurant. They will receive
                login credentials to access the system.
              </DialogDescription>
            </DialogHeader>
            <StaffForm
              onSubmit={handleCreateSubmit}
              isSubmitting={createMutation.isPending}
              onCancel={() => setCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Staff Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                Update staff member information. Email and role cannot be
                changed.
              </DialogDescription>
            </DialogHeader>
            {editingStaff && (
              <EditStaffForm
                staff={editingStaff}
                onSubmit={handleEditSubmit}
                isSubmitting={updateMutation.isPending}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setEditingStaff(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Toggle Status Confirmation Dialog */}
        <AlertDialog
          open={toggleStatusDialogOpen}
          onOpenChange={setToggleStatusDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedStaff?.isActive ? "Deactivate" : "Activate"} Staff
                Member?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedStaff?.isActive ? (
                  <>
                    This will deactivate <strong>{selectedStaff?.name}</strong>.
                    They will not be able to log in until reactivated.
                  </>
                ) : (
                  <>
                    This will activate <strong>{selectedStaff?.name}</strong>.
                    They will be able to log in and access the system.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleStatusConfirm}
                className={
                  selectedStaff?.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {selectedStaff?.isActive ? "Deactivate" : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}
