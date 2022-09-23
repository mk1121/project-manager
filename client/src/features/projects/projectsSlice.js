
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search:[]
};

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
    search:(state,action) =>{
      state.search = action.payload
    }
  },
});

export const {search} = projectsSlice.actions;
export default projectsSlice.reducer;
