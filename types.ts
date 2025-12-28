
export interface Instructor {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export interface DanceClass {
  id: number;
  time: string;
  duration: string;
  title: string;
  studio: string;
  age_range: string;
  instructor: Instructor;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
}

export interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface Order {
  id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_fee?: number;
  shipping_platform?: string;
  shipping_service?: string;
  item_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  order_code: string;
  created_at?: string;
}

export interface Package {
  id: string;
  name: string;
  description?: string;
  duration_days?: number;
  total_sessions: number;
  price: number;
  is_active: boolean;
  display_order?: number;
}

export interface Transaction {
  id: string;
  order_code: string;
  student_id?: string;
  package_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  amount: number;
  payment_gateway: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  metadata?: {
    package_name?: string;
    address?: string;
  };
}

export interface Membership {
  id: string;
  student_id: string;
  package_name: string;
  total_sessions: number;
  remaining_sessions: number;
  start_date: string;
  end_date?: string;
  status: 'Active' | 'Expired' | 'Suspended';
}

export interface Student {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  password?: string;
  status: string;
  join_date: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  is_visible: boolean;
  published_at: string;
  created_at?: string;
}
