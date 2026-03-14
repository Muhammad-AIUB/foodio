export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface OrderItemApi {
  id: string;
  menuItemId: string;
  quantity: number;
  priceSnapshot: string | number;
  menuItem: { id: string; name: string; imageUrl: string | null; price: string | number };
}

export interface OrderApi {
  id: string;
  userId: string;
  totalPrice: string | number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemApi[];
  user?: { id: string; name: string; email: string; role: string };
}

export interface CategoryApi {
  id: string;
  name: string;
  description: string | null;
}

export interface MenuItemApi {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  imageUrl: string | null;
  availability: boolean;
  categoryId: string;
  category: { id: string; name: string };
}
