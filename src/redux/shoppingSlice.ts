import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Updated Variation interface
interface Variation {
  _id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  discountRate?: number;
  stock: { amount: number; branch: string }[];
  image: string;
  product?: string;
  variation?: string;
  title?: string;
  images?: { url: string }[];
  quantity?: number;
  brand?: string;
}

// Define the initial state type
interface CartState {
  productsData: Variation[];
  productsPOS: Variation[];
  favoritesData: Variation[];
  userInfo: any;
  shippingInfo: any;
  orderData: any[];
  affiliateInfo: any;
  emailListData: any[];
  qrListData: any[];
  loginAttempts: any;
}

// Define the action type
interface AddToCartAction {
  type: string;
  payload: Variation;
}

const initialState = {
  productsData: [],
  productsPOS: [],
  favoritesData: [],
  userInfo: null,
  shippingInfo: null,
  orderData: [],
  affiliateInfo: null,
  emailListData: [],
  qrListData: [],
  loginAttempts: null,
};

export const shoppingSlice = createSlice({
  name: "compras",
  initialState,
  reducers: {
    addToPOSCart: (state: any, action: PayloadAction<Variation>) => {
      const existingProduct: any = state.productsPOS.find(
        (item: any) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity =
          (existingProduct.quantity || 0) + (action.payload.quantity || 1);
      } else {
        state.productsPOS.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    increasePOSQuantity: (
      state,
      action: PayloadAction<{ _id: string; branchId: string }>
    ) => {
      const existingProduct: any = state.productsPOS.find(
        (item: any) => item._id === action.payload._id
      );
      if (existingProduct) {
        const branchStock = existingProduct.stock.find(
          (s: { branch: string }) => s.branch === action.payload.branchId
        );
        if (
          branchStock &&
          (existingProduct.quantity || 0) < branchStock.amount
        ) {
          existingProduct.quantity = (existingProduct.quantity || 0) + 1;
        }
      }
    },
    decreasePOSQuantity: (state, action: PayloadAction<{ _id: string }>) => {
      const existingProduct: any = state.productsPOS.find(
        (item: any) => item._id === action.payload._id
      );
      if (
        existingProduct &&
        existingProduct.quantity &&
        existingProduct.quantity > 1
      ) {
        existingProduct.quantity--;
      }
    },
    addToCart: (state: any, action: PayloadAction<Variation>) => {
      const existingProduct: any = state.productsData.find(
        (item: any) => item._id === action.payload._id
      );
      if (existingProduct) {
        existingProduct.quantity =
          (existingProduct.quantity || 0) + (action.payload.quantity || 1);
      } else {
        state.productsData.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    increaseQuantity: (
      state: any,
      action: PayloadAction<{ _id: string; branchId: string }>
    ) => {
      const existingProduct = state.productsData.find(
        (item: any) => item._id === action.payload._id
      );
      if (existingProduct) {
        const branchStock = existingProduct.stock.find(
          (s: { branch: string }) => s.branch === action.payload.branchId
        );
        if (
          branchStock &&
          (existingProduct.quantity || 0) < branchStock.amount
        ) {
          existingProduct.quantity = (existingProduct.quantity || 0) + 1;
        }
      }
    },
    decreaseQuantity: (state, action: PayloadAction<{ _id: string }>) => {
      const existingProduct: any = state.productsData.find(
        (item: any) => item._id === action.payload._id
      );
      if (
        existingProduct &&
        existingProduct.quantity &&
        existingProduct.quantity > 1
      ) {
        existingProduct.quantity--;
      }
    },
    increaseLoginAttempts: (state, action) => {
      state.loginAttempts += action.payload.count;
    },
    applyDiscount: (
      state,
      action: PayloadAction<{ productId: string; discountRate: number }>
    ) => {
      const existingProduct: any = state.productsData.find(
        (item: any) => item._id === action.payload.productId
      );
      if (existingProduct) {
        existingProduct.discountRate = action.payload.discountRate;
      }
    },

    deletePOSProduct: (state, action) => {
      state.productsPOS = state.productsPOS.filter(
        (item: any) => item._id !== action.payload
      );
    },
    resetPOSCart: (state) => {
      state.productsPOS = [];
    },

    deleteProduct: (state, action) => {
      state.productsData = state.productsData.filter(
        (item: any) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productsData = [];
    },
    addToFavorites: (state: any, action: any) => {
      const existingProduct = state.favoritesData.find(
        (item: any) => item._id === action.payload._id
      );
      if (existingProduct) {
        state.favoritesData = state.favoritesData.filter(
          (item: any) => item._id !== action.payload._id
        );
      } else {
        state.favoritesData.push(action.payload);
      }
    },
    deleteFavorite: (state, action) => {
      state.favoritesData = state.favoritesData.filter(
        (item: any) => item._id !== action.payload
      );
    },
    resetFavorites: (state) => {
      state.favoritesData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    addAffiliate: (state, action) => {
      state.affiliateInfo = action.payload;
    },
    addShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    deleteUser: (state) => {
      state.userInfo = null;
    },
    saveOrder: (state, action) => {
      state.orderData = action.payload;
    },
    savePOSOrder: (state, action) => {
      state.orderData = action.payload;
    },
    repopulateCart: (state: any, action: any) => {
      state.productsData.push(action.payload);
    },
    repopulateFavorites: (state: any, action: any) => {
      state.favoritesData.push(action.payload);
    },
    resetOrder: (state: any) => {
      state.orderData = {};
    },
    saveEmailReceiver: (state: any, action: any) => {
      const existingEmail = state.emailListData.find(
        (item: any) => item.id === action.payload.id
      );
      if (existingEmail) {
        const clientIdToRemove = action.payload.id;
        state.emailListData = state.emailListData.filter(
          (item: any) => item.id !== clientIdToRemove
        );
      } else {
        state.emailListData.push(action.payload);
      }
    },
    removeEmailReceiver: (state, action) => {
      const clientIdToRemove = action.payload;
      state.emailListData = state.emailListData.filter(
        (item: any) => item.id !== clientIdToRemove
      );
    },
    resetEmailReceiver: (state: any) => {
      state.emailListData = [];
    },
    saveQRToPrint: (state: any, action: any) => {
      const existingEmail = state.qrListData.find(
        (item: any) => item.id === action.payload.id
      );
      if (existingEmail) {
        const productIdToRemove = action.payload.id;
        state.qrListData = state.qrListData.filter(
          (item: any) => item.id !== productIdToRemove
        );
      } else {
        state.qrListData.push(action.payload);
      }
    },
    removeQRToPrint: (state, action) => {
      const productIdToRemove = action.payload;
      state.qrListData = state.qrListData.filter(
        (item: any) => item.id !== productIdToRemove
      );
    },
    resetQRToPrint: (state) => {
      state.qrListData = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  addToPOSCart,
  increasePOSQuantity,
  decreasePOSQuantity,
  deletePOSProduct,
  resetPOSCart,
  addUser,
  addAffiliate,
  deleteUser,
  saveOrder,
  savePOSOrder,
  repopulateCart,
  addShippingInfo,
  saveEmailReceiver,
  removeEmailReceiver,
  resetEmailReceiver,
  repopulateFavorites,
  resetFavorites,
  deleteFavorite,
  addToFavorites,
  increaseLoginAttempts,
  saveQRToPrint,
  removeQRToPrint,
  resetQRToPrint,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
