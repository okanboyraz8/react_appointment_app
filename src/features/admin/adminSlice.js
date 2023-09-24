// Import the functions, we need some methods from @reduxjs/toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initialize adminService as a named "adminService" to be used for creating unitSlice
import adminService from './adminService'

const initialState = {
    admin: null,
    moderators: [],
    authorities: [],
    appointments: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    moderatorAssignmentMessage: ''
}

export const login = createAsyncThunk('admin/login', async (data, thunkAPI) => {

    try {
        return await adminService.login(data.email, data.password)
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const bringInfos = createAsyncThunk('admin/bringInfos', async (uid, thunkAPI) => {

    try {
        return await adminService.bringAdminInfos(uid)
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const logout = createAsyncThunk('admin/logout', async (_, thunkAPI) => {

    try {
        return await adminService.logout()
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const bringModerator = createAsyncThunk('admin/bringModerator', async (_, thunkAPI) => {

    try {
        return await adminService.bringModerator()
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const assignModeratorToUnit = createAsyncThunk('admin/assignModeratorToUnit', async (data, thunkAPI) => {

    try {
        // unit & moder are defined by using useState in the Admin.jsx file => so, we have to use them;
        // const [unit, setUnit] = useState("") || const [moder, setModer] = useState("")
        return await adminService.assignModeratorToUnit(data.moder, data.unit)
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const bringUnitsModerator = createAsyncThunk('admin/bringUnitsModerator', async (_, thunkAPI) => {

    try {
        return await adminService.bringUnitsModerator();
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const bringLast10unitAppointment = createAsyncThunk('admin/bringLast10unitAppointment', async (unitId, thunkAPI) => {

    try {
        return await adminService.bringLast10unitAppointment(unitId);
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})

export const changeStatus = createAsyncThunk('admin/changeStatus', async (data, thunkAPI) => {

    try {
        return await adminService.changeStatus(data);
    } catch (error) {
        const message = error.message;
        return thunkAPI.rejectWithValue(message);
    }

})



export const adminSlice = createSlice({
    name: 'adminSlice',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
            state.moderatorAssignmentMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.admin = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.admin = null
            })
            .addCase(bringInfos.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bringInfos.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.admin = action.payload
            })
            .addCase(bringInfos.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.admin = null
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.admin = action.payload
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.admin = null
            })
            .addCase(bringModerator.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bringModerator.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.moderators = action.payload
            })
            .addCase(bringModerator.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.moderators = []
            })
            .addCase(assignModeratorToUnit.fulfilled, (state, action) => {
                state.moderatorAssignmentMessage = action.payload
            })
            .addCase(assignModeratorToUnit.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
            .addCase(bringUnitsModerator.fulfilled, (state, action) => {
                state.authorities = action.payload
            })
            .addCase(bringLast10unitAppointment.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bringLast10unitAppointment.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.appointments = action.payload
            })
            .addCase(bringLast10unitAppointment.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.appointments = []
            })
            .addCase(changeStatus.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(changeStatus.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = adminSlice.actions
export default adminSlice.reducer