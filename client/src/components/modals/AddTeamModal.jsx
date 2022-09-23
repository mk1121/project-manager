import { Modal } from 'react-daisyui'
import Error from '../ui/Error'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useAddTeamMutation,
  useEditTeamMutation,
} from '../../features/team/teamApi'
import { useGetAllUserQuery } from '../../features/users/usersApi'
const AddTeamModal = ({ btnAction, team, visible, toggleVisible }) => {
  const {
    id: teamId,
    name: teamName,
    catagory: teamCatagory,
    description: teamDescription,
    assignedUsers: teamAssignedUsers,
  } = team || {}
  const [teamActionName, setTeamActionName] = useState('Add')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [description, setDescription] = useState('')
  const [catagory, setCatagory] = useState({
    value: '',
    label: 'select a catagory',
    color: '',
  })
  const [color, setColor] = useState()
  const [member, setMember] = useState([])
  const user = useSelector((state) => state.auth.user)
  const { email: userEmail } = user || {}
  const [addTeam, { isLoading, isError, isSuccess }] = useAddTeamMutation()
  const [
    editTeam,
    {
      isLoading: isEditLoading,
      isError: isEditError,
      isSuccess: isEditSuccess,
    },
  ] = useEditTeamMutation()
  const { data: userList, isSuccess: isUserListSuccess } = useGetAllUserQuery()

  if (btnAction === 'add') {
  }

  const catagoryOptions = [
    { value: 'dev', label: 'dev', color: 'red' },
    { value: 'design', label: 'design', color: 'pink' },
    { value: 'security', label: 'security', color: 'blue' },
  ]
  useEffect(() => {
    if (visible) {
      if (btnAction === 'add') {
        if (catagory.value !== '') {
          setError(null)
        }
        if (!visible) {
          setColor('')
          setName('')
          setCatagory({
            value: '',
            label: 'select a catagory',
            color: '',
          })
          setDescription('')
          setError(null)
        }
      }
    }
  }, [visible, catagory])
  useEffect(() => {
    if (visible) {
      if (btnAction === 'edit') {
        setTeamActionName('Edit')
        setName(teamName)
        setDescription(teamDescription)
        setCatagory({
          value: teamCatagory.type,
          label: teamCatagory.type,
          color: teamCatagory.color,
        })
        const memberList = teamAssignedUsers
          .filter((el) => el.email !== user.email)
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
        setColor('')
        setCatagory({
          value: '',
          label: 'select a catagory',
          color: '',
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
      if (catagory.value === '') {
        setError('Please select a Catagory!')
      } else if (catagory.value !== '') {
        addTeam({
          userEmail,
          data: {
            name,
            description,
            catagory: { type: catagory.value, color: catagory.color },
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
      editTeam({
        id: teamId,
        userEmail,
        data: {
          name,
          description,
          catagory: { type: catagory.value, color: catagory.color },
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
  const memberOptions =
    isUserListSuccess &&
    userList
      .filter((el) => el.email !== user.email)
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
                <Label htmlFor='teamName1' value='Team Name' />
              </div>
              <TextInput
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
                <Label htmlFor='teamDescription1' value='Description' />
              </div>
              <TextInput
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
                  <Label htmlFor='colors' value='Select Catagory' />
                </div>
                <Select
                  value={catagory}
                  name='catagory'
                  options={catagoryOptions}
                  onChange={(e) => setCatagory(e)}
                  className='basic-multi-select'
                  classNamePrefix='Select Catagory'
                />
              </div>
            </div>

            <div id='select'>
              <div className='mb-2 block'>
                <Label htmlFor='member' value='Select Member' />
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
