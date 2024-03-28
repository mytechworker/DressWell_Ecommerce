export interface Product {
  id?: string;
  image: string;
  name: string;
  price: number;
  color: string;
  category: string;
  description: string;
  count?: number;
  showFullDescription?: boolean;
  total?: number;
}

export interface UserDocument {
  mobile: number;
  dob: Date;
  access: boolean;
  name: string;
  userId: string;
  email: string;
  password?: string;
  id?: string;
  addressId?: string;
  addresses?: Address[];
}

export interface Address {
  id?: string;
  country: string;
  pincode: number;
  house: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
}

export interface CardDetails {
  nickname: string;
  cardnumber: number;
  expirydate: Date;
}

export interface CategoryDetails {
  id?: string;
  name: string;
  url: string;
}

export interface Orders {
  id?: string;
  status: string;
  userId: string;
  userName: string;
  items: Product[];
  totalAmount: number;
}
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  count: number;
}
export interface Notification {
  id?: string;
  type: 'order_accepted' | 'order_declined' | 'other_notification_type';
  message: string;
  details: any;
  read: boolean;
  count?: number;
}