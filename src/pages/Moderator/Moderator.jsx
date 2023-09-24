// CSS Module
import './Moderator.css'

// React Hooks
import React, { useEffect, useState } from 'react'

// useSelector: to access administrative information
// useDispatch: to run selectUnit slice
import { useDispatch, useSelector } from 'react-redux'

// useNavigate: in order to give direction
import { useNavigate } from 'react-router-dom'

// Initialize the slice of "selectUnit"
import { selectUnit } from '../../features/units/unitSlice'

// Initialize the slice of "logout"
import { logout, bringLast10unitAppointment, changeStatus } from '../../features/admin/adminSlice'

// To change the password, we will use the methods directly in Firebase without creating a Service or Slice.
// That's why we need "getAuth" in the auth folder in Firebase. Thus, we will be able to create an auth reference.
// And with this reference we will access the firebase information of the logged in user.
import { getAuth, updatePassword } from 'firebase/auth'

// We also want to issue a warning message when the user changes their password. For this reason:
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Process of Transferring Pending Appointments to Modal by using Modal
import Modal from 'react-modal'

// Design an animated figure for "appointments"
import { AnimatePresence, motion } from 'framer-motion'
import { Delay } from '../../components/Delay';

const container = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    type: "tween",
    duration: 0.5
  }
}

const Item = ({ index, children }) => (
  <Delay delay={index * 300}>
    {children}
  </Delay>
);


export default function Moderator() {

  const { admin, isSuccess, appointments } = useSelector((state) => state.adminState)
  const { selectedUnit, isLoading } = useSelector((state) => state.unitsState)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(false)

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#bde0fe'
    },
  };

  Modal.setAppElement('#root');

  const handleAppointmentEdit = (appointment) => {
    setModalIsOpen(true)
    setSelectedAppointment(appointment)
    //console.log(appointment);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  const handleClick = () => {

    console.log("user", user);

    //console.log("newPassword", newPassword);
    //console.log("newPasswordRepeat", newPasswordRepeat);

    if (newPassword === newPasswordRepeat) {
      updatePassword(user, newPassword).then(() => {
        toast.success("Your password has been changed.")
      }).catch((error) => {
        toast.error("Something went wrong. Log Out and Try Again!")
      })
    }
    // If the user is online for a long time, the password must be changed after logging out and logging in.
    // Otherwise, it will get an error from the catch structure. Let's think of it like the Firebase protocol.
  }

  const handleLogout = () => {

    dispatch(logout());
    navigate('/')

  }

  const appointmentChangeStatus = (appointmentId, status) => {
    //console.log(appointmentId, status);

    const data = {
      documentId: appointmentId,
      status: status,
      statusColor: status === "Accepted" ? "success" : "danger"
    }

    dispatch(changeStatus(data));

    setModalIsOpen(false);

    toast.success("Appointment Status Changed!")

  }

  // Now, we need to create a reference and access the user. Because updatePassword will work with user.
  const auth = getAuth();

  const user = auth.currentUser;

  useEffect(() => {

    const selectedUnitId = localStorage.getItem('selectedUnit')

    if (admin) {
      if (admin.authority !== "moderator") {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }

    if (!selectedUnitId) {
      navigate('/')
    }

    dispatch(selectUnit(JSON.parse(selectedUnitId)))
    dispatch(bringLast10unitAppointment(JSON.parse(selectedUnitId)))

  }, [isSuccess])

  return (
    <>

      <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={closeModal}>
        <div>
          <p>For the person with the email address: <strong>{selectedAppointment?.email}</strong></p>
          <p>Waiting for an Appointment about: Date: <strong>{selectedAppointment?.date}</strong> & Hour: <strong>{selectedAppointment?.hourText}</strong></p>
          <p>
            You Can Accept or Cancel
          </p>
          <p className='d-flex justify-content-center'>
            <button className='btn btn-outline-danger btn-sm m-4' onClick={() => appointmentChangeStatus(selectedAppointment?.documentId, "Rejected")}>Cancel</button>
            <button className='btn btn-outline-success btn-sm m-4' onClick={() => appointmentChangeStatus(selectedAppointment?.documentId, "Accepted")}>Admit it</button>
          </p>
        </div>
      </Modal>

      <div className="moderator">

        {/*
      <div>Moderator</div>
      {selectedUnit && <p>{selectedUnit.name}</p>}
      */}
        <div className='alert alert-secondary' role='alert'>
          <span>Welcome to the Moderator Panel for {selectedUnit && <strong>{selectedUnit.name}</strong>}...</span>
          <div className='text-end'>
            {admin && <span className='me-4'>Hello {admin.email}</span>}
            <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="alert alert-primary" role="alert">

          <h3>Change or Reset Your Password</h3>
          <div className="mt-3">

            <div className="row">
              <div className="col-6">
                <p>Moderator: {admin?.email}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <label htmlFor="password" className="form-label">
                  Please, Enter a New Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="New Password Field"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>

              <div className="col-6">
                <label htmlFor="passwordCheck" className="form-label">
                  Please, Enter Your New Password Repeat:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordCheck"
                  name="passwordCheck"
                  placeholder="New Password Field Repeat"
                  onChange={(e) => setNewPasswordRepeat(e.target.value)}
                  value={newPasswordRepeat}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="text-center">
                <button className="btn btn-outline-primary btn-sm" onClick={handleClick}>CHANGE</button>
              </div>
            </div>

          </div>

        </div>

        <div className='alert alert-secondary' role='alert'>
          <h5>Pending Appointments</h5>
          <div className='mt-3'>
            <div className='row mt-4'>
              <ul className='list-group'>
                <AnimatePresence>
                  {
                    appointments && appointments.map((appointment, index) => (
                      <Item key={index} index={index}>
                        <motion.li className='list-group-item d-flex justify-content-between align-items-center' onClick={() => handleAppointmentEdit(appointment)} key={appointment.documentId}>
                          {appointment.email}
                          <span className='badge bg-primary rounded-pill'>{appointment.date} - {appointment.hourText}</span>
                        </motion.li>
                      </Item>
                    ))
                  }
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
