import { Link, useMatch } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import { search } from '../features/projects/projectsSlice'
import { userLoggedOut } from '../features/auth/authSlice'
import { useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import { apiSlice } from '../features/api/apiSlice'
import { useGetProjectsSearchQuery } from '../features/projects/projectsApi'
const Layout = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  let match = useMatch('/team')
  const [input, setInput] = useState('')
  useDebounce(
    async() => {
      if (input !== '') {
        const data = await dispatch(
          apiSlice.endpoints.getProjectsSearch.initiate(input)
        )
        dispatch(search(data.data))
      }else{
        dispatch(search([]))
      }
    },
    [input],
    500
  )
  const handleSearch = (e) => {
    setInput(e.target.value)
  }

  const logout = () => {
    dispatch(userLoggedOut())
    localStorage.removeItem('auth')
  }

  return (
    <>
      <div className='flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200'>
        <div className='flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75'>
          <img src={logo} className='h-10 w-10' />

          <input
            value={input}
            onChange={handleSearch}
            className={`${
              match && 'hidden'
            } flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring`}
            type='search'
            placeholder='Search for anything…'
          />
          <div className='ml-10'>
            <Link
              className={`mx-2 text-sm font-semibold ${
                !match
                  ? 'text-indigo-700'
                  : 'text-gray-600 hover:text-indigo-700'
              }`}
              to='/projects'
            >
              Projects
            </Link>
            <Link
              className={`mx-2 text-sm font-semibold ${
                match
                  ? 'text-indigo-700'
                  : 'text-gray-600 hover:text-indigo-700'
              }`}
              to='/team'
            >
              Team
            </Link>
          </div>
          <div className='dropdown dropdown-end flex items-center  w-full h-16 px-10 bg-white bg-opacity-75'>
            {' '}
            <button className='flex items-center justify-center w-8 h-8 ml-auto overflow-hidden rounded-full cursor-pointer'>
              <img src={user.avatar} alt='' />
            </button>
            <ul
              tabIndex={0}
              className='dropdown-content menu mt-20 py-1 text-sm text-gray-700 bg-blue-200 dark:text-gray-200'
              aria-labelledby='dropdownDividerButton'
            >
              <li>
                <a
                  onClick={logout}
                  className=' block py-2 px-4 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-blue-500'
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}

export default Layout
