import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Layers,
  RefreshCw,
  ArrowLeft,
  Check,
  Edit2,
} from "lucide-react";

export default function ProductVariants({ onVariantsChange: _onVariantsChange = null }) {
  const navigate = useNavigate();

  const [optionGroups, setOptionGroups] = useState([
    { id: 1, name: "Color", values: ["Black", "Emerald", "Navy"] },
    { id: 2, name: "Size", values: ["S", "M", "L"] },
  ]);

  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [selectedGroupForVal, setSelectedGroupForVal] = useState(1);

  // Auto-generate variants matrix based on option combinations
  const [generatedVariants, setGeneratedVariants] = useState([
    { id: "v1", combination: "Black / S", price: "29.99", sku: "TSH-BLK-S", stock: 25 },
    { id: "v2", combination: "Black / M", price: "29.99", sku: "TSH-BLK-M", stock: 18 },
    { id: "v3", combination: "Emerald / S", price: "32.00", sku: "TSH-EMR-S", stock: 10 },
  ]);

  // Safe navigation back to previous route or fallback products list
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  };

  // Add Option Group (e.g., Material)
  const handleAddOptionGroup = (e) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newOptionName,
      values: [],
    };

    setOptionGroups([...optionGroups, newGroup]);
    setSelectedGroupForVal(newGroup.id);
    setNewOptionName("");
  };

  // Add Tag Value to Option Group (e.g., Red)
  const handleAddValueToGroup = (groupId) => {
    if (!newOptionValue.trim()) return;

    setOptionGroups(
      optionGroups.map((group) => {
        if (group.id === groupId && !group.values.includes(newOptionValue.trim())) {
          return { ...group, values: [...group.values, newOptionValue.trim()] };
        }
        return group;
      })
    );
    setNewOptionValue("");
  };

  const handleRemoveValue = (groupId, valToRemove) => {
    setOptionGroups(
      optionGroups.map((group) =>
        group.id === groupId
          ? { ...group, values: group.values.filter((v) => v !== valToRemove) }
          : group
      )
    );
  };

  // Update variant input
  const handleVariantChange = (id, field, value) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
      {/* HEADER WITH BACK BUTTON */}
      <div className="border-b border-slate-100 pb-4 space-y-2">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="text-emerald-600" size={18} /> Product Variants & Options
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure options like Size, Color, or Material to generate purchasable variants.
            </p>
          </div>
        </div>
      </div>

      {/* OPTION BUILDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Group */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            1. Add Option Type
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="e.g. Size, Material"
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddOptionGroup}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Add Value */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            2. Add Values to Option
          </label>
          <div className="flex gap-2">
            <select
              value={selectedGroupForVal}
              onChange={(e) => setSelectedGroupForVal(Number(e.target.value))}
              className="px-2 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
            >
              {optionGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              placeholder="e.g. XL, Cotton"
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleAddValueToGroup(selectedGroupForVal)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Value
            </button>
          </div>
        </div>
      </div>

      {/* CREATED OPTION TAGS DISPLAY */}
      <div className="space-y-3">
        {optionGroups.map((group) => (
          <div key={group.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {group.name}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.values.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium"
                >
                  {val}
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(group.id, val)}
                    className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* GENERATED VARIANTS TABLE */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Variant Inventory & Pricing
          </h3>
          <button
            type="button"
            className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:text-emerald-700 cursor-pointer"
          >
            <RefreshCw size={12} /> Regenerate Combinations
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] sm:text-xs bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Variant Name</th>
                <th className="py-2.5 px-3 font-semibold">Price ($)</th>
                <th className="py-2.5 px-3 font-semibold">SKU</th>
                <th className="py-2.5 px-3 font-semibold">Stock Qty</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {generatedVariants.map((variant) => (
                <tr key={variant.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {variant.combination}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "price", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "sku", e.target.value)
                      }
                      className="w-28 px-2 py-1 border border-slate-200 rounded text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(variant.id, "stock", e.target.value)
                      }
                      className="w-20 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setGeneratedVariants(
                          generatedVariants.filter((v) => v.id !== variant.id)
                        )
                      }
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}