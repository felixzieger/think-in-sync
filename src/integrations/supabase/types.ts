export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_challenges: {
        Row: {
          created_at: string
          game_id: string
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_results: {
        Row: {
          ai_guess: string
          created_at: string
          description: string
          id: string
          is_correct: boolean
          session_id: string
          target_word: string
        }
        Insert: {
          ai_guess: string
          created_at?: string
          description: string
          id?: string
          is_correct: boolean
          session_id?: string
          target_word: string
        }
        Update: {
          ai_guess?: string
          created_at?: string
          description?: string
          id?: string
          is_correct?: boolean
          session_id?: string
          target_word?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          id: string
          language: string | null
          theme: string
          words: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          theme: string
          words: string[]
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          theme?: string
          words?: string[]
        }
        Relationships: []
      }
      high_scores: {
        Row: {
          avg_words_per_round: number
          created_at: string
          game_id: string | null
          id: string
          player_name: string
          score: number
          session_id: string
          theme: string
        }
        Insert: {
          avg_words_per_round: number
          created_at?: string
          game_id?: string | null
          id?: string
          player_name: string
          score: number
          session_id: string
          theme?: string
        }
        Update: {
          avg_words_per_round?: number
          created_at?: string
          game_id?: string | null
          id?: string
          player_name?: string
          score?: number
          session_id?: string
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "high_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          game_id: string
          id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_update_high_score:
        | {
            Args: {
              p_player_name: string
              p_score: number
              p_avg_words_per_round: number
              p_session_id: string
              p_theme?: string
            }
            Returns: boolean
          }
        | {
            Args: {
              p_player_name: string
              p_score: number
              p_avg_words_per_round: number
              p_session_id: string
              p_theme?: string
              p_game_id?: string
            }
            Returns: boolean
          }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
