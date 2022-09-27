import { useState } from 'react'
import { useSelector } from 'react-redux'
import AddTeamModal from '../components/modals/AddTeamModal'
import TeamItem from '../components/TeamItem'
import Error from '../components/ui/Error'
import { useGetTeamQuery } from '../features/team/teamApi'
const Team = () => {
  const user = useSelector((state) => state.auth.user)
  const { email } = user
  const {
    data: getTeamData,
    isError,
    isLoading,
    isSuccess,
    error,
  } = useGetTeamQuery(email) || {}
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => {
    setVisible(!visible)
  }
  let content

  if (isLoading) {
    content = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    content = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (!isLoading && !isError && getTeamData?.length === 0) {
    content = <h4 className='m-2 text-center'>No Team found!</h4>
  } else if (!isLoading && !isError && getTeamData?.length > 0) {
    content = getTeamData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((team) => <TeamItem team={team} isSuccess={isSuccess} key={team.id} />)
  }
  return (
    <>
      <div className='px-10 mt-6 flex justify-between'>
        <h1 className='text-2xl font-bold'>Teams</h1>
        <button
          onClick={toggleVisible}
          className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            ></path>
          </svg>
        </button>
        <AddTeamModal
          btnAction='add'
          visible={visible}
          toggleVisible={toggleVisible}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto'>
        {content}
      </div>
    </>
  )
}

export default Team
