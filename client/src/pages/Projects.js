import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AddProjectModal from '../components/modals/AddProjectModal'
import { useGetProjectsQuery } from '../features/projects/projectsApi'
import Error from '../components/ui/Error'
import ProjectItem from '../components/ProjectItem'
const Projects = () => {
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
  const [backlogContentCount, setBacklogContentCount] = useState(0)
  const [readyContentCount, setReadyContentCount] = useState(0)
  const [doingContentCount, setDoingContentCount] = useState(0)
  const [reviewContentCount, setReviewContentCount] = useState(0)
  const [blockedContentCount, setBlockedContentCount] = useState(0)
  const [doneContentCount, setDoneContentCount] = useState(0)
  useEffect(() => {
    if (!isLoading && !isError && getProjectData?.length > 0) {
      const backlogCount = getProjectData.filter((el) => el.stage === 'backlog')
      const readyCount = getProjectData.filter((el) => el.stage === 'ready')
      const doingCount = getProjectData.filter((el) => el.stage === 'doing')
      const reviewCount = getProjectData.filter((el) => el.stage === 'review')
      const blockedCount = getProjectData.filter((el) => el.stage === 'blocked')
      const doneCount = getProjectData.filter((el) => el.stage === 'done')
      setBacklogContentCount(backlogCount.length)
      setReadyContentCount(readyCount.length)
      setDoingContentCount(doingCount.length)
      setReviewContentCount(reviewCount.length)
      setBlockedContentCount(blockedCount.length)
      setDoneContentCount(doneCount.length)
    }
  }, [backlogContentCount,readyContentCount,doingContentCount,blockedContentCount,doneContentCount, isLoading, isError, isSuccess, getProjectData])
  const toggleVisible = () => {
    setVisible(!visible)
  }

  let backlogContent

  if (isLoading) {
    backlogContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    backlogContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    backlogContentCount === 0
  ) {
    backlogContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    backlogContentCount > 0
  ) {
    backlogContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'backlog')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }

  let readyContent

  if (isLoading) {
    readyContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    readyContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    readyContentCount === 0
  ) {
    readyContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    readyContentCount > 0
  ) {
    readyContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'ready')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }

  let doingContent

  if (isLoading) {
    doingContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    doingContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    doingContentCount === 0
  ) {
    doingContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    doingContentCount > 0
  ) {
    doingContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'doing')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }



  let reviewContent

  if (isLoading) {
    reviewContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    reviewContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    reviewContentCount === 0
  ) {
    reviewContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    reviewContentCount > 0
  ) {
    reviewContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'review')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }

  let blockedContent

  if (isLoading) {
    blockedContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    blockedContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    blockedContentCount === 0
  ) {
    blockedContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    blockedContentCount > 0
  ) {
    blockedContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'blocked')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }


  let doneContent

  if (isLoading) {
    doneContent = <h4 className='m-2 text-center'>Loading...</h4>
  } else if (!isLoading && isError) {
    doneContent = (
      <h4 className='m-2 text-center'>
        <Error message={error?.data} />
      </h4>
    )
  } else if (
    (!isLoading && !isError && getProjectData?.length === 0) ||
    doneContentCount === 0
  ) {
    doneContent = <h4 className='m-2 text-center'>No found!</h4>
  } else if (
    !isLoading &&
    !isError &&
    getProjectData?.length > 0 &&
    doneContentCount > 0
  ) {
    doneContent = getProjectData
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((el) => el.stage === 'done')
      .map((project) => (
        <ProjectItem project={project} key={project.id} userEmail={userEmail} />
      ))
  }
  return (
    <>
      <div className='px-10 mt-6'>
        <h1 className='text-2xl font-bold'>Project Board</h1>
      </div>
      <div className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Backlog</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {backlogContentCount}
            </span>
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
            <AddProjectModal visible={visible} toggleVisible={toggleVisible} />
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>
            {backlogContent}
          </div>
        </div>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Ready</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {readyContentCount}
            </span>
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>{readyContent}</div>
        </div>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Doing</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {doingContentCount}
            </span>
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>
            {doingContent}
          </div>
        </div>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Review</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {reviewContentCount}
            </span>
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>
            {reviewContent}
          </div>
        </div>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Blocked</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {blockedContentCount}
            </span>
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>
            {blockedContent}
          </div>
        </div>
        <div className='flex flex-col flex-shrink-0 w-72'>
          <div className='flex items-center flex-shrink-0 h-10 px-2'>
            <span className='block text-sm font-semibold'>Done</span>
            <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
              {doneContentCount}
            </span>
          </div>
          <div className='flex flex-col pb-2 overflow-auto'>
            {doneContent}
          </div>
        </div>
        <div className='flex-shrink-0 w-6'></div>
      </div>
    </>
  )
}

export default Projects
