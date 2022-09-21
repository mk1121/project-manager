import moment from 'moment'
import { useEffect, useState } from 'react'
import AddTeamModal from './modals/AddTeamModal'
import { useDeleteTeamMutation } from '../features/team/teamApi'
import { useSelector } from 'react-redux'
const TeamItem = ({ team }) => {
  const [deleteTeam, { isError, isSuccess, isLoading }] =
    useDeleteTeamMutation()
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}
  const [unValidEmail, setunValidEmail] = useState('')
  const { id, description, timestamp, catagory, assignedUsers } = team || {}
  const { type: name, color } = catagory || {}
  const [visible, setVisible] = useState(false)
  const [responseError, setResponseError] = useState('')

  const toggleVisible = () => {
    setVisible(!visible)
    setunValidEmail('')
    setResponseError('')
  }
  const handleRemove = (e) => {
    deleteTeam({ id, userEmail })
  }
  return (
    <div
      className=' dropdown dropdown-end  relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100'
      draggable='true'
    >
      <img
        className={` absolute  mt-5 top-0 right-10 flex items-center justify-center  w-5 h-5  text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex`}
        src='https://img.icons8.com/external-those-icons-flat-those-icons/24/000000/external-Remove-interface-those-icons-flat-those-icons.png'
        onClick={(e) => handleRemove(e)}
      />
      <div className=''>
        <button className='absolute mt-5 top-0 right-0  flex items-center justify-center  w-5 h-5  text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex'>
          <svg
            className='w-4 h-4 fill-current'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
          </svg>
        </button>

        <ul
          tabIndex={0}
          className='dropdown-content menu py-1 text-sm text-gray-700 bg-blue-200 dark:text-gray-200'
          aria-labelledby='dropdownDividerButton'
        >
          <li>
            <a
              onClick={toggleVisible}
              className='  py-2 px-4 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-blue-500'
            >
              Edit
            </a>
          </li>
        </ul>
      </div>
      <AddTeamModal
        btnAction='edit'
        team={team}
        responseError={responseError}
        setResponseError={setResponseError}
        unValidEmail={unValidEmail}
        setunValidEmail={setunValidEmail}
        id={id}
        toggleVisible={toggleVisible}
        visible={visible}
        assignedUsers={assignedUsers}
      />
      <span
        className={`flex  items-center h-6 px-3 text-xs font-semibold text-${color}-500 bg-${color}-100 rounded-full`}
      >
        {name}
      </span>
      <h4
        className='mt-3 text-sm  font-medium'
        style={{
          WebkitLineClamp: '2',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        }}
      >
        {description}{' '}
      </h4>
      <div className='flex items-center w-full mt-3 text-xs font-medium text-gray-400'>
        <div className='flex items-center'>
          <svg
            className='w-4 h-4 text-gray-300 fill-current'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
              clipRule='evenodd'
            />
          </svg>
          <span className='ml-1 leading-none'>
            {moment(timestamp).format('MMM Do')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TeamItem
