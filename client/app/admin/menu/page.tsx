"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { adminMenuItems, adminCategories, type AdminFoodItem } from "@/data/menuItems";
import AdminTabSwitcher from "@/components/admin/AdminTabSwitcher";
import MenuItemsTable from "@/components/admin/MenuItemsTable";
import CategoriesTable from "@/components/admin/CategoriesTable";
import AddEditItemModal from "@/components/admin/AddEditItemModal";
import AddEditCategoryModal from "@/components/admin/AddEditCategoryModal";

const tabs = [
  { key: "items", label: "Menu Items" },
  { key: "categories", label: "Categories" },
];

export default function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState("items");
  const [menuItems, setMenuItems] = useState<AdminFoodItem[]>(adminMenuItems);
  const [categories, setCategories] = useState<string[]>(adminCategories);

  // Item modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminFoodItem | null>(null);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // Item handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: AdminFoodItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (item: AdminFoodItem) => {
    if (editingItem) {
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    } else {
      setMenuItems((prev) => [...prev, item]);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (name: string) => {
    setEditingCategory(name);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c === editingCategory ? name : c))
      );
      setMenuItems((prev) =>
        prev.map((item) =>
          item.category === editingCategory
            ? { ...item, category: name }
            : item
        )
      );
    } else {
      setCategories((prev) => [...prev, name]);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
    setMenuItems((prev) => prev.filter((i) => i.category !== name));
  };

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-primary italic mb-8">
        Menu Items
      </h1>

      <div className="flex items-center justify-between mb-6">
        <AdminTabSwitcher
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
        />

        {activeTab === "items" ? (
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        ) : (
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {activeTab === "items" ? (
        <MenuItemsTable
          items={menuItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      <AddEditItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
        categories={categories}
      />

      <AddEditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </>
  );
}
