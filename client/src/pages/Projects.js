import StageItem from '../components/StageItem'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useDeleteProjectMutation,
  useEditProjectsMutation,
  useGetProjectsQuery,
} from '../features/projects/projectsApi'
import { useDrop } from 'react-dnd'
import Error from '../components/ui/Error'
const Projects = () => {
  const stageNames = ['backlog', 'ready', 'doing', 'blocked', 'done']
  const [responseError, setResponseError] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}
  const {
    data: getProjectData,
    isError,
    isLoading,
    error,
  } = useGetProjectsQuery(userEmail)
  const [editProject] = useEditProjectsMutation()
  const [deleteProject] = useDeleteProjectMutation()
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => {
    setVisible(!visible)
  }
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: stageNames,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (item) => handleDeleteDrop(item),
    }),
    [stageNames]
  )

  const isActive = isOver && canDrop
  const handleDrop = (index, item) => {
    const { id } = item
    editProject({
      id,
      data: { stage: stageNames[index] },
      userEmail,
    })
  }
  const handleDeleteDrop = (item) => {
    const { id, Creator, stage } = item
    if (Creator.email === userEmail && stage === 'backlog') {
      setResponseError(null)
      deleteProject({ id, userEmail })
    } else {
      setResponseError(true)
    }
  }
  useEffect(() => {
    if (canDrop) setResponseError(null)
  }, [canDrop])
  return (
    <>
      <div className='relative flex flex-col justify-center px-10 mt-6'>
        <h1 className='text-2xl font-bold'>Project Board</h1>

        {responseError && (
          <Error message={'you have no permission to delete'} />
        )}
        {canDrop && (
          <button
            ref={drop}
            className={`${
              isActive ? ' bg-opacity-100' : canDrop ? 'bg-opacity-60' : ''
            } absolute right-10 text-2xl text-white bg-red-500 p-4 rounded`}
          >
            remove
          </button>
        )}
      </div>
      <div className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
        {stageNames.map((el, index) => (
          <StageItem
            key={index}
            stageName={el}
            stageNames={stageNames}
            isError={isError}
            isLoading={isLoading}
            error={error}
            getProjectData={getProjectData}
            userEmail={userEmail}
            toggleVisible={toggleVisible}
            visible={visible}
            onDrop={(item) => handleDrop(index, item)}
          />
        ))}
      </div>
    </>
  )
}

export default Projects
