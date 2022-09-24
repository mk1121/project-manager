import { apiSlice } from '../api/apiSlice'

export const teamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: (email) => `/team?q=${email}`,
    }),
    addTeam: builder.mutation({
      query: ({ data, userEmail }) => ({
        url: '/team',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted({ data, userEmail }, { queryFulfilled, dispatch }) {
        const queryData = await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getTeam', userEmail, (draft) => {
            draft.unshift(queryData?.data)
          })
        )
        // update messages cache pessimistically end
      },
    }),

    editTeam: builder.mutation({
      query: ({ id, userEmail, data }) => ({
        url: `/team/${id}`,
        method: 'PATCH',
        body: data,
      }),

      async onQueryStarted(
        { id, userEmail, data },
        { queryFulfilled, dispatch }
      ) {
        const editTeam = await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getTeam', userEmail, (draft) => {
            let draftTeam = draft.find((t) => t.id == id)
            draftTeam.color = data.color

            draftTeam.description = data.description
            draftTeam.name = data.name
            draftTeam.assignedUsers = data.assignedUsers
          })
        )
        // update messages cache pessimistically end
      },
    }),
    deleteTeam: builder.mutation({
      query: ({ id, userEmail }) => ({
        url: `/team/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted({ id, userEmail }, { queryFulfilled, dispatch }) {
        await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getTeam', userEmail, (draft) => {
            const teamFilter = draft.filter((t) => t.id != id)

            return (draft = [...teamFilter])
          })
        )
        // update messages cache pessimistically end
      },
    }),
  }),
})
export const {
  useDeleteTeamMutation,
  useGetTeamQuery,
  useAddTeamMutation,
  useEditTeamMutation,
} = teamApi
