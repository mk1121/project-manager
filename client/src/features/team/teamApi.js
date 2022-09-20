import { apiSlice } from '../api/apiSlice'

export const teamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: () => '/team',
    }),
    addTeam: builder.mutation({
      query: ({ data }) => ({
        url: '/team',
        method: 'POST',
        body: data,
      }),
    }),

    editTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/team/${id}`,
        method: 'PATCH',
        body: data,
      }),

      async onQueryStarted({ id, data }, { queryFulfilled, dispatch }) {
        const editTeam = await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getTeam', undefined, (draft) => {
            draft.map((el) => {
              if (el.id === editTeam.data.id) {
                el.assignedUsers = editTeam.data.assignedUsers
              }
            })
          })
        )
        // update messages cache pessimistically end
      },
    }),
  }),
})
export const { useGetTeamQuery, useAddTeamMutation, useEditTeamMutation } =
  teamApi
