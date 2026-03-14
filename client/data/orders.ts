export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  customer: string;
}

export const orders: Order[] = [
  {
    id: "5b331ea1-49af-422e-ba46-4e94ca95294c",
    placedAt: "2025-12-12T16:33:00",
    status: "pending",
    items: [{ name: "Pan-Seared Scallops", quantity: 1, price: 24.0 }],
    totalAmount: 24.0,
    deliveryAddress: "House:23,  Road:23, Jamaica, USA",
    customer: "John Doe",
  },
  {
    id: "5b331ea2-59bf-432f-ca56-5f05db06305d",
    placedAt: "2025-12-12T16:33:00",
    status: "preparing",
    items: [
      { name: "Golden Crunch Bites", quantity: 2, price: 15.0 },
      { name: "Grilled Salmon Fillet", quantity: 1, price: 28.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:45, Road:12, Kingston, Jamaica",
    customer: "John Doe",
  },
  {
    id: "5b331ea3-69cf-442g-da66-6g16ec17416e",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Truffle Mushroom Risotto", quantity: 2, price: 22.0 },
      { name: "Chocolate Lava Cake", quantity: 1, price: 12.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "Apt 5B, 123 Main St, New York, USA",
    customer: "John Doe",
  },
  {
    id: "5b331ea4-79df-452h-ea76-7h27fd28527f",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Braised Lamb Shank", quantity: 1, price: 32.0 },
      { name: "Crème Brûlée", quantity: 2, price: 10.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:10, Road:5, Miami, USA",
    customer: "John Doe",
  },
  {
    id: "5b331ea5-89ef-462i-fa86-8i38ge39638g",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Pan-Seared Duck Breast", quantity: 1, price: 30.0 },
      { name: "Tiramisu", quantity: 2, price: 14.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "Suite 200, Business Park, LA, USA",
    customer: "John Doe",
  },
  {
    id: "5b331ea6-99ff-472j-ga96-9j49hf40749h",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Mediterranean Olive Medley", quantity: 2, price: 25.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:7, Road:18, Toronto, Canada",
    customer: "John Doe",
  },
  {
    id: "5b331ea7-a90g-482k-ha07-0k50ig51850i",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Citrus Swirl Delights", quantity: 1, price: 35.0 },
      { name: "Berry Panna Cotta", quantity: 2, price: 11.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "Flat 3, Ocean Drive, Sydney, Australia",
    customer: "John Doe",
  },
  {
    id: "5b331ea8-b01h-492l-ib17-1l61jh62961j",
    placedAt: "2025-12-12T16:33:00",
    status: "completed",
    items: [
      { name: "Grilled Salmon Fillet", quantity: 2, price: 28.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:99, Road:1, London, UK",
    customer: "John Doe",
  },
  {
    id: "5b331ea9-c12i-502m-jc27-2m72ki73072k",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Creamy Garlic Shrimp Pasta", quantity: 4, price: 10.0 },
      { name: "Chocolate Lava Cake", quantity: 2, price: 12.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:15, Road:8, Dubai, UAE",
    customer: "John Doe",
  },
  {
    id: "5b331eaa-d23j-512n-kd37-3n83lj84183l",
    placedAt: "2025-12-12T16:33:00",
    status: "ready",
    items: [
      { name: "Truffle Mushroom Risotto", quantity: 1, price: 22.0 },
      { name: "Tiramisu", quantity: 1, price: 14.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "Apt 12, Hill Road, Singapore",
    customer: "John Doe",
  },
  {
    id: "5b331eab-e34k-522o-le47-4o94mk95294m",
    placedAt: "2025-12-12T16:33:00",
    status: "pending",
    items: [
      { name: "Golden Crunch Bites", quantity: 3, price: 15.0 },
      { name: "Berry Panna Cotta", quantity: 1, price: 11.0 },
    ],
    totalAmount: 56.0,
    deliveryAddress: "House:23,  Road:23, Jamaica, USA",
    customer: "John Doe",
  },
];
