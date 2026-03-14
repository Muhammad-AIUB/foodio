export interface AdminFoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryId?: string;
  status: "available" | "unavailable";
}
