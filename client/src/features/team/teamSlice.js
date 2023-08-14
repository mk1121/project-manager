import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  teamName: '',
  description: '',
  color: {
    value: '',
    label: 'select a color'
  },
  member: []
}

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    handleTeamName: (state, action) => {
      state.teamName = action.payload
    },
    handleDescription: (state, action) => {
      state.description = action.payload
    },
    handleColor: (state, action) => {
      state.color = action.payload
    },
    handleMember: (state, action) => {
      state.member = action.payload
    }
  },
})

export const { handleTeamName, handleDescription, handleColor, handleMember } = teamSlice.actions
export default teamSlice.reducer
