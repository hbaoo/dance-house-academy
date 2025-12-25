
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
  item_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  order_code: string;
  created_at?: string;
}
