import { supabase } from '@/integrations/supabase/client';

export interface MarketingTemplate {
  id: string;
  title: string;
  type: 'email' | 'notification' | 'sms';
  category: 'onboarding' | 'payments' | 'referrals' | 'marketing' | 'soft_launch';
  language: 'id' | 'en';
  subject?: string;
  content: string;
  status: 'active' | 'inactive';
  featured: boolean;
  variables: string[];
  copied_count: number;
  last_copied_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateFilters {
  search?: string;
  type?: 'all' | 'email' | 'notification' | 'sms';
  category?: 'all' | 'onboarding' | 'payments' | 'referrals' | 'marketing' | 'soft_launch';
  status?: 'all' | 'active' | 'inactive';
  language?: 'id' | 'en';
}

export interface CreateTemplatePayload {
  title: string;
  type: 'email' | 'notification' | 'sms';
  category: 'onboarding' | 'payments' | 'referrals' | 'marketing' | 'soft_launch';
  language: 'id' | 'en';
  subject?: string;
  content: string;
  status: 'active' | 'inactive';
  featured: boolean;
}

export interface UpdateTemplatePayload extends Partial<CreateTemplatePayload> {
  id: string;
}

export interface CategoryStats {
  category: string;
  total_count: number;
  email_count: number;
  notification_count: number;
  sms_count: number;
  active_count: number;
  inactive_count: number;
}

// Banned phrases for anti-hype validation
const BANNED_PHRASES = [
  'pasti profit',
  'jamin',
  'auto cuan',
  '100%',
  'profit konsisten',
  'garansi'
];

// Extract variables from template content
export const extractVariables = (content: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = content.match(regex);
  if (!matches) return [];
  
  return [...new Set(matches.map(match => match.slice(2, -2)))];
};

// Check for banned phrases (anti-hype validation)
export const containsBannedPhrases = (content: string): string[] => {
  const found: string[] = [];
  const lowerContent = content.toLowerCase();
  
  BANNED_PHRASES.forEach(phrase => {
    if (lowerContent.includes(phrase)) {
      found.push(phrase);
    }
  });
  
  return found;
};

// Get admin referral code (mock - replace with actual admin profile query)
export const getAdminReferralCode = async (): Promise<string> => {
  try {
    // This would typically query the admin's profile
    // For now, return a fallback
    return 'TPCGLOBAL';
  } catch (error) {
    console.error('Error getting admin referral code:', error);
    return 'TPCGLOBAL';
  }
};

// Generate WhatsApp format
export const generateWhatsAppFormat = (template: MarketingTemplate, referralLink: string, useRendered = false): string => {
  const content = useRendered ? renderTemplateWithSample(template) : template.content;
  return `${content}\n\n👉 ${referralLink}`;
};

// Validate template data
export const validateTemplate = (payload: CreateTemplatePayload): string[] => {
  const errors: string[] = [];
  
  // Title validation
  if (!payload.title || payload.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (payload.title && payload.title.length > 80) {
    errors.push('Title must be less than 80 characters');
  }
  
  // Subject validation (for email type)
  if (payload.type === 'email') {
    if (!payload.subject || payload.subject.trim().length === 0) {
      errors.push('Subject is required for email templates');
    }
    if (payload.subject && payload.subject.length > 120) {
      errors.push('Subject must be less than 120 characters');
    }
    
    // Check banned phrases in subject
    if (payload.subject) {
      const bannedInSubject = containsBannedPhrases(payload.subject);
      if (bannedInSubject.length > 0) {
        errors.push(`Subject contains prohibited phrases: ${bannedInSubject.join(', ')}. Please avoid hype language and guarantees.`);
      }
    }
  }
  
  // Content validation
  if (!payload.content || payload.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters');
  }
  if (payload.content && payload.content.length > 4000) {
    errors.push('Content must be less than 4000 characters');
  }
  
  // Check banned phrases in content
  if (payload.content) {
    const bannedInContent = containsBannedPhrases(payload.content);
    if (bannedInContent.length > 0) {
      errors.push(`Content contains prohibited phrases: ${bannedInContent.join(', ')}. Please avoid hype language and guarantees.`);
    }
  }
  
  // XSS prevention - check for script tags
  if (payload.content && /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(payload.content)) {
    errors.push('Content contains unsafe script tags');
  }
  
  if (payload.subject && /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(payload.subject)) {
    errors.push('Subject contains unsafe script tags');
  }
  
  return errors;
};

// List templates with filters
export const listTemplates = async (filters: TemplateFilters = {}): Promise<MarketingTemplate[]> => {
  try {
    let query = (supabase as any)
      .from('marketing_templates')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
    }
    
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.language) {
      query = query.eq('language', filters.language);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error listing templates:', error);
    throw error;
  }
};

// Create template
export const createTemplate = async (payload: CreateTemplatePayload): Promise<MarketingTemplate> => {
  try {
    // Validate payload
    const errors = validateTemplate(payload);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    // Extract variables
    const content = payload.subject ? `${payload.subject} ${payload.content}` : payload.content;
    const variables = extractVariables(content);
    
    const { data, error } = await (supabase as any)
      .from('marketing_templates')
      .insert({
        ...payload,
        variables
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

// Update template
export const updateTemplate = async (payload: UpdateTemplatePayload): Promise<MarketingTemplate> => {
  try {
    const { id, ...updateData } = payload;
    
    // Validate payload
    const errors = validateTemplate(updateData as CreateTemplatePayload);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    // Extract variables if content or subject changed
    if (updateData.content || updateData.subject) {
      const content = updateData.subject ? `${updateData.subject} ${updateData.content}` : updateData.content;
      (updateData as any).variables = extractVariables(content);
    }
    
    const { data, error } = await (supabase as any)
      .from('marketing_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

// Delete template
export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('marketing_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

// Toggle featured status
export const toggleFeatured = async (id: string, featured: boolean): Promise<MarketingTemplate> => {
  try {
    const { data, error } = await (supabase as any)
      .from('marketing_templates')
      .update({ featured })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling featured:', error);
    throw error;
  }
};

// Track copied template
export const trackCopied = async (id: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('marketing_templates')
      .update({
        copied_count: (supabase as any).rpc('increment', { x: 'copied_count' }),
        last_copied_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error tracking copied:', error);
    // Don't throw error for tracking - it's not critical
  }
};

// Get category statistics
export const getCategoryStats = async (language: 'id' | 'en' = 'id'): Promise<CategoryStats[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('marketing_templates')
      .select('category, type, status')
      .eq('language', language);
    
    if (error) throw error;
    
    // Group by category and calculate stats
    const stats: Record<string, CategoryStats> = {};
    
    data?.forEach((template: any) => {
      if (!stats[template.category]) {
        stats[template.category] = {
          category: template.category,
          total_count: 0,
          email_count: 0,
          notification_count: 0,
          sms_count: 0,
          active_count: 0,
          inactive_count: 0
        };
      }
      
      stats[template.category].total_count++;
      stats[template.category][`${template.type}_count`]++;
      stats[template.category][`${template.status}_count`]++;
    });
    
    return Object.values(stats);
  } catch (error) {
    console.error('Error getting category stats:', error);
    throw error;
  }
};

// Render template with sample values (for preview only)
export const renderTemplateWithSample = (template: MarketingTemplate): string => {
  const sampleValues: Record<string, string> = {
    name: 'John Doe',
    member_code: 'TPC123456',
    amount: 'Rp 1.000.000',
    invoice_id: 'INV-2024-001',
    referral_name: 'Jane Smith',
    bonus_amount: 'Rp 100.000',
    verification_code: '123456',
    end_date: '31 Desember 2024'
  };
  
  let content = template.content;
  if (template.subject) {
    content = `Subject: ${template.subject}\n\n${content}`;
  }
  
  // Replace variables with sample values
  Object.entries(sampleValues).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(regex, value);
  });
  
  return content;
};
