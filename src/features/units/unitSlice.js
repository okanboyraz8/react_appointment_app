// Import the functions, we need some methods from @reduxjs/toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initialize unitService as a named "unitService" to be used for creating unitSlice
import unitService from './unitService'

const initialState = {
    units: [],
    selectedUnit: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const bringUnits = createAsyncThunk('unit/bringUnits', async (_, thunkAPI) => {

    try {
        return await unitService.bringUnits();
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const selectUnit = createAsyncThunk('unit/selectUnit', async (id, thunkAPI) => {

    try {
        return await unitService.bringSelectedUnit(id);
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const unitSlice = createSlice({
    name: 'unitSlice',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bringUnits.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bringUnits.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.units = action.payload
            })
            .addCase(selectUnit.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(selectUnit.fulfilled, (state, action) => {
                state.selectedUnit = action.payload
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(selectUnit.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.selectedUnit = null
            })
    }
})

export const { reset } = unitSlice.actions
export default unitSlice.reducer