export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          total_score: number
          level: number
          money: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          total_score?: number
          level?: number
          money?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          total_score?: number
          level?: number
          money?: number
          created_at?: string
          updated_at?: string
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          location_lat: number
          location_lng: number
          water_level: number
          fertilizer_stock: number
          soil_health: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          location_lat?: number
          location_lng?: number
          water_level?: number
          fertilizer_stock?: number
          soil_health?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          location_lat?: number
          location_lng?: number
          water_level?: number
          fertilizer_stock?: number
          soil_health?: number
          created_at?: string
        }
      }
      crops: {
        Row: {
          id: string
          name: string
          growth_time_days: number
          water_need: number
          optimal_temp_min: number
          optimal_temp_max: number
          base_yield: number
          price_per_unit: number
          sustainability_score: number
          icon: string
        }
        Insert: {
          id?: string
          name: string
          growth_time_days: number
          water_need: number
          optimal_temp_min: number
          optimal_temp_max: number
          base_yield: number
          price_per_unit: number
          sustainability_score?: number
          icon: string
        }
        Update: {
          id?: string
          name?: string
          growth_time_days?: number
          water_need?: number
          optimal_temp_min?: number
          optimal_temp_max?: number
          base_yield?: number
          price_per_unit?: number
          sustainability_score?: number
          icon?: string
        }
      }
      plots: {
        Row: {
          id: string
          farm_id: string
          plot_number: number
          position_x: number
          position_y: number
          soil_moisture: number
          crop_id: string | null
          planted_at: string | null
          growth_stage: number
          health: number
          is_irrigated: boolean
          is_fertilized: boolean
          last_watered: string | null
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          plot_number: number
          position_x: number
          position_y: number
          soil_moisture?: number
          crop_id?: string | null
          planted_at?: string | null
          growth_stage?: number
          health?: number
          is_irrigated?: boolean
          is_fertilized?: boolean
          last_watered?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          plot_number?: number
          position_x?: number
          position_y?: number
          soil_moisture?: number
          crop_id?: string | null
          planted_at?: string | null
          growth_stage?: number
          health?: number
          is_irrigated?: boolean
          is_fertilized?: boolean
          last_watered?: string | null
          created_at?: string
        }
      }
      livestock: {
        Row: {
          id: string
          farm_id: string
          type: string
          name: string
          health: number
          happiness: number
          last_fed: string
          production_ready: boolean
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          type: string
          name: string
          health?: number
          happiness?: number
          last_fed?: string
          production_ready?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          type?: string
          name?: string
          health?: number
          happiness?: number
          last_fed?: string
          production_ready?: boolean
          created_at?: string
        }
      }
      game_events: {
        Row: {
          id: string
          user_id: string
          farm_id: string
          event_type: string
          details: Json
          score_impact: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          farm_id: string
          event_type: string
          details?: Json
          score_impact?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          farm_id?: string
          event_type?: string
          details?: Json
          score_impact?: number
          created_at?: string
        }
      }
      environmental_data: {
        Row: {
          id: string
          farm_id: string
          date: string
          temperature: number | null
          rainfall: number | null
          soil_moisture_index: number | null
          vegetation_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          date: string
          temperature?: number | null
          rainfall?: number | null
          soil_moisture_index?: number | null
          vegetation_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          date?: string
          temperature?: number | null
          rainfall?: number | null
          soil_moisture_index?: number | null
          vegetation_index?: number | null
          created_at?: string
        }
      }
    }
  }
}
