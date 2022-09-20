
import { apiSlice } from '../api/apiSlice'

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/projects',
    }),
    addProjects: builder.mutation({
      query: ({ data }) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
export const {useGetProjectsQuery,useAddProjectsMutation} = projectsApi
