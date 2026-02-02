import { Bell, CheckCircle, XCircle, Clock, Info, Settings, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export default function AdminNotificationsPage() {
  // Placeholder data - will be implemented with actual notifications
  const notifications: Notification[] = [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return XCircle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-[#848E9C] bg-[#848E9C]/10 border-[#848E9C]/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-[#848E9C]">Notifikasi sistem dan alert admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">
            Coming Soon
          </Badge>
          <Button variant="outline" size="sm" className="border-[#2B3139] text-[#848E9C]">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total</CardTitle>
            <Bell className="h-4 w-4 text-[#848E9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Unread</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">0</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Today</CardTitle>
            <Info className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">0</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </span>
            <Button variant="ghost" size="sm" className="text-[#848E9C]">
              Mark all as read
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <p className="text-[#848E9C] font-medium">Belum ada notifikasi</p>
              <p className="text-[#848E9C] text-sm mt-1">
                Notifikasi sistem akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                
                return (
                  <div key={notification.id} className="flex items-start gap-4 p-4 bg-[#2B3139]/30 rounded-lg border border-[#2B3139]">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        <span className="text-[#848E9C] text-xs">
                          {new Date(notification.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[#848E9C] text-sm">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#F0B90B] rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-gradient-to-br from-[#F0B90B]/10 to-[#F8D56B]/5 border-[#F0B90B]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#F0B90B]" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-white">
              Sistem notifikasi akan menyediakan berbagai jenis alert:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Transaction Alerts</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• New invoice created</li>
                  <li>• Payment received</li>
                  <li>• Invoice pending review</li>
                  <li>• Payment failed</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">User Activities</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• New user registration</li>
                  <li>• User login attempts</li>
                  <li>• Profile updates</li>
                  <li>• Referral activities</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">System Alerts</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Database connection issues</li>
                  <li>• API rate limits</li>
                  <li>• Storage capacity warnings</li>
                  <li>• Security events</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Success Events</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Batch operations completed</li>
                  <li>• Data backups successful</li>
                  <li>• System maintenance done</li>
                  <li>• Feature deployments</li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Delivery Methods</span>
              </div>
              <div className="text-white text-sm space-y-1">
                <p>• In-app notifications (real-time)</p>
                <p>• Email notifications (configurable)</p>
                <p>• Webhook integrations (for external systems)</p>
                <p>• Mobile push notifications (future)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
