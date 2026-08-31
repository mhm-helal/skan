export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_admin?: boolean;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  image_url: string;
  rooms: number;
  bathrooms: number;
  area: number;
  tags: string[];
  owner_name: string;
  owner_phone: string;
  description: string;
  is_available: number;
}

export interface Booking {
  id: number;
  user_id: number;
  property_id: number;
  property_title: string;
  property_price: number;
  owner_name: string;
  status: string;
  brokerage_paid: number;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface Admin {
  id: number;
  user_id: number;
  role: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  method: string;
  status: string;
  screenshot_url?: string;
  reference_number?: string;
  user_name?: string;
  user_email?: string;
  property_title?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  sender_name: string;
  message: string;
  is_admin: boolean;
  is_read: boolean;
  created_at: string;
}

export interface ChatConversation {
  user_id: number;
  user_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}
