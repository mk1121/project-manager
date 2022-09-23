import { apiSlice } from '../api/apiSlice'

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (userEmail) => `/projects?q=${userEmail}`,
    }),

    getProjectsSearch: builder.query({
      query: (input) => `/projects?name_like=${input}`,
    }),
    addProjects: builder.mutation({
      query: ({ data, userEmail }) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ data, userEmail }, { queryFulfilled, dispatch }) {
        const queryData = await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getProjects', userEmail, (draft) => {
            draft.unshift(queryData?.data)
          })
        )
        // update messages cache pessimistically end
      },
    }),
    deleteProject: builder.mutation({
      query: ({ id, userEmail }) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted({ id, userEmail }, { queryFulfilled, dispatch }) {
        await queryFulfilled
        // update conversation cache pessimistically start
        dispatch(
          apiSlice.util.updateQueryData('getProjects', userEmail, (draft) => {
            const projectsFilter = draft.filter((t) => t.id != id)

            return (draft = [...projectsFilter])
          })
        )
        // update messages cache pessimistically end
      },
    }),
  }),
})
export const {
  useGetProjectsQuery,
  useAddProjectsMutation,
  useDeleteProjectMutation,
  useGetProjectsSearchQuery,
} = projectsApi
