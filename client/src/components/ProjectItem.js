import moment from 'moment'
import { useDrag } from 'react-dnd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDeleteProjectMutation } from '../features/projects/projectsApi'
const ProjectItem = ({ project, userEmail }) => {
  const { id, name, Creator, assignedTeam, timestamp, stage } = project || {}
  const { avatar, email } = Creator
  const { label:teamName,bgColor, textColor } = assignedTeam || {}
  const [deleteProject] = useDeleteProjectMutation()
  const [border, setBorder] = useState(false)
  const { search } = useSelector((state) => state.projects)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: stage,
      item: { id, Creator,stage },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [id, Creator,stage]
  )
  useEffect(() => {
    if (search.length > 0) {
      const match = search.find((el) => el.id == id)
      if (match) {
        setBorder(true)
      } else {
        setBorder(false)
      }
    } else {
      setBorder(false)
    }
  }, [search])

  const handleRemove = () => {
    deleteProject({ id, userEmail })
  }
  return (
    <>
      <div
        ref={drag}
        className={`${
          border && 'border-2 border-blue-500'
        } relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100`}
        draggable='true'
      >
        {userEmail === email && stage === 'backlog' ? (
          <button
            onClick={handleRemove}
            className='absolute top-0 right-2  items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex'
          >
            <img src='https://img.icons8.com/external-those-icons-flat-those-icons/24/000000/external-Remove-interface-those-icons-flat-those-icons.png' />
          </button>
        ) : (
          <></>
        )}
        <span
          className={`flex items-center h-6 px-3 text-xs font-semibold ${bgColor} ${textColor} rounded-full`}
        >
          {teamName}
        </span>
        <h4 className='mt-3 text-sm font-medium'>{name}</h4>
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
            {moment(timestamp).format('MMM Do')}
            <span className='ml-1 leading-none'></span>
          </div>
          <img className='w-6 h-6 ml-auto rounded-full' src={avatar} />
        </div>
      </div>
    </>
  )
}

export default ProjectItem
