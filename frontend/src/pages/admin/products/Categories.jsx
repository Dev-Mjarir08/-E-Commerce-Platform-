import React from "react";
import { useSelector } from "react-redux";
import { FolderTree, Package } from "lucide-react";

const Categories = () => {
  const products = useSelector((state) => state.products.items);

  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryCounts);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage your product categories.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <FolderTree size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <Package size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Products
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {products.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            Product Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-10 text-center">
            <FolderTree
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 text-sm font-semibold text-slate-700">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add products with categories to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Category
                  </th>

                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Products
                  </th>

                  <th className="text-left px-5 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map(([category, count]) => (
                  <tr
                    key={category}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                          <FolderTree size={16} />
                        </div>

                        <span className="font-medium text-slate-800">
                          {category}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {count}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;