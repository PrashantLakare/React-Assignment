import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

function normalizeUsers(apiUsers) {
  return apiUsers.map((u) => ({ ...u, favorite: false }));
}

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(USERS_URL);
    if (!res.ok) throw new Error("Failed to load users");
    const data = await res.json();
    return normalizeUsers(data);
  } catch (e) {
    return rejectWithValue(e.message ?? "Failed to load users");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
      const { id, ...patch } = action.payload;
      const idx = state.items.findIndex((u) => u.id === id);
      if (idx === -1) return;
      const prev = state.items[idx];
      state.items[idx] = {
        ...prev,
        ...patch,
        address: patch.address ? { ...prev.address, ...patch.address } : prev.address,
        company: patch.company ? { ...prev.company, ...patch.company } : prev.company,
      };
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const user = state.items.find((u) => u.id === action.payload);
      if (user) user.favorite = !user.favorite;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { updateUser, deleteUser, toggleFavorite } = usersSlice.actions;
export default usersSlice.reducer;
