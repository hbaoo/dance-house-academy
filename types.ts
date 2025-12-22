
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
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
}
