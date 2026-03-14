export interface FoodItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

export const foodItems: Record<string, FoodItem[]> = {
  Starters: [
    {
      name: "Golden Crunch Bites",
      description: "Jumbo scallops with cauliflower purée and truffle oil.",
      price: "$15.00",
      image: "/images/image1.jpeg",
    },
    {
      name: "Mediterranean Olive Medley",
      description: "Jumbo scallops with cauliflower purée and truffle oil.",
      price: "$25.00",
      image: "/images/image2.jpeg",
    },
    {
      name: "Citrus Swirl Delights",
      description: "Jumbo scallops with cauliflower purée and truffle oil.",
      price: "$35.00",
      image: "/images/image3.jpeg",
    },
    {
      name: "Creamy Garlic Shrimp Pasta",
      description: "Jumbo scallops with cauliflower purée and truffle oil.",
      price: "$10.00",
      image: "/images/image3.jpeg",
    },
  ],
  "Main Courses": [
    {
      name: "Grilled Salmon Fillet",
      description: "Fresh Atlantic salmon with herb butter and seasonal vegetables.",
      price: "$28.00",
      image: "/images/image2.jpeg",
    },
    {
      name: "Truffle Mushroom Risotto",
      description: "Creamy Arborio rice with wild mushrooms and truffle oil.",
      price: "$22.00",
      image: "/images/image1.jpeg",
    },
    {
      name: "Braised Lamb Shank",
      description: "Slow-cooked lamb with rosemary jus and mashed potatoes.",
      price: "$32.00",
      image: "/images/image3.jpeg",
    },
    {
      name: "Pan-Seared Duck Breast",
      description: "Duck breast with cherry reduction and roasted root vegetables.",
      price: "$30.00",
      image: "/images/image2.jpeg",
    },
  ],
  Desserts: [
    {
      name: "Chocolate Lava Cake",
      description: "Rich dark chocolate cake with a molten center and vanilla ice cream.",
      price: "$12.00",
      image: "/images/image1.jpeg",
    },
    {
      name: "Crème Brûlée",
      description: "Classic French custard with a caramelized sugar crust.",
      price: "$10.00",
      image: "/images/image3.jpeg",
    },
    {
      name: "Tiramisu",
      description: "Espresso-soaked ladyfingers with mascarpone cream.",
      price: "$14.00",
      image: "/images/image2.jpeg",
    },
    {
      name: "Berry Panna Cotta",
      description: "Silky vanilla panna cotta topped with mixed berry compote.",
      price: "$11.00",
      image: "/images/image1.jpeg",
    },
  ],
};

export const categoryNames = ["All", "Starters", "Main Courses", "Desserts"] as const;

// Admin-specific types and data

export interface AdminFoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: "available" | "unavailable";
}

export const adminCategories: string[] = ["Starters", "Main Courses", "Desserts"];

export const adminMenuItems: AdminFoodItem[] = Object.entries(foodItems).flatMap(
  ([category, items]) =>
    items.map((item, index) => ({
      id: `${category.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.replace("$", "")),
      image: item.image,
      category,
      status: "available" as const,
    }))
);
