import { Modal } from 'react-daisyui'
import { Button, Label, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import isValidEmail from '../../utils/isValidEmail'
import { useGetUserQuery } from '../../features/users/usersApi'
import Error from '../ui/Error'
import { useSelector } from 'react-redux'
import {
  useEditTeamMutation,
  useGetTeamQuery,
} from '../../features/team/teamApi'
const AddTeamModal = ({ setResponseError,responseError,visible, toggleVisible, assignedUsers, id,unValidEmail,setunValidEmail}) => {
  const { user: loggedInUser } = useSelector((state) => state.auth) || {}
  const { email: myEmail } = loggedInUser || {}
  const [email, setEmail] = useState('')
  const [userCheck, setUserCheck] = useState(false)
  const [teamCheck, setTeamCheck] = useState(false)
  const [disable, setDisable] = useState(true)
  const {
    data: user,
    isSuccess,
    isError,
    refetch,
  } = useGetUserQuery(email, {
    skip: !userCheck,
  })
  const [editTeam, { isSuccess: isEditSuccess }] = useEditTeamMutation()
  useEffect(() => {
    refetch()
    if (user?.length === 0) {
      setResponseError('This user does not exist!')
      setDisable(true)
    }
    if (email === myEmail) {
      setResponseError('You already exist')
      setDisable(true)
    }
    if (email !== myEmail && assignedUsers.includes(email)) {
      setResponseError('user already  exist')

      setDisable(true)
    }
    if (
      user?.length > 0 &&
      email !== myEmail &&
      !assignedUsers.includes(email)
    ) {
      setResponseError('')
      setDisable(false)
    }
  }, [responseError, email, user])
  useEffect(() => {
    if (isEditSuccess) {
      setunValidEmail('')
      setResponseError('')
      toggleVisible()
    }
  }, [isEditSuccess])
  const debounceHandler = (fn, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  const doSearch = (value) => {
    if (isValidEmail(value)) {
      // check user API
      setUserCheck(true)
      setTeamCheck(true)
      setEmail(value)
    }
  }

  const handleSearch = debounceHandler(doSearch, 300)

  const handleSubmit = (e) => {
    e.preventDefault()
    editTeam({
      id,
      data: {
        assignedUsers: [...assignedUsers, email],
      },
    })
  }
  handleSearch(unValidEmail)
  return (
    <>
      <Modal open={visible} onClickBackdrop={toggleVisible}>
        <Modal.Header className='font-bold'>Add team member</Modal.Header>
        {responseError ? <Error message={responseError} /> : <></>}
        <Modal.Body>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='teamName1' value='Email' />
              </div>
              <TextInput
                id='teamEmail1'
                type='email'
                placeholder='team@email.com'
                value={unValidEmail}
                required={true}
                onChange={(e) =>   setunValidEmail(e.target.value)}
              />
            </div>
            <Button type='submit' disabled={disable}>
              Submit
            </Button>
          </form>{' '}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddTeamModal
