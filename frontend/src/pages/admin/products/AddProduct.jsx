import React from 'react';

const AddProduct = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Add New Product
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Create a new product for your marketplace catalog.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Price
            </label>

            <input
              type="number"
              placeholder="Enter price"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Stock Quantity
            </label>

            <input
              type="number"
              placeholder="Enter stock quantity"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Add Product
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;