// CSS Module
import './User.css'

// React Hooks
import React, { useEffect, useState } from 'react'

// To access user state: useSelector
import { useSelector, useDispatch } from 'react-redux'

// To navigate: useNavigate
import { useNavigate } from 'react-router-dom'

// We also need the "selectedUnit". So we want to run "selectUnit" first.
// Later, we will access the "selectedUnit" with the help of useSelector.
import { selectUnit } from '../../features/units/unitSlice'

// We want to access user information when the user logs in. To ensure this, we imported userFill.
import { userFill, bringDates, createAppointment, logout } from '../../features/users/userSlice'

// Initiliaze the Modal from React Modal about hours...
import Modal from 'react-modal'

// To create an animated button:
import { motion } from 'framer-motion'

// Initiliaze the toast from react-toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function User() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, appointmentHours } = useSelector((state) => state.userState)
    const { selectedUnit, isLoading } = useSelector((state) => state.unitsState)

    const today = new Date();
    const formattedDate = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedHour, setSelectedHour] = useState(null)
    const [selectedValue, setSelectedValue] = useState(null)

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

    // root from index.html which is in the public folder, is our id on its div!
    // All react components are binded into this div.
    // Therefore, we bind this Modal usage inside the div with the root id.
    Modal.setAppElement('#root');

    // user information check:
    useEffect(() => {

        if (!user) {
            navigate('/login')
        }

    }, [user])

    // useEffect: the part that will work when "the page is refreshed"
    useEffect(() => {

        const selectedUnitId = localStorage.getItem('selectedUnit')

        if (!selectedUnitId) {
            navigate('/')
        }

        if (!user) {
            navigate('/login')
        }

        dispatch(selectUnit(JSON.parse(selectedUnitId)))
        dispatch(userFill())
        dispatch(bringDates(JSON.parse(selectedUnitId)))

    }, [])

    // try "data" or "value" for the key...
    const handleSetAppointment = (data) => {
        //console.log(value);
        setModalIsOpen(true);
        setSelectedHour(data.text)
        setSelectedValue(data)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const addAppointment = () => {
        //console.log(selectedValue, formattedDate, user.email, selectedUnit.id);

        const data = {
            unitId: selectedUnit.id,
            unitName: selectedUnit.name,
            hourValue: selectedValue.value,
            hourText: selectedValue.text,
            date: formattedDate,
            email: user.email
        }

        dispatch(createAppointment(data))
        setModalIsOpen(false)

        toast.success("Your appointment has been created!")
        setTimeout(() => {
            navigate('/appointment')
        }, 1000)
    }

    const handleGo = () => {

        navigate('/appointment')

    }

    const handleLogout = () => {

        dispatch(logout());
        navigate('/')

    }

    return (
        <>
            <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={closeModal} >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 5 }} >
                    <p><strong>Now, you make an appointment</strong></p>
                    <p>for <strong>{selectedUnit?.name}</strong></p>
                    <p>and <strong>{formattedDate}</strong> & <strong>{selectedHour}</strong></p>
                    <p>Do you confirm?</p>
                    <p className='d-flex justify-content-center'>
                        <button className='btn btn-outline-danger btn-sm m-4' onClick={closeModal} >Cancel!</button>
                        <button className='btn btn-outline-success btn-sm m-4' onClick={addAppointment} >Admit it!</button>
                    </p>
                </motion.div>
            </Modal>

            <div className='user'>

                <motion.div className="alert alert-secondary" role="alert" initial={{ y: "-100vh" }} animate={{ y: 0 }} transition={{ duration: 2 }}>
                    {user && <p>HELLO <strong>{user.email}</strong></p>}
                    {selectedUnit && <p>Make an appointment for <strong className='bold'>{selectedUnit.name}</strong></p>}
                    <p className='d-flex justify-content-between'>
                        <button className='btn btn-outline-primary btn-sm mx-4' onClick={handleGo}>My Appointments</button>
                        <button className='btn btn-outline-danger btn-sm mx-4' onClick={handleLogout}>Logout</button>
                    </p>
                </motion.div>

                <div className="alert alert-primary" role="alert">
                    <h3>Select Appointment Time</h3>
                    <div className="mt-3">

                        <p>Make an appointment for {formattedDate}</p>
                        <div className='row mt-4'>
                            {/* <div>
                            {
                                dataSets.map(data=>(
                                    <button className='btn btn-outline-primary btn-sm m-2'>{data.text}</button>
                                ))
                            }
                        </div> */}

                            <div className='col-6 container'>
                                {/* <button className='btn btn-outline-dark btn-sm m-4'>08:00</button>
                            <button className='btn btn-outline-dark btn-sm m-4 disabled'>09:00</button> */}
                                {
                                    appointmentHours?.map(data => (
                                        <button key={data.value} className={`btn btn-outline-dark btn-sm m-4 ${data.passive === true ? 'disabled' : ''}`} onClick={() => handleSetAppointment(data)}>{data.text}</button>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
