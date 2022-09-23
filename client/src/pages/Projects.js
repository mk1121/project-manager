import StageItem from '../components/StageItem'
import {  useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetProjectsQuery } from '../features/projects/projectsApi'
const Projects = () => {
  const stageNames = ['backlog', 'ready', 'doing', 'blocked', 'done']
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}
  const {
    data: getProjectData,
    isError,
    isLoading,
    isSuccess,
    error,
  } = useGetProjectsQuery(userEmail) || {}
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <>
      <div className='px-10 mt-6'>
        <h1 className='text-2xl font-bold'>Project Board</h1>
      </div>
      <div className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
        {stageNames.map((el, index) => (
          <StageItem
            key={index}
            stageName={el}
            isError={isError}
            isLoading={isLoading}
            error={error}
            getProjectData={getProjectData}
            userEmail={userEmail}
            toggleVisible={toggleVisible}
            visible={visible}
          />
        ))}
      </div>
    </>
  )
}

export default Projects
