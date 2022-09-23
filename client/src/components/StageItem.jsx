import { useEffect, useState } from 'react'
import Error from './ui/Error'
import AddProjectModal from './modals/AddProjectModal'
import ProjectItem from './ProjectItem'
const StageItem = ({
  isLoading,
  isError,
  error,
  getProjectData,
  stageName,
  toggleVisible,
  visible,
  userEmail,
}) => {
  const [contentCount, setContentCount] = useState(0)

  useEffect(() => {
    if (!isLoading && !isError && getProjectData?.length > 0) {
      const count = getProjectData.filter((el) => el.stage === stageName)
      setContentCount(count.length)
    }
  }, [isLoading, isError, getProjectData])
  let content
  if (isLoading) {
    content = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    content = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    contentCount === 0
  ) {
    content = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    contentCount > 0
  ) {
    content = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === stageName)
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }
  return (
    <div className='flex flex-col flex-shrink-0 w-72'>
      <div className='flex items-center flex-shrink-0 h-10 px-2'>
        <span className='block text-sm font-semibold'>
          {stageName !== '' &&
            `${stageName[0].toUpperCase()}${stageName.slice(1)}`}{' '}
        </span>
        <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
          {contentCount}
        </span>
        <button
          disabled={stageName !== 'backlog'}
          onClick={toggleVisible}
          className={`${stageName !== 'backlog' ? 'hidden' : ''} flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100`}
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
        <AddProjectModal visible={visible} toggleVisible={toggleVisible} />
      </div>
      <div className='flex flex-col pb-2 overflow-auto'>{content}</div>
    </div>
  )
}

export default StageItem
