"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/axios";
import type { MenuItemApi, CategoryApi } from "@/lib/types";
import type { AdminFoodItem } from "@/data/menuItems";
import AdminTabSwitcher from "@/components/admin/AdminTabSwitcher";
import MenuItemsTable from "@/components/admin/MenuItemsTable";
import CategoriesTable from "@/components/admin/CategoriesTable";
import AddEditItemModal from "@/components/admin/AddEditItemModal";
import AddEditCategoryModal from "@/components/admin/AddEditCategoryModal";

const tabs = [
  { key: "items", label: "Menu Items" },
  { key: "categories", label: "Categories" },
];

function mapToAdminItem(m: MenuItemApi): AdminFoodItem {
  return {
    id: m.id,
    name: m.name,
    description: m.description ?? "",
    price: Number(m.price),
    image: m.imageUrl ?? "/images/image1.jpeg",
    category: m.category?.name ?? "",
    categoryId: m.categoryId,
    status: m.availability ? "available" : "unavailable",
  };
}

export default function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState("items");
  const [menuItems, setMenuItems] = useState<AdminFoodItem[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminFoodItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryApi | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        api.get<{ data: MenuItemApi[] }>("/menu-items"),
        api.get<{ data: CategoryApi[] }>("/categories"),
      ]);
      const items = itemsRes.data?.data ?? itemsRes.data ?? [];
      const cats = catsRes.data?.data ?? catsRes.data ?? [];
      setMenuItems(Array.isArray(items) ? items.map(mapToAdminItem) : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setError("Failed to load menu data");
      setMenuItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categoryNames = categories.map((c) => c.name);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: AdminFoodItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (item: AdminFoodItem) => {
    try {
      const cat = categories.find((c) => c.name === item.category || c.id === item.categoryId);
      const categoryId = cat?.id ?? categories[0]?.id;
      if (!categoryId) return;
      if (editingItem) {
        await api.patch(`/menu-items/${item.id}`, {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.image,
          availability: item.status === "available",
          categoryId,
        });
      } else {
        await api.post("/menu-items", {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.image,
          availability: item.status === "available",
          categoryId,
        });
      }
      fetchData();
      setIsItemModalOpen(false);
      setEditingItem(null);
    } catch {
      setError("Failed to save item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/menu-items/${id}`);
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete item");
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: CategoryApi) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string) => {
    try {
      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, { name });
      } else {
        await api.post("/categories", { name });
      }
      fetchData();
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch {
      setError("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-primary italic mb-8">
        Menu Items
      </h1>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

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
        categories={categoryNames}
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
