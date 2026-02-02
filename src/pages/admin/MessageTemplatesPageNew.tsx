import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Star,
  Mail,
  Bell,
  Smartphone,
  Search,
  Filter,
  Globe,
  Eye,
  Send,
  X,
  Check,
  Link,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  MarketingTemplate, 
  TemplateFilters, 
  CreateTemplatePayload, 
  UpdateTemplatePayload,
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleFeatured,
  trackCopied,
  getCategoryStats,
  renderTemplateWithSample,
  getAdminReferralCode,
  generateWhatsAppFormat
} from '@/lib/marketingTemplates';

const MessageTemplatesPage = () => {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState<TemplateFilters>({
    type: 'all',
    category: 'all',
    status: 'all',
    language: 'id'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState<CreateTemplatePayload>({
    title: '',
    type: 'email',
    category: 'onboarding',
    language: 'id',
    subject: '',
    content: '',
    status: 'active',
    featured: false
  });

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await listTemplates({ ...filters, search: searchTerm });
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: "Error",
          description: "Gagal memuat template",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [filters, searchTerm, toast]);

  // Load category stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getCategoryStats(filters.language || 'id');
        setCategoryStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [filters.language]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'notification':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sms':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'onboarding':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'payments':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'referrals':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'marketing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'soft_launch':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCopyTemplate = async (template: MarketingTemplate, type: 'raw' | 'rendered' = 'raw') => {
    try {
      const content = type === 'rendered' ? renderTemplateWithSample(template) : template.content;
      await navigator.clipboard.writeText(content);
      await trackCopied(template.id);
      
      toast({
        title: "Berhasil Disalin",
        description: `Template ${type === 'rendered' ? 'dengan contoh data' : 'mentah'} telah disalin`,
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin template",
        variant: "destructive"
      });
    }
  };

  const handleCopySubject = async (template: MarketingTemplate) => {
    try {
      if (template.subject) {
        await navigator.clipboard.writeText(template.subject);
        toast({
          title: "Subject Disalin",
          description: "Subject email telah disalin",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin subject",
        variant: "destructive"
      });
    }
  };

  const handleCopyFull = async (template: MarketingTemplate) => {
    try {
      const fullContent = template.subject ? `${template.subject}\n\n${template.content}` : template.content;
      await navigator.clipboard.writeText(fullContent);
      await trackCopied(template.id);
      
      toast({
        title: "Full Template Disalin",
        description: "Subject dan content telah disalin",
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin template",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeatured = async (template: MarketingTemplate) => {
    try {
      const updated = await toggleFeatured(template.id, !template.featured);
      setTemplates(prev => prev.map(t => t.id === template.id ? updated : t));
      
      toast({
        title: "Berhasil",
        description: `Template ${updated.featured ? 'ditandai sebagai featured' : 'dihapus dari featured'}`,
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengubah status featured",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Berhasil Dihapus",
        description: "Template telah dihapus",
      });
    } catch (error) {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus template",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const newTemplate = await createTemplate(formData);
      setTemplates(prev => [newTemplate, ...prev]);
      setIsCreating(false);
      resetForm();
      
      toast({
        title: "Berhasil Dibuat",
        description: "Template baru telah dibuat",
      });
    } catch (error: any) {
      toast({
        title: "Gagal Membuat",
        description: error.message || "Terjadi kesalahan saat membuat template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
      const updated = await updateTemplate({ ...formData, id: selectedTemplate.id });
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updated : t));
      setIsEditing(false);
      setSelectedTemplate(null);
      resetForm();
      
      toast({
        title: "Berhasil Diperbarui",
        description: "Template telah diperbarui",
      });
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui",
        description: error.message || "Terjadi kesalahan saat memperbarui template",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'email',
      category: 'onboarding',
      language: 'id',
      subject: '',
      content: '',
      status: 'active',
      featured: false
    });
  };

  const startEdit = (template: MarketingTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      type: template.type,
      category: template.category,
      language: template.language,
      subject: template.subject || '',
      content: template.content,
      status: template.status,
      featured: template.featured
    });
    setIsEditing(true);
  };

  // Header quick actions
  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText('https://tpcglobal.io');
      toast({
        title: "Domain Disalin",
        description: "https://tpcglobal.io telah disalin",
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin domain",
        variant: "destructive"
      });
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      const referralCode = await getAdminReferralCode();
      const referralLink = `https://tpcglobal.io/id?ref=${referralCode}`;
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Referral Link Disalin",
        description: `${referralLink} telah disalin`,
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin referral link",
        variant: "destructive"
      });
    }
  };

  const handleCopyWAFormat = async (template: MarketingTemplate) => {
    try {
      const referralCode = await getAdminReferralCode();
      const referralLink = `https://tpcglobal.io/id?ref=${referralCode}`;
      const waFormat = generateWhatsAppFormat(template, referralLink, false);
      await navigator.clipboard.writeText(waFormat);
      await trackCopied(template.id);
      
      toast({
        title: "WA Format Disalin",
        description: "Template dengan format WhatsApp telah disalin",
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Terjadi kesalahan saat menyalin format WhatsApp",
        variant: "destructive"
      });
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-yellow-500" />
            Message Templates
          </h1>
          <p className="text-gray-400">Klik copy → kirim manual → aman & non-spam</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Header Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
              onClick={handleCopyDomain}
            >
              <Link className="h-4 w-4 mr-1" />
              Copy Domain
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
              onClick={handleCopyReferralLink}
            >
              <Link className="h-4 w-4 mr-1" />
              Copy Referral
            </Button>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Buat template pesan baru untuk komunikasi marketing
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Masukkan judul template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="referrals">Referrals</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="soft_launch">Soft Launch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.language} onValueChange={(value: any) => setFormData(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type === 'email' && (
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Masukkan subject email"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={6}
                    placeholder="Masukkan konten template. Gunakan {{variable}} untuk data dinamis"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-700 text-yellow-500"
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value: any) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="referrals">Referrals</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="soft_launch">Soft Launch</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.language} onValueChange={(value: any) => setFilters(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <MessageSquare className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <Filter className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">
                  {searchTerm || filters.type !== 'all' || filters.category !== 'all' || filters.status !== 'all' 
                    ? 'Tidak ada template yang cocok dengan filter' 
                    : 'Belum ada template. Buat template pertama Anda!'}
                </p>
              </div>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        {template.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-yellow-500"
                        onClick={() => handleToggleFeatured(template)}
                      >
                        <Star className={`h-4 w-4 ${template.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                    {template.subject && (
                      <CardDescription className="text-gray-400">
                        {template.subject}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
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

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => handleCopyTemplate(template, 'raw')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      
                      {template.type === 'email' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-white hover:bg-gray-700"
                          onClick={() => handleCopySubject(template)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Subject
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => handleCopyTemplate(template, 'rendered')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => handleCopyFull(template)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Full
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-400 hover:bg-green-900/20"
                        onClick={() => handleCopyWAFormat(template)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WA Format
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => startEdit(template)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Template</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Apakah Anda yakin ingin menghapus template "{template.title}"? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-600 text-white hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((stat) => (
              <Card key={stat.category} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5 text-yellow-500" />
                    {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-500">{stat.total_count}</div>
                  <p className="text-gray-400 text-sm">total templates</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-blue-400">{stat.email_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Notification:</span>
                      <span className="text-green-400">{stat.notification_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">SMS:</span>
                      <span className="text-purple-400">{stat.sms_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active:</span>
                      <span className="text-green-400">{stat.active_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inactive:</span>
                      <span className="text-red-400">{stat.inactive_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription className="text-gray-400">
              Perbarui template pesan yang ada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="referrals">Referrals</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="soft_launch">Soft Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-language">Language</Label>
                <Select value={formData.language} onValueChange={(value: any) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'email' && (
              <div>
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-700 text-yellow-500"
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleUpdateTemplate}>
                Update Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageTemplatesPage;
