"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CATEGORY_GROUPS } from "@/lib/datasets";
import { useState } from "react";

interface CategorySidebarProps {
  selectedDatasets: Set<string>;
  loadingDatasets: Set<string>;
  onToggleDataset: (id: string) => void;
  onToggleGroupSelection: (groupKey: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  datasetSubtypes: Map<string, Array<{ en: string; ar: string }>>;
  selectedSubtypes: Map<string, Set<string>>;
  onToggleSubtype: (datasetId: string, subtypeEn: string) => void;
  onGroupExpanded: (groupKey: string, isExpanded: boolean) => void;
}

export default function CategorySidebar({
  selectedDatasets,
  loadingDatasets,
  onToggleDataset,
  onToggleGroupSelection,
  onSelectAll,
  onDeselectAll,
  isOpen,
  onClose,
  datasetSubtypes,
  selectedSubtypes,
  onToggleSubtype,
  onGroupExpanded,
}: CategorySidebarProps) {
  const { lang, t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (key: string) => {
    const isExpanding = !expandedGroups.has(key);

    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (isExpanding) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });

    onGroupExpanded(key, isExpanding);
  };

  const isGroupFullySelected = (groupKey: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.key === groupKey);
    return group?.datasets.every((d) => selectedDatasets.has(d.id)) ?? false;
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{t("categories")}</h2>
          <div className="sidebar-actions">
            <button className="btn-small" onClick={onSelectAll}>
              {t("selectAll")}
            </button>
            <button className="btn-small" onClick={onDeselectAll}>
              {t("deselectAll")}
            </button>
          </div>
        </div>

        {CATEGORY_GROUPS.map((group, index) => (
          <div
            key={group.key}
            className={`category-group ${expandedGroups.has(group.key) ? "expanded-group" : ""}`}
          >
            <div
              className={`category-header ${isGroupFullySelected(group.key) ? "active" : ""}`}
              onClick={() => toggleGroup(group.key)}
            >
              <span
                className={`category-chevron ${expandedGroups.has(group.key) ? "expanded" : ""}`}
              >
                ▲
              </span>
              <span className="category-group-index">{index + 1}</span>
              <div className="category-spacer" />
              <span className="category-name">
                {lang === "ar" ? group.nameAr : group.nameEn}
              </span>
              <span className="category-icon">{group.icon}</span>
              <div
                className={`dataset-checkbox ${isGroupFullySelected(group.key) ? "checked" : ""}`}
                data-variant="group"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleGroupSelection(group.key);
                }}
              >
                {isGroupFullySelected(group.key) && "✓"}
              </div>
            </div>

            {expandedGroups.has(group.key) && (
              <div className="dataset-list">
                {group.datasets.map((dataset) => (
                  <div key={dataset.id} className="dataset-item-wrapper">
                    <button
                      className="dataset-item"
                      onClick={() => onToggleDataset(dataset.id)}
                      data-has-subtypes={
                        datasetSubtypes.get(dataset.id)?.length
                          ? "true"
                          : "false"
                      }
                    >
                      {loadingDatasets.has(dataset.id) ? (
                        <div className="dataset-loading" />
                      ) : (
                        <div
                          className={`dataset-checkbox ${selectedDatasets.has(dataset.id) ? "checked" : ""}`}
                        >
                          {selectedDatasets.has(dataset.id) && "✓"}
                        </div>
                      )}
                      <span>
                        {lang === "ar" ? dataset.nameAr : dataset.nameEn}
                      </span>
                    </button>

                    {datasetSubtypes.get(dataset.id) &&
                      datasetSubtypes.get(dataset.id)!.length > 0 && (
                        <div className="subtypes-wrap-list">
                          {datasetSubtypes.get(dataset.id)!.map((s) => {
                            const isChecked =
                              selectedSubtypes.get(dataset.id)?.has(s.en) ??
                              false;
                            return (
                              <label
                                key={s.en}
                                className="subtype-label-inline"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    onToggleSubtype(dataset.id, s.en)
                                  }
                                  className="subtype-checkbox-blue"
                                />
                                <span>{lang === "ar" ? s.ar : s.en}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>
    </>
  );
}
