export type EquipmentItem = {
  id: string;
  category: string;
  name: string;
  price: number;
};

export type TrailerExtra = {
  id: string;
  name: string;
  price: number;
};

export const EQUIPMENT_CATEGORIES = [
  "Plumbing",
  "Cooking",
  "Beverage",
  "Ventilation",
  "Refrigeration",
  "Furniture",
  "Electrical",
] as const;

export const trailerExtras: TrailerExtra[] = [
  { id: "range-hood", name: "Range hood", price: 890 },
  { id: "hand-sink", name: "Hand sink", price: 180 },
  { id: "sliding-doors", name: "Sliding doors", price: 420 },
  { id: "wall-cabinet", name: "Wall cabinet", price: 260 },
  { id: "cashier", name: "Cashier", price: 320 },
  { id: "drawer", name: "Drawer", price: 140 },
];

export const equipment: EquipmentItem[] = [
  { id: "sink-single", category: "Plumbing", name: "Single sink", price: 180 },
  { id: "sink-double", category: "Plumbing", name: "Double sink", price: 320 },
  { id: "water-tank", category: "Plumbing", name: "Fresh & waste tanks", price: 260 },
  { id: "water-heater", category: "Plumbing", name: "Water heater", price: 210 },
  { id: "griddle", category: "Cooking", name: "Flat griddle", price: 540 },
  { id: "fryer", category: "Cooking", name: "Commercial fryer", price: 680 },
  { id: "charbroiler", category: "Cooking", name: "Charbroiler", price: 720 },
  { id: "espresso", category: "Beverage", name: "Espresso machine bench", price: 390 },
  { id: "blender", category: "Beverage", name: "Blender station", price: 160 },
  { id: "ice-bin", category: "Beverage", name: "Ice well", price: 240 },
  { id: "hood", category: "Ventilation", name: "Exhaust hood", price: 890 },
  { id: "fan", category: "Ventilation", name: "Roof fan", price: 220 },
  { id: "under-fridge", category: "Refrigeration", name: "Under-counter fridge", price: 640 },
  { id: "freezer", category: "Refrigeration", name: "Chest freezer", price: 580 },
  { id: "display", category: "Refrigeration", name: "Display fridge", price: 760 },
  { id: "prep", category: "Furniture", name: "Stainless prep table", price: 210 },
  { id: "counter", category: "Furniture", name: "Service counter", price: 280 },
  { id: "shelf", category: "Furniture", name: "Wall shelves", price: 90 },
  { id: "electrical", category: "Electrical", name: "Electrical system 32A", price: 450 },
  { id: "led", category: "Electrical", name: "Interior + fascia LED", price: 190 },
];

export const colorPresets = [
  { name: "Brand Yellow", hex: "#F5C518" },
  { name: "Chassis Black", hex: "#1A1A1A" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Signal Red", hex: "#C41E3A" },
  { name: "Racing Green", hex: "#0B6E4F" },
  { name: "Navy", hex: "#12355B" },
  { name: "Sky", hex: "#4BA3C3" },
  { name: "Orange", hex: "#E85D04" },
  { name: "Pink", hex: "#D7268A" },
  { name: "Cream", hex: "#F6E7C1" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gunmetal", hex: "#4A4E69" },
  { name: "Forest", hex: "#2D6A4F" },
  { name: "Teal", hex: "#0E7C7B" },
  { name: "Mustard", hex: "#D4A017" },
  { name: "Burgundy", hex: "#6D2E46" },
  { name: "Sand", hex: "#C2B280" },
  { name: "Ice Blue", hex: "#A8DADC" },
  { name: "Lime", hex: "#8AC926" },
  { name: "Violet", hex: "#5A189A" },
  { name: "Coral", hex: "#FF6F61" },
  { name: "Chocolate", hex: "#5C4033" },
  { name: "Mint", hex: "#98D7C2" },
  { name: "Gold", hex: "#C9A227" },
  { name: "Graphite", hex: "#2F2F2F" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Royal", hex: "#1B4F72" },
  { name: "Tomato", hex: "#E63946" },
  { name: "Olive", hex: "#6B8F71" },
  { name: "Sunset", hex: "#F4A261" },
  { name: "Steel", hex: "#7A8B99" },
  { name: "Charcoal", hex: "#36454F" },
];
