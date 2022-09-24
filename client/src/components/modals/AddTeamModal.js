import { Modal, Button, Input } from 'react-daisyui'
import Error from '../ui/Error'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useAddTeamMutation,
  useEditTeamMutation,
} from '../../features/team/teamApi'
import {
  useGetProjectsQuery,
  useEditProjectsMutation,
} from '../../features/projects/projectsApi'
import { useGetAllUserQuery } from '../../features/users/usersApi'
const AddTeamModal = ({ btnAction, team, visible, toggleVisible }) => {
  const {
    id: teamId,
    name: teamName,
    color: teamColor,
    description: teamDescription,
    assignedUsers: teamAssignedUsers,
  } = team || {}

  const [teamActionName, setTeamActionName] = useState('Add')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [description, setDescription] = useState('')
  const [color, setColor] = useState({
    value: '',
    label: 'select a color',
  })
  const [member, setMember] = useState([])
  const [creator, setCreator] = useState('')
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}

  const {
    data: getProjectData,
    error: isProjecterror,
  } = useGetProjectsQuery(userEmail)
  const [addTeam, { isLoading, isError, isSuccess }] = useAddTeamMutation()
  const [
    editTeam,
    {
      isLoading: isEditLoading,
      isError: isEditError,
      isSuccess: isEditSuccess,
    },
  ] = useEditTeamMutation()

  const [
    editProject,
    {
      isLoading: isEditProjectLoading,
      isError: isEditProjectError,
      isSuccess: isEditProjectSuccess,
    },
  ] = useEditProjectsMutation()
  const { data: userList, isSuccess: isUserListSuccess } = useGetAllUserQuery()

  if (btnAction === 'add') {
  }

  const colorOptions = [
    { label: 'red', value: 'red' },
    { value: 'green', label: 'green' },
    { value: 'yellow', label: 'yellow' },
    { value: 'purple', label: 'purple' },
    { value: 'gray', label: 'gray' },
    { value: 'blue', label: 'blue' },
  ]
  useEffect(() => {
    if (visible) {
      if (btnAction === 'add') {
        if (color.value !== '') {
          setError(null)
        }
        if (!visible) {
          setColor({
            value: '',
            label: 'select a color',
          })
          setName('')
          setDescription('')
          setError(null)
        }
      }
    }
  }, [visible, color])
  useEffect(() => {
    if (visible) {
      if (btnAction === 'edit') {
        setCreator(teamAssignedUsers[0])
        setTeamActionName('Edit')
        setName(teamName)
        setDescription(teamDescription)
        setColor({
          value: teamColor.value,
          label: teamColor.label,
        })
        const memberList = teamAssignedUsers
          .filter((el, index) => index !== 0)
          .map((el) => {
            return {
              label: el.name,
              value: el.email,
            }
          })
        setMember(memberList)
      }
    }
  }, [btnAction, error, visible])
  useEffect(() => {
    if ((!isError && isSuccess) || (!isEditError && isEditSuccess)) {
      if (btnAction === 'add') {
        setColor({
          value: '',
          label: 'select a color',
        })

        setName('')
        setDescription('')
        setError(null)
      }
      toggleVisible()
    }
  }, [isError, isSuccess, isEditError, isEditSuccess])
  const handleSubmit = (e) => {
    e.preventDefault()
    if (btnAction === 'add') {
      if (color.value === '') {
        setError('Please select a Color!')
      } else if (color.value !== '') {
        addTeam({
          userEmail,
          data: {
            name,
            description,
            color: {
              value: color.value,
              label: color.label,
              bgColor: `bg-${color.value}-100`,
              textColor: `text-${color.value}-500`,
            },
            assignedUsers: [
              { name: user.name, email: user.email },
              ...member.map((el) => {
                return { name: el.label, email: el.value }
              }),
            ],
            timestamp: new Date().getTime(),
          },
        })
      }
    }
    if (btnAction === 'edit') {
      const editingProject =
        !isProjecterror &&
        getProjectData?.filter((el) => el.assignedTeam.value === teamId)
      editingProject?.map((el) => {
        editProject({
          id: el.id,
          data: {
            assignedTeam: {
              label: name,
              value: teamId,
              bgColor: `bg-${color.value}-100`,
              textColor: `text-${color.value}-500`,
              assignedUsers: [
                ...el.assignedTeam.assignedUsers,
                ...member.map((el) => {
                  return { name: el.label, email: el.value }
                }),
              ],
            },
          },
          userEmail,
        })
      })
      editTeam({
        id: teamId,
        userEmail,
        data: {
          name,
          description,
          color: {
            value: color.value,
            label: color.label,
            bgColor: `bg-${color.value}-100`,
            textColor: `text-${color.value}-500`,
          },
          assignedUsers: [
            { name: creator.name, email: creator.email },
            ...member.map((el) => {
              return { name: el.label, email: el.value }
            }),
          ],
          timestamp: new Date().getTime(),
        },
      })
    }
  }
  const memberOptions =
    isUserListSuccess &&
    userList
      .filter((el) => {
        return el.email !== creator.email
      })
      .map((el) => {
        return {
          value: el.email,
          label: el.name,
        }
      })

  return (
    <>
      <Modal open={visible} onClickBackdrop={toggleVisible}>
        <Modal.Header className='font-bold'>{teamActionName} team</Modal.Header>

        {error && <Error message={error} />}
        <Modal.Body>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <div className='mb-2 block'>
                <label className='label'>
                  <span className='label-text'>Team Name</span>
                </label>
              </div>
              <Input
                id='teamName1'
                type='text'
                value={name}
                placeholder='team name'
                required={true}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <label className='label'>
                  <span className='label-text'>Description</span>
                </label>
              </div>
              <Input
                id='teamDescription1'
                type='text'
                required={true}
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <div id='select'>
                <div className='mb-2 block'>
                  <label htmlFor='colors' className='label'>
                    <span className='label-text'>Select Color</span>
                  </label>
                </div>
                <Select
                  value={color}
                  name='color'
                  options={colorOptions}
                  onChange={(e) => setColor(e)}
                  className='basic-multi-select'
                  classNamePrefix='Select Color'
                />
              </div>
            </div>

            <div id='select'>
              <div className='mb-2 block'>
                <label htmlFor='member' className='label'>
                  <span className='label-text'>Select Member</span>
                </label>
              </div>
              <Select
                value={member}
                isMulti
                name='member'
                onChange={(e) => setMember([...e])}
                options={memberOptions}
                className='basic-multi-select'
                classNamePrefix='select'
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>{' '}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddTeamModal
