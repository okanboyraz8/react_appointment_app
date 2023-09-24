import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

// Initialize unitSlice as a named "unitReducer" to be used for creating reducer in the store
import unitReducer from "../features/units/unitSlice";

// Initialize adminSlice as a named "adminReducer" to be used for creating reducer in the store
import adminReducer from "../features/admin/adminSlice";

// Initialize userSlice as a named "userReducer" to be used for creating reducer in the store
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    unitsState: unitReducer,
    adminState: adminReducer,
    userState: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
