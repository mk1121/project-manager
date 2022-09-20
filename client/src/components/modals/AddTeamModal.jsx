import { Modal } from 'react-daisyui'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAddTeamMutation } from '../../features/team/teamApi'
import { useGetAllUserQuery } from '../../features/users/usersApi'
const AddTeamModal = ({ id,visible, toggleVisible }) => {
console.log(' 🔔 8 👉 AddTeamModal.jsx 👉 id:', id);
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [catagory, setCatagory] = useState()
  const [color, setColor] = useState()
console.log(' 🔔 11 👉 AddTeamModal.jsx 👉 catagory:', catagory);
  const [member, setMember] = useState([])
  const user = useSelector((state) => state.auth.user)
  const [addTeam, { isLoading, isError, isSuccess }] = useAddTeamMutation()
  const { data: userList, isSuccess: isUserListSuccess } = useGetAllUserQuery()
  useEffect(() => {
    if (!isError && isSuccess) {
      setColor('')
      setName('')
      setDescription('')
      toggleVisible()
    }
  }, [isError, isSuccess])
  const handleSubmit = (e) => {
    e.preventDefault()
    addTeam({
      data: {
        name,
        description,
        catagory:{type:catagory.value,color:catagory.color},
        assignedUsers: [user.email,...member.map(el => el.value)],
        timestamp: new Date().getTime(),
      },
    })
  }
  const catagoryOptions = [
  {  value:'dev', label: 'Dev',color:'red' },
  {  value:'design',label: 'Design',color:'pink' },
  {  value:'security',label: 'Security',color:'blue' }  ]
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
        <Modal.Header className='font-bold'>Add team</Modal.Header>

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
                  <Label htmlFor='colors' value='Select colors' />
                </div>
                {/* <Select */}
                {/*   id='colors' */}
                {/*   required={true} */}
                {/*   value={color} */}
                {/*   onChange={(e) => setColor(e.target.value)} */}
                {/* > */}
                {/*   <option>Dev</option> */}
                {/*   <option>Blue</option> */}
                {/*   <option>Pink</option> */}
                {/*   <option>Yellow</option> */}
                {/*   <option>Gray</option> */}
                {/*   <option>Green</option> */}
                {/*   <option>Purple</option> */}
                {/* </Select> */}
                <Select
              defaultValue={catagoryOptions[2]}
              name='catagory'
              options={catagoryOptions}
              onChange={e => setCatagory(e)}
              className='basic-multi-select'
              classNamePrefix='select'
                />
              </div>
            </div>
            <Select
              defaultValue={[memberOptions[2], memberOptions[3]]}
              isMulti
              name='member'
              onChange={(e) => setMember([...e])}
              options={memberOptions}
              className='basic-multi-select'
              classNamePrefix='select'
            />
            <Button type='submit'>Submit</Button>
          </form>{' '}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddTeamModal
