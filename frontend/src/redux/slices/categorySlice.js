import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/categoryService';

// ============================================
// BACKEND CATEGORY -> FRONTEND CATEGORY
// ============================================

export const mapBackendCategoryToItem = (category) => {
  if (!category) {
    return null;
  }

  const imageUrl =
    typeof category.image === 'string'
      ? category.image
      : category.image?.url || '';

  return {
    id: category._id || category.id,
    name: category.name || '',
    slug: category.slug || '',
    tagline: category.description || '',
    image: category.image?.url ||
      (typeof category.image === 'string' ? category.image : ''),
    isActive: Boolean(category.isActive),
    displayOrder: category.displayOrder ?? 0,

    // Backend productsCount ko UI ke itemCount mein map kar rahe hain
    itemCount: category.productsCount ?? 0,

    parentCategory:
      category.parentCategory || null,

    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
};

// ============================================
// FETCH CATEGORIES
// ============================================

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',

  async (_, { rejectWithValue }) => {
    try {
      const response =
        await categoryService.getCategories();

      const rawCategories =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

      return rawCategories
        .map(mapBackendCategoryToItem)
        .filter(Boolean);

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch categories'
      );
    }
  }
);

// ============================================
// ADD CATEGORY
// ============================================

export const addCategory = createAsyncThunk(
  'categories/addCategory',

  async (categoryData, { rejectWithValue }) => {
    try {
      const response =
        await categoryService.createCategory(
          categoryData
        );

      const createdCategory =
        response?.data || response;

      return mapBackendCategoryToItem(
        createdCategory
      );

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to create category'
      );
    }
  }
);

// ============================================
// UPDATE CATEGORY
// ============================================

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',

  async (
    { id, ...categoryData },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await categoryService.updateCategory(
          id,
          categoryData
        );

      const updatedCategory =
        response?.data || response;

      return mapBackendCategoryToItem(
        updatedCategory
      );

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to update category'
      );
    }
  }
);

// ============================================
// DELETE CATEGORY
// ============================================

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',

  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);

      return id;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete category'
      );
    }
  }
);

// ============================================
// TOGGLE ACTIVE / HIDDEN
// ============================================

export const toggleCategoryStatus = createAsyncThunk(
  'categories/toggleCategoryStatus',

  async (
    id,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();

      const category =
        state.categories.items.find(
          (item) => item.id === id
        );

      const nextIsActive =
        !Boolean(category?.isActive);

      const response =
        await categoryService.updateCategoryStatus(
          id,
          nextIsActive
        );

      const updatedCategory =
        response?.data || response;

      return {
        id:
          updatedCategory?._id ||
          updatedCategory?.id ||
          id,

        isActive:
          Boolean(updatedCategory?.isActive)
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to update category status'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  items: [],
  loading: false,
  error: null
};

// ============================================
// SLICE
// ============================================

const categorySlice = createSlice({
  name: 'categories',

  initialState,

  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {

    // -----------------------------
    // FETCH
    // -----------------------------

    builder
      .addCase(
        fetchCategories.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchCategories.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchCategories.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // -----------------------------
      // ADD
      // -----------------------------

      .addCase(
        addCategory.fulfilled,
        (state, action) => {
          if (!action.payload) {
            return;
          }

          state.items.unshift(
            action.payload
          );
        }
      )

      // -----------------------------
      // UPDATE
      // -----------------------------

      .addCase(
        updateCategory.fulfilled,
        (state, action) => {
          if (!action.payload) {
            return;
          }

          const index =
            state.items.findIndex(
              (category) =>
                category.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.items[index] = {
              ...state.items[index],
              ...action.payload
            };
          }
        }
      )

      // -----------------------------
      // DELETE
      // -----------------------------

      .addCase(
        deleteCategory.fulfilled,
        (state, action) => {
          state.items =
            state.items.filter(
              (category) =>
                category.id !== action.payload
            );
        }
      )

      // -----------------------------
      // TOGGLE
      // -----------------------------

      .addCase(
        toggleCategoryStatus.fulfilled,
        (state, action) => {
          if (!action.payload) {
            return;
          }

          const index =
            state.items.findIndex(
              (category) =>
                category.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.items[index] = {
              ...state.items[index],
              ...action.payload
            };
          }
        }
      );
  }
});

export const {
  clearCategoryError
} = categorySlice.actions;

export default categorySlice.reducer;