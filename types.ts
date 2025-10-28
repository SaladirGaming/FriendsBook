
import { type User } from '@supabase/supabase-js';

export interface Friend {
  id: string;
  user_id: string;
  name: string;
  birthdate: string;
  hobbies: string;
  favorite_color: string;
  favorite_food: string;
  notes: string;
  created_at: string;
}

export interface GiftSuggestion {
  name: string;
  reason: string;
  estimated_price: string;
}

export interface AppUser extends User {}
