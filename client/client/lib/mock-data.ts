export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'starters' | 'main' | 'desserts';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'starters', name: 'Starters', icon: '🍴' },
  { id: 'main', name: 'Main Courses', icon: '👨‍🍳' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Golden Crunch Bites', description: 'Jumbo scallops with cauliflower purée and truffle oil.', price: 15, image: '/food-1.jpg', category: 'starters' },
  { id: '2', name: 'Mediterranean Olive Medley', description: 'Stuffed mushrooms with herbs and cheese.', price: 25, image: '/food-2.jpg', category: 'starters' },
  { id: '3', name: 'Citrus Swirl Delights', description: 'Cherry tomato and mozzarella skewers with balsamic.', price: 35, image: '/food-3.jpg', category: 'starters' },
  { id: '4', name: 'Creamy Garlic Shrimp Pasta', description: 'Crispy calamari with zesty dipping sauce.', price: 10, image: '/food-4.jpg', category: 'main' },
  { id: '5', name: 'Herb-Roasted Chicken Bowl', description: 'Tender chicken with mashed potatoes and asparagus.', price: 18, image: '/food-5.jpg', category: 'main' },
  { id: '6', name: 'Crispy Fire Bites', description: 'Spicy meat with roasted root vegetables.', price: 22, image: '/food-6.jpg', category: 'main' },
  { id: '7', name: 'Pan-Seared Scallops', description: 'Perfectly seared scallops with seasonal greens.', price: 28, image: '/food-7.jpg', category: 'main' },
  { id: '8', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with vanilla ice cream.', price: 12, image: '/food-8.jpg', category: 'desserts' },
];
