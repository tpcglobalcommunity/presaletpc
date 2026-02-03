export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          amount_input: number
          amount_usd: number
          base_currency: Database["public"]["Enums"]["payment_currency"]
          created_at: string
          email: string
          expires_at: string
          id: string
          invoice_no: string
          proof_url: string | null
          referral_code: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          tpc_amount: number
          transfer_method: Database["public"]["Enums"]["transfer_method"] | null
          updated_at: string
          user_id: string | null
          wallet_tpc: string | null
        }
        Insert: {
          amount_input: number
          amount_usd: number
          base_currency: Database["public"]["Enums"]["payment_currency"]
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invoice_no: string
          proof_url?: string | null
          referral_code: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tpc_amount: number
          transfer_method?:
            | Database["public"]["Enums"]["transfer_method"]
            | null
          updated_at?: string
          user_id?: string | null
          wallet_tpc?: string | null
        }
        Update: {
          amount_input?: number
          amount_usd?: number
          base_currency?: Database["public"]["Enums"]["payment_currency"]
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invoice_no?: string
          proof_url?: string | null
          referral_code?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tpc_amount?: number
          transfer_method?:
            | Database["public"]["Enums"]["transfer_method"]
            | null
          updated_at?: string
          user_id?: string | null
          wallet_tpc?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email_current: string
          email_initial: string
          id: string
          member_code: string
          referred_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_current: string
          email_initial: string
          id?: string
          member_code: string
          referred_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_current?: string
          email_initial?: string
          id?: string
          member_code?: string
          referred_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invoice_locked: {
        Args: {
          p_email: string;
          p_referral_code: string | null;
          p_base_currency: Database["public"]["Enums"]["payment_currency"];
          p_amount_input: number;
        };
        Returns: {
          invoice_no: string;
          email: string;
          amount_input: number;
          base_currency: Database["public"]["Enums"]["payment_currency"];
          created_at: string;
          expires_at: string;
        };
      };
      is_referral_code_valid: {
        Args: {
          p_referral_code: string;
        };
        Returns: boolean;
      };
      get_public_invoice_by_token: {
        Args: {
          p_invoice_no: string;
        };
        Returns: {
          invoice_no: string;
          status: string;
          amount_input: number;
          amount_usd: number;
          tpc_amount: number;
          base_currency: string;
          created_at: string;
          approved_at: string | null;
          tpc_tx_hash: string | null;
          tpc_sent: boolean;
          wallet_tpc: string | null;
        }[];
      };
      admin_approve_invoice: {
        Args: {
          p_id: string;
        };
        Returns: {
          id: string;
          invoice_no: string;
          email: string;
          status: string;
          amount_input: number;
          amount_usd: number;
          tpc_amount: number;
          base_currency: string;
          created_at: string;
          approved_at: string;
          tpc_tx_hash: string | null;
          tpc_sent: boolean;
          wallet_tpc: string | null;
        };
      };
      public_validate_member_code: {
        Args: {
          p_code: string;
        };
        Returns: {
          id: string;
          member_code: string;
        }[];
      };
      generate_invoice_no: { Args: never; Returns: string }
      generate_member_code: { Args: never; Returns: string }
      get_referral_network: { 
        Args: { 
          target_member_code: string; 
          max_depth?: number 
        }; 
        Returns: Array<{
          level: number;
          member_code: string;
          email: string;
          created_at: string;
          referred_by: string | null;
        }>
      }
      get_referral_stats: { 
        Args: { 
          member_code: string 
        }; 
        Returns: Array<{
          total_referrals: number;
          active_referrals: number;
          total_levels: number;
        }>
      }
      get_all_invoices_admin: {
        Args: never;
        Returns: Array<{
          id: string;
          user_id: string | null;
          email: string;
          referral_code: string;
          status: string;
          created_at: string;
          member_name: string | null;
        }>
      }
      get_all_users_admin: {
        Args: never;
        Returns: Array<{
          id: string;
          user_id: string;
          email_initial: string;
          email_current: string;
          member_code: string;
          referred_by: string | null;
          created_at: string;
          total_invoices: number;
        }>
      }
      register_referral: {
        Args: {
          new_user_id: string;
          referral_code: string;
        };
        Returns: void;
      }
      get_referral_tree_stats: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          levels: {
            level1: number;
            level2: number;
            level3: number;
          };
          summary: {
            total_downline: number;
            active_downline: number;
            total_invoices: number;
          };
        };
      };
      member_submit_payment_proof: {
        Args: {
          p_id: string;
          p_transfer_method: string;
          p_wallet_tpc: string;
          p_proof_url: string;
        };
        Returns: {
          id: string;
          invoice_no: string;
          status: string;
          transfer_method: string;
          wallet_tpc: string;
          proof_url: string;
        };
      };
      get_all_referrals_admin: {
        Args: never;
        Returns: Array<{
          referral_id: string;
          user_email: string;
          user_referral_code: string;
          parent_email: string | null;
          parent_referral_code: string | null;
          level: number;
          created_at: string;
        }>;
      }
      update_invoice_status_admin: {
        Args: {
          invoice_id: string;
          new_status: string;
          review_note?: string;
        };
        Returns: boolean;
      }
      get_dashboard_stats_admin: {
        Args: never;
        Returns: {
          totalPending: number;
          totalApproved: number;
          totalRejected: number;
          totalInvoices: number;
          totalTPC: number;
        }
      }
      admin_get_paid_totals: {
        Args: never;
        Returns: {
          totalUSD: number;
          totalTPC: number;
          totalIDR: number;
          totalUSDC: number;
          totalSOL: number;
        }
      }
      get_admin_users_data: {
        Args: never;
        Returns: Array<{
          id: string;
          email: string;
          full_name: string;
          member_code: string;
          referred_by: string | null;
          role_name: string;
          created_at: string;
          total_invoices: number;
          paid_invoices: number;
          total_revenue: number;
        }>
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      invoice_status:
        | "UNPAID"
        | "PENDING_REVIEW"
        | "PAID"
        | "EXPIRED"
        | "CANCELLED"
      payment_currency: "IDR" | "USDC" | "SOL"
      transfer_method: "USDC" | "SOL" | "BCA" | "OVO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invoice_status: [
        "UNPAID",
        "PENDING_REVIEW",
        "PAID",
        "EXPIRED",
        "CANCELLED",
      ],
      payment_currency: ["IDR", "USDC", "SOL"],
      transfer_method: ["USDC", "SOL", "BCA", "OVO"],
    },
  },
} as const
