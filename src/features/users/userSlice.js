import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
    user: null,
    appointmentHours: [],
    personAppointments: [],
    message: ""
}

export const loginGoogle = createAsyncThunk('user/loginGoogle', async (data, thunkAPI) => {

    console.log('login Google');

    try {
        return await userService.googleLogin();
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const userFill = createAsyncThunk('user/userFill', async (_, thunkAPI) => {

    try {
        return await userService.userFill()
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const bringDates = createAsyncThunk('user/bringDates', async (data, thunkAPI) => {

    try {
        return await userService.formatHours(data)
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const createAppointment = createAsyncThunk('user/createAppointment', async (data, thunkAPI) => {

    try {
        return await userService.createAppointment(data)
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const bringAppointments = createAsyncThunk('user/bringAppointments', async (data, thunkAPI) => {

    try {
        return await userService.bringAppointments(data)
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {

    try {
        return await userService.logout()
    } catch (error) {
        const message = error.message
        return thunkAPI.rejectWithValue(message)
    }
})


export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = null
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginGoogle.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(loginGoogle.rejected, (state, action) => {
                state.message = action.payload
                state.user = null
            })
            .addCase(userFill.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(userFill.rejected, (state, action) => {
                state.message = action.payload
                state.user = null
            })
            .addCase(bringDates.fulfilled, (state, action) => {
                state.appointmentHours = action.payload
            })
            .addCase(bringDates.rejected, (state, action) => {
                state.message = action.payload
                state.appointmentHours = []
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.message = action.payload
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(bringAppointments.fulfilled, (state, action) => {
                state.personAppointments = action.payload
            })
            .addCase(bringAppointments.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = action.payload
                // In the service part, "return: null" was returned. If a string was returned,
                // we should have written "state.user = null". But we wrote it here as follows...
            })
            .addCase(logout.rejected, (state, action) => {
                state.message = action.payload
                state.user = null
            })
            
    }
})

export const { reset } = userSlice.actions
export default userSlice.reducer