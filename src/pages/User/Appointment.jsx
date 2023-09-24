import './Appointment.css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectUnit } from '../../features/units/unitSlice'
import { userFill, bringAppointments, logout } from '../../features/users/userSlice'

import { motion } from 'framer-motion'


export default function Appointment() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, personAppointments } = useSelector((state) => state.userState)
    const { selectedUnit } = useSelector((state) => state.unitsState)

    useEffect(() => {

        const selectedUnitId = localStorage.getItem('selectedUnit')
        const user = localStorage.getItem('user')

        if (!selectedUnitId) {
            navigate('/')
        }

        if (!user) {
            navigate('/login')
        }

        dispatch(selectUnit(JSON.parse(selectedUnitId)))
        dispatch(userFill())
        dispatch(bringAppointments(JSON.parse(user).email))

    }, [])

    useEffect(() => {

        const user = localStorage.getItem('user')

        if (!personAppointments) {
            dispatch(bringAppointments(JSON.parse(user).email))
        }

    }, [personAppointments])

    const handleGo = () => {

        navigate('/user')

    }

    const handleLogout = () => {

        dispatch(logout());
        navigate('/')

    }

    return (
        <div className='appointment'>

            <motion.div className="alert alert-secondary" role="alert" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 1 }}>
                {user && <p>Hello <strong>{user.email}</strong></p>}
                {/*
                <button className='btn btn-primary' onClick={handleGo}>{selectedUnit && <p><strong className='bold'>Make an appointment for {selectedUnit.name}</strong></p>}</button>
                */}
                <p className='d-flex justify-content-between'>
                    <button className='btn btn-outline-primary btn-sm mx-4' onClick={handleGo}>Make an appointment for ...</button>
                    <button className='btn btn-outline-danger btn-sm mx-4' onClick={handleLogout}>Logout</button>
                </p>
            </motion.div>

            <div className="alert alert-light" role="alert" >
                <h3>Your appointments</h3>
                <div className="mt-3">

                    <div className='row mt-4'>

                        {
                            personAppointments && personAppointments.map(data => (

                                <div className='col-4 container' key={data.id}>

                                    <div className={`alert alert-${data.statusColor}`} role="alert">
                                        <p>{data.unitName}</p>
                                        <p>{data.date} - {data.hour}</p>
                                        <p>Status: {data.status}</p>
                                        {data.message === '' ? <p></p> : <p>Message: {data.message}</p>}
                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>
            </div>

        </div>
    )
}
