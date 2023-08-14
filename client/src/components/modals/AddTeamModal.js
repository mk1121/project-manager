import { Modal, Button, Input } from 'react-daisyui'
import Error from '../ui/Error'
import Select from 'react-select'
import { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleTeamName, handleDescription, handleColor, handleMember } from '../../features/team/teamSlice'
import {
  useAddTeamMutation,
  useEditTeamMutation,
} from '../../features/team/teamApi'
import {
  useGetProjectsQuery,
  useEditProjectsMutation,
} from '../../features/projects/projectsApi'
import { useGetAllUserQuery } from '../../features/users/usersApi'
const AddTeamModal = ({ btnAction, setBtnAction, isTeamSuccess, team, visible, toggleVisible, visibleId }) => {
  const {
    id: teamId,
    name: teamNames,
    color: teamColor,
    description: teamDescription,
    assignedUsers: teamAssignedUsers,
  } = team || {}

  console.log(' 🔔 19 👉 AddTeamModal.js 👉 teamNames:', teamNames);
  const { teamName, description, color, member } = useSelector((state) => state.team)
  const dispatch = useDispatch()
  const [teamActionName, setTeamActionName] = useState('Add')
  const [error, setError] = useState(null)
  const [memberOptions, setMemberOptions] = useState([])
  const [creator, setCreator] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}

  const {
    data: getProjectData,
    error: isProjecterror,
  } = useGetProjectsQuery(userEmail)
  const [addTeam, { isError, isSuccess: isAddSuccess }] = useAddTeamMutation()
  const [
    editTeam,
    {
      isError: isEditError,
      isSuccess: isEditSuccess,
    },
  ] = useEditTeamMutation()

  const [
    editProject, { isError: isProjectEditError, isSuccess: isProjectEditSuccess, }
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
        dispatch(handleColor({
          value: '',
          label: 'select a color',
        }))
        dispatch(handleTeamName(''))
        dispatch(handleDescription(''))
        dispatch(handleMember([]))

        const allUsersList = () =>
          isUserListSuccess &&
          userList
            .filter((el) => !el.isFixed)
            .map((el) => {
              return {
                value: el.email,
                label: el.name,
              }
            })


        setMemberOptions(allUsersList)
      }

      if (btnAction === 'edit' && teamId === visibleId) {
        isTeamSuccess && setCreator(teamAssignedUsers?.map((el) => {
          if (el?.isFixed === true)
            return {
              email: el?.email,
              name: el?.name,
            }
        }))

        const allUsersList = () =>
          isUserListSuccess &&
          userList
            .filter((el) => !el.isFixed)
            .map((el) => {
              return {
                value: el.email,
                label: el.name,
              }
            })


        setMemberOptions(allUsersList)
        dispatch(handleTeamName(teamNames))
        dispatch(handleDescription(teamDescription))
        dispatch(handleColor({
          value: teamColor?.value,
          label: teamColor?.label,
        }))
        const memberList = isTeamSuccess && teamAssignedUsers
          .filter((item) => item.email !== creator?.email)
          .map((el) => {
            return {
              label: el?.name,
              value: el?.email,
            }
          })
        dispatch(handleMember(memberList))
      }
    }

  }, [btnAction, visibleId, visible])
  // useEffect(() => {
  //   if (visible) {
  //     if (btnAction === 'add') {
  //       if (color.value !== '') {
  //         setError(null)
  //       }
  //       if (!visible) {
  //         setColor({
  //           value: '',
  //           label: 'select a color',
  //         })
  //         setName('')
  //         setDescription('')
  //         setError(null)
  //       }
  //     }
  //   }
  // }, [visible, color])

  // useEffect(() => {
  //   if (visible) {
  //     if (btnAction === 'edit') {
  //       console.log(' 🔔 92 👉 AddTeamModal.js 👉 btnAction:', btnAction);
  //       setCreator(teamAssignedUsers[0])
  //       setTeamActionName('Edit')
  //       setName(teamName)
  //       setDescription(teamDescription)
  //       setColor({
  //         value: teamColor.value,
  //         label: teamColor.label,
  //       })
  //       const memberList = teamAssignedUsers
  //         .map((el, index) => {
  //           if (el?.email === creator?.email && el?.isFixed === true) return null
  //           return {
  //             label: el.name,
  //             value: el.email,
  //           }
  //         })
  //       setMember(memberList)
  //     }
  //   }
  // }, [btnAction, error, visible])

  // useEffect(() => {
  //   if ((!isError && isSuccess) || (!isEditError && isEditSuccess)) {
  //     if (btnAction === 'add') {
  //       setColor({
  //         value: '',
  //         label: 'select a color',
  //       })

  //       setName('')
  //       setDescription('')
  //       setError(null)
  //     }
  //     toggleVisible()
  //   }
  // }, [isError, isSuccess, isEditError, isEditSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (btnAction === 'add') {
      if (color.value === '') {
        setError('Please select a Color!')
      } else if (color.value !== '') {
        addTeam({
          userEmail,
          data: {
            name: teamName,
            description,
            color: {
              value: color.value,
              label: color.label,
              bgColor: `bg-${color.value}-100`,
              textColor: `text-${color.value}-500`,
            },
            assignedUsers: [
              { name: user.name, email: user.email, isFixed: true },
              ...member.map((el) => {
                return { name: el?.label, email: el?.value }
              }),
            ],
            timestamp: new Date().getTime(),
          },
        })
        isAddSuccess &&

          // handleTeamName('')
          dispatch(handleTeamName(''))
        // setDescription('')
        dispatch(handleDescription(''))
        setError(null)

        dispatch(handleMember([]))
        // setMember([])
        toggleVisible()
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
              label: teamName,
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
          teamName,
          description,
          color: {
            value: color.value,
            label: color.label,
            bgColor: `bg-${color.value}-100`,
            textColor: `text-${color.value}-500`,
          },
          assignedUsers: [
            { name: creator.name, email: creator.email, isFixed: true },
            ...member.map((el) => {
              return { name: el?.label, email: el?.value }
            }),
          ],
          timestamp: new Date().getTime(),
        },
      })
      isEditSuccess &&

        // handleTeamName('')
        dispatch(handleTeamName(''))
      dispatch(handleDescription(''))
      // setDescription('')
      setError(null)

      dispatch(handleMember([]))
      // setMember([])
      setBtnAction("")
      toggleVisible()
    }
  }
  // const memberOptions =
  //   isUserListSuccess &&
  //   userList
  //     .filter((el) => el.email !== creator?.email)
  //     .filter((el) => el.email !== userEmail)
  //     .map((el) => {
  //       return {
  //         value: el.email,
  //         label: el.name,
  //       }
  //     })

  return (
    <>
      <Modal open={visible} onClickBackdrop={toggleVisible}>
        <Modal.Header className='font-bold'>{btnAction} team</Modal.Header>

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
                value={teamName}
                placeholder='team name'
                required={true}
                onChange={(e) => dispatch(handleTeamName(e.target.value))}
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
                onChange={(e) => dispatch(handleDescription(e.target.value))}
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
                  onChange={(e) => dispatch(handleColor(e))}
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
                onChange={(e) => dispatch(handleMember([...e]))}
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
