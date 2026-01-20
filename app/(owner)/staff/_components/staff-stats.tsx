import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface StaffStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
  };
}

export function StaffStats({ stats }: StaffStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Staff
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Active Staff
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.active}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Staff
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.inactive}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
              <UserX className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Administrators
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.admins}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
