import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Send,
  Star,
  Users,
  Mail,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'notification' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const MessageTemplatesPage = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTemplates: MessageTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome to TPC Global! 🎉',
        content: 'Hello {{name}},\n\nWelcome to TPC Global! Your account has been successfully created.\n\nMember Code: {{member_code}}\n\nBest regards,\nTPC Team',
        variables: ['name', 'member_code'],
        category: 'Onboarding',
        is_active: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Payment Confirmation',
        type: 'notification',
        content: 'Your payment of {{amount}} for invoice {{invoice_id}} has been confirmed. Thank you!',
        variables: ['amount', 'invoice_id'],
        category: 'Payments',
        is_active: true,
        created_at: '2024-01-10T15:30:00Z',
        updated_at: '2024-01-10T15:30:00Z'
      },
      {
        id: '3',
        name: 'Referral Bonus',
        type: 'email',
        subject: 'You earned a referral bonus! 🎁',
        content: 'Congratulations {{name}}!\n\nYou\'ve earned a referral bonus of {{bonus_amount}} for referring {{referral_name}}.\n\nKeep up the great work!\nTPC Team',
        variables: ['name', 'bonus_amount', 'referral_name'],
        category: 'Referrals',
        is_active: true,
        created_at: '2024-01-05T09:15:00Z',
        updated_at: '2024-01-05T09:15:00Z'
      }
    ];
    
    setTemplates(mockTemplates);
    setLoading(false);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'notification':
        return 'bg-green-100 text-green-800';
      case 'sms':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.content);
    toast({
      title: "Template copied",
      description: "Template content has been copied to clipboard",
    });
  };

  const handleSendTest = (template: MessageTemplate) => {
    toast({
      title: "Test message sent",
      description: `Test ${template.type} has been sent to your email`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-yellow-500" />
            Message Templates
          </h1>
          <p className="text-gray-400">Manage email, notification, and SMS templates</p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <MessageSquare className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <Star className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleCopyTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleSendTest(template)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                  {template.subject && (
                    <CardDescription className="text-gray-400">
                      {template.subject}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {template.category}
                      </Badge>
                      {template.is_active && (
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-400 line-clamp-3">
                      {template.content}
                    </div>
                    
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Onboarding', 'Payments', 'Referrals', 'Marketing'].map((category) => {
              const categoryCount = templates.filter(t => t.category === category).length;
              return (
                <Card key={category} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">{categoryCount}</div>
                    <p className="text-gray-400 text-sm">templates</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {selectedTemplate && isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Edit Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Template Name</Label>
                <Input
                  id="name"
                  value={selectedTemplate.name}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              {selectedTemplate.type === 'email' && (
                <div>
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    value={selectedTemplate.subject}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="content" className="text-white">Content</Label>
                <Textarea
                  id="content"
                  value={selectedTemplate.content}
                  rows={8}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MessageTemplatesPage;
