import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import Error from '../ui/Error'
import { Modal, Button, Input } from 'react-daisyui'
import { useGetTeamQuery } from '../../features/team/teamApi'
import { useAddProjectsMutation } from '../../features/projects/projectsApi'

const AddProjectModal = ({ visible, toggleVisible }) => {
  const user = useSelector((state) => state.auth.user)
  const { email } = user
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [assignedTeam, setAssignedTeam] = useState({
    value: '',
    label: 'select a team',
  })

  const { data: teamData, isSuccess: isTeamDataSuccess } =
    useGetTeamQuery(email)
  const [addProject, { isError: isProjectError, isSuccess: isProjectSuccess }] =
    useAddProjectsMutation()
  useEffect(() => {
    if (visible) {
      if (assignedTeam.value !== '') {
        setError(null)
      }
    }
  }, [visible, assignedTeam])
  useEffect(() => {
    if (!visible) {
      setName('')
      setError(null)
      setAssignedTeam({
        value: '',
        label: 'select a team',
      })
    }
  }, [visible])
  useEffect(() => {
    if (!isProjectError && isProjectSuccess) {
      setName('')
      setAssignedTeam({
        value: '',
        label: 'select a team',
      })
      toggleVisible()
    }
  }, [isProjectError, isProjectSuccess])
  const teamAssigned =
    isTeamDataSuccess &&
    teamData.map((el) => {
      return {
        label: el.name,
        value: el.id,
        bgColor: el.color.bgColor,
        textColor: el.color.textColor,
        assignedUsers: el.assignedUsers,
      }
    })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (assignedTeam.value === '') {
      setError('Please select a Team!')
    } else if (assignedTeam.value !== '') {
      addProject({
        userEmail: email,
        data: {
          name,
          assignedTeam: {
            label: assignedTeam.label,
            value: assignedTeam.value,
            bgColor: assignedTeam.bgColor,
            textColor: assignedTeam.textColor,
            assignedUsers: assignedTeam.assignedUsers,
          },
          stage: 'backlog',
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
                <label className='label'>
                  <span className='label-text'>Enter project title</span>
                </label>
              </div>
              <Input
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
                <label className='label'>
                  <span className='label-text'>Select Team</span>
                </label>
              </div>
              <Select
                value={assignedTeam}
                name='assignedTeam'
                options={teamAssigned}
                onChange={(e) => setAssignedTeam(e)}
                className='basic-multi-select'
                classNamePrefix='Select Team'
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
