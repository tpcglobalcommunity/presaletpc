import { History, Eye, FileText, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userEmail?: string;
  timestamp: string;
  details?: any;
}

export default function AdminAuditPage() {
  // Placeholder data - will be implemented with actual audit logging
  const placeholderLogs: AuditLog[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-[#848E9C]">Riwayat aktivitas sistem</p>
        </div>
        <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">
          Coming Soon
        </Badge>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-[#F0B90B]/10 to-[#F8D56B]/5 border-[#F0B90B]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="h-5 w-5 text-[#F0B90B]" />
            Audit Log Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-white">
              Fitur audit log akan segera tersedia untuk melacak semua aktivitas penting dalam sistem:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Invoice Actions</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Create invoice</li>
                  <li>• Update status (approve/reject)</li>
                  <li>• Upload proof</li>
                  <li>• Payment confirmation</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">User Activities</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• User registration</li>
                  <li>• Login/logout</li>
                  <li>• Profile updates</li>
                  <li>• Referral usage</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Admin Actions</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Admin login</li>
                  <li>• Configuration changes</li>
                  <li>• User management</li>
                  <li>• System operations</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Security Events</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Failed login attempts</li>
                  <li>• Access denied</li>
                  <li>• Suspicious activities</li>
                  <li>• Permission changes</li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Implementasi Plan</span>
              </div>
              <div className="text-white text-sm space-y-1">
                <p>• Database table: audit_logs</p>
                <p>• Automatic logging via triggers</p>
                <p>• Searchable and filterable interface</p>
                <p>• Export functionality for compliance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Table */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <History className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
            <p className="text-[#848E9C] font-medium">Audit log akan segera tersedia</p>
            <p className="text-[#848E9C] text-sm mt-1">
              Fitur ini sedang dalam pengembangan untuk melacak aktivitas sistem secara real-time
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
