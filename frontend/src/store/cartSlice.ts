import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string;          // product._id
  orderedQuantity: string;  // comes from a <select>, kept as string to match original behavior
  price: number;
  name: string;
  image: string;
  producerName: string;
  producerId: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        item => item.product === action.payload.product &&
                item.producerId === action.payload.producerId
      );
      if (existing) {
        existing.orderedQuantity = String(
          Number(existing.orderedQuantity) + Number(action.payload.orderedQuantity)
        );
      } else {
        state.items.push(action.payload);
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;