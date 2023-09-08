import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
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
    handleTeamId: (state, action) => {
      state.id = parseInt(action.payload)
    },
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

export const { handleTeamId, handleTeamName, handleDescription, handleColor, handleMember } = teamSlice.actions
export default teamSlice.reducer
