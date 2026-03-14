"use client";

interface AdminTabSwitcherProps {
  activeTab: string;
  tabs: { key: string; label: string }[];
  onTabChange: (tab: string) => void;
}

export default function AdminTabSwitcher({
  activeTab,
  tabs,
  onTabChange,
}: AdminTabSwitcherProps) {
  return (
    <div className="inline-flex bg-accent rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-white text-text-dark shadow-sm"
              : "text-text-muted hover:text-text-dark"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
