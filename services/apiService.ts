
import { DanceClass, Product, Contact, Order } from '../types';
import { supabase, isSupabaseReady } from './supabaseClient';

// Initial Data (Fallback)
const INITIAL_CLASSES: DanceClass[] = [
  {
    id: 1,
    time: '08:30 AM',
    duration: '60 MIN',
    title: 'Lớp Ballet Cơ Bản',
    studio: 'Phòng A1',
    age_range: 'Trẻ em (4-6 tuổi)',
    instructor: { id: 1, name: 'Cô Minh Thư', role: 'Giám đốc chuyên môn', avatar: 'https://i.pravatar.cc/150?u=thu' },
    price: 2000000
  },
  {
    id: 2,
    time: '10:00 AM',
    duration: '90 MIN',
    title: 'Kỹ thuật Pointe Nâng cao',
    studio: 'Phòng B2',
    age_range: 'Thiếu niên (12+)',
    instructor: { id: 2, name: 'Thầy Hoàng Nam', role: 'Biên đạo múa', avatar: 'https://i.pravatar.cc/150?u=nam' },
    price: 3500000
  }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Giày Múa Satin Hồng", price: 450000, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800", badge: "NEW" },
  { id: 2, name: "Váy Tutu Thiên Nga", price: 1200000, image: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800", badge: "BEST SELLER" },
  { id: 3, name: "Áo Leotard Chuyên Nghiệp", price: 650000, image: "https://images.unsplash.com/photo-1620164368367-2708b5e90099?q=80&w=800" }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const shouldUseSupabase = () => isSupabaseReady();

// --- Storage Helpers (Fallback) ---
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Classes Service ---
export const fetchClasses = async (): Promise<DanceClass[]> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('classes').select('*').order('id', { ascending: true });
    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }
    return data || [];
  }
  await delay(300);
  return getStorage<DanceClass[]>('dance_classes', INITIAL_CLASSES);
};

export const addClass = async (cls: Omit<DanceClass, 'id'>): Promise<DanceClass> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('classes').insert([cls]).select().single();
    if (error) {
      console.error("Supabase add error:", error);
      throw error;
    }
    return data;
  }
  await delay(300);
  const classes = getStorage<DanceClass[]>('dance_classes', INITIAL_CLASSES);
  const newClass = { ...cls, id: Date.now() };
  const updatedClasses = [...classes, newClass];
  setStorage('dance_classes', updatedClasses);
  return newClass;
};

export const deleteClass = async (id: number): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const classes = getStorage<DanceClass[]>('dance_classes', INITIAL_CLASSES);
  const updatedClasses = classes.filter(c => c.id !== id);
  setStorage('dance_classes', updatedClasses);
};

export const updateClass = async (id: number, cls: Partial<DanceClass>): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('classes').update(cls).eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const classes = getStorage<DanceClass[]>('dance_classes', []);
  const updatedClasses = classes.map(c => c.id === id ? { ...c, ...cls } : c);
  setStorage('dance_classes', updatedClasses);
};

// --- Products Service ---
export const fetchProducts = async (): Promise<Product[]> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  }
  await delay(300);
  return getStorage<Product[]>('dance_products', INITIAL_PRODUCTS);
};

export const addProduct = async (prod: Omit<Product, 'id'>): Promise<Product> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('products').insert([prod]).select().single();
    if (error) throw error;
    return data;
  }
  await delay(300);
  const products = getStorage<Product[]>('dance_products', INITIAL_PRODUCTS);
  const newProduct = { ...prod, id: Date.now() };
  const updatedProducts = [...products, newProduct];
  setStorage('dance_products', updatedProducts);
  return newProduct;
};

export const deleteProduct = async (id: number): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const products = getStorage<Product[]>('dance_products', INITIAL_PRODUCTS);
  const updatedProducts = products.filter(p => p.id !== id);
  setStorage('dance_products', updatedProducts);
};

export const updateProduct = async (id: number, prod: Partial<Product>): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('products').update(prod).eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const products = getStorage<Product[]>('dance_products', []);
  const updatedProducts = products.map(p => p.id === id ? { ...p, ...prod } : p);
  setStorage('dance_products', updatedProducts);
};

// --- Contacts Service ---
export const createContact = async (contact: Contact): Promise<Contact> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('contacts').insert([contact]).select().single();
    if (error) {
      console.error("Supabase contact error:", error);
      throw error;
    }
    return data;
  }
  await delay(300);
  const contacts = getStorage<Contact[]>('dance_contacts', []);
  const newContact = { ...contact, id: Date.now(), created_at: new Date().toISOString() };
  setStorage('dance_contacts', [...contacts, newContact]);
  return newContact;
};

export const fetchContacts = async (): Promise<Contact[]> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  await delay(300);
  return getStorage<Contact[]>('dance_contacts', []);
};

export const deleteContact = async (id: number): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const contacts = getStorage<Contact[]>('dance_contacts', []);
  const updatedContacts = contacts.filter(c => c.id !== id);
  setStorage('dance_contacts', updatedContacts);
};

// --- Orders Service ---
export const createOrder = async (order: Order): Promise<Order> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('orders').insert([order]).select().single();
    if (error) {
      console.error("Supabase order error:", error);
      throw error;
    }
    return data;
  }
  await delay(300);
  const orders = getStorage<Order[]>('dance_orders', []);
  const newOrder = { ...order, id: Date.now(), created_at: new Date().toISOString() };
  setStorage('dance_orders', [...orders, newOrder]);
  return newOrder;
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (shouldUseSupabase()) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  await delay(300);
  return getStorage<Order[]>('dance_orders', []);
};

export const updateOrderStatus = async (id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<void> => {
  if (shouldUseSupabase()) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    return;
  }
  await delay(300);
  const orders = getStorage<Order[]>('dance_orders', []);
  const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
  setStorage('dance_orders', updatedOrders);
};

// --- Storage / Upload Service ---
export const uploadImage = async (file: File): Promise<string> => {
  if (shouldUseSupabase()) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('dance-house')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('dance-house')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Fallback for local development without Supabase: return a data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
