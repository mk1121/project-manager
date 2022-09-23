import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import Error from '../ui/Error'
import { Modal } from 'react-daisyui'
import { useGetTeamQuery } from '../../features/team/teamApi'
import { useAddProjectsMutation } from '../../features/projects/projectsApi'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'

const AddProjectModal = ({ visible, toggleVisible }) => {
  const user = useSelector((state) => state.auth.user)
  const { email } = user
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [catagory, setCatagory] = useState({
    value: '',
    label: 'select a catagory',
    color: '',
  })

  const { data: teamData, isSuccess: isTeamDataSuccess } =
    useGetTeamQuery(email)
  const [addProject, { isError: isProjectError, isSuccess: isProjectSuccess }] =
    useAddProjectsMutation()
  useEffect(() => {
    if (visible) {
      if (catagory.value !== '') {
        setError(null)
      }
    }
  }, [visible,catagory])
  useEffect(() => {
    if (!visible) {
      setName('')
      setError(null)
      setCatagory({
        value: '',
        label: 'select a catagory',
        color: '',
      })
    }
  }, [visible])
  useEffect(() => {
    if (!isProjectError && isProjectSuccess) {
      setName('')
      setCatagory({
        value: '',
        label: 'select a catagory',
        color: '',
      })
      toggleVisible()
    }
  }, [isProjectError, isProjectSuccess])
  const teamCatagory =
    isTeamDataSuccess &&
    teamData.map((el, index) => {
      return {
        label: el.catagory.type,
        value: index + 1,
        color: el.catagory.color,
        assignedUsers: el.assignedUsers,
      }
    })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (catagory.value === '') {
      setError('Please select a Catagory!')
    } else if (catagory.value !== '') {
      addProject({
        userEmail: email,
        data: {
          name,
          catagory: {
            label: catagory.label,
            value: catagory.label,
            color: catagory.color,
          },
          stage: 'backlog',
          assignedUsers: catagory.assignedUsers,
          Creator: user,
          timestamp: new Date().getTime(),
        },
      })
    }
  }

  return (
    <>
      <Modal open={visible} onClickBackdrop={toggleVisible}>
        <Modal.Header className='font-bold'>Add team</Modal.Header>

        <Modal.Body>
          {error && <Error message={error} />}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='teamName1' value='Enter project title' />
              </div>
              <TextInput
                id='teamName1'
                type='text'
                value={name}
                placeholder='enter project title'
                required={true}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div id='select'>
              <div className='mb-2 block'>
                <Label htmlFor='colors' value='Select Catagory' />
              </div>
              <Select
                value={catagory}
                name='catagory'
                options={teamCatagory}
                onChange={(e) => setCatagory(e)}
                className='basic-multi-select'
                classNamePrefix='Select Catagory'
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>{' '}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddProjectModal
