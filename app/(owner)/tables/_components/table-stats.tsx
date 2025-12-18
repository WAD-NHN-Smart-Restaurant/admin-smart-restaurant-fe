import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LayoutGrid, Users, QrCode } from "lucide-react";

interface TableStatsProps {
  stats: {
    total: number;
    active: number;
    occupied: number;
    withQR: number;
  };
}

export function TableStats({ stats }: TableStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Tables
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Active
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.active}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Occupied
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.occupied}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                With QR Code
              </p>

              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.withQR}
                <span className="text-sm text-muted-foreground">
                  / {stats.total}
                </span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
              <QrCode className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
