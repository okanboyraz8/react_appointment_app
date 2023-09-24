// CSS Module
import './Login.css'

// React Icons for using "FcGoogle"
import { FcGoogle } from 'react-icons/fc'

// React Hooks => To capture email and password: useState
import React, { useEffect, useState } from 'react'

// We will use the "Link" to return to the homepage again. We do it manually.
// Even if there is no selectedUnit, we will use useNavigate to return to the homepage automatically. 
import { Link, useNavigate } from 'react-router-dom'

// accessing selectUnit: dispatch(selectUnit(JSON.parse(selectedUnitId)))
// accessing states: useSelector((state) => state.unitsState)
import { useDispatch, useSelector } from 'react-redux'

// Executing this icon when true during isLoading control
import BarLoader from "react-spinners/BarLoader";

// to access this part => dispatch(selectUnit(JSON.parse(selectedUnitId)))
import { selectUnit } from '../../features/units/unitSlice'

// to access this part => dispatch(login(data))
import { login, reset } from '../../features/admin/adminSlice'

// To log in with Google:
import { loginGoogle } from '../../features/users/userSlice'

// For informational messages:
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedUnit, isLoading } = useSelector((state) => state.unitsState)
    const { admin, message } = useSelector((state) => state.adminState)
    const { user } = useSelector((state) => state.userState)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleAdminLogin = (e) => {

        e.preventDefault();

        const data = {
            email,
            password
        }

        dispatch(login(data))

    }

    const handleUserLogin = (e) => {
        e.preventDefault();
        dispatch(loginGoogle())
    }

    // useEffect: the part that will work when "the page is refreshed"
    useEffect(() => {

        const selectedUnitId = localStorage.getItem('selectedUnit')

        if (!selectedUnitId) {
            navigate('/')
        }

        dispatch(selectUnit(JSON.parse(selectedUnitId)))

    }, [])

    // the part that will work for "admin"
    useEffect(() => {

        if (admin) {

            if (selectedUnit) {

                if (admin.authority === "admin") {

                    localStorage.setItem('admin', JSON.stringify({ uid: admin.uid }))
                    //console.log('Redirect to Admin Page');
                    navigate('/admin')

                } else if (admin.authority === "moderator") {
                    //console.log(admin.authorityUnitId);
                    //console.log(selectedUnit.id);

                    if (admin.authorityUnitId === selectedUnit.id) {

                        localStorage.setItem('admin', JSON.stringify({ uid: admin.uid }))
                        //console.log('Redirect to Moderator Page');
                        navigate('/moderator')

                    } else {
                        //console.log('Moderator Unauthorized Entry');
                        toast.error("Moderator Unauthorized Entry")
                    }

                } else {
                    //console.log('Unauthorized Entry');
                    toast.error("Unauthorized Entry")
                }

            }
        } else {
            if (message) {
                toast.error(message)
                dispatch(reset())
            }
        }
    }, [admin, message])

    // the part that will work for when user is changed
    useEffect(() => {

        if (user != null) {
            navigate('/user')
        }

    }, [user])

    return (
        <div className="text-center">
            <form className='form-signin'>

                <div className="alert alert-secondary">
                    <h1 className="h3 mb-2 font-weight-normal">Appointment System Login</h1>
                    {
                        isLoading ? (
                            <BarLoader color="#9a8c98" width={500} />
                        ) : (
                            selectedUnit && (
                                <p className='text-danger'>{selectedUnit.name}</p>
                            )
                        )
                    }
                    <Link to="/">Click for the Homepage...</Link>
                </div>

                <h3 className='mb-3'>User Login</h3>

                <button className='btn btn-dark' onClick={handleUserLogin}>Sign in with Google</button>
                <p className="mt-4 mb-3 text-muted ">To make an appointment, <FcGoogle size='3em' /> log in with your account.</p>
                <hr />

                <h3 className='mt-4'>Admin Login</h3>
                <br />
                <input type="email" id="email" name="email" className="form-control" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type="password" id="password" name="password" className="form-control" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button className='btn btn-outline-primary mr-5' onClick={handleAdminLogin}>Login as Admin</button>

            </form>
        </div>
    )
}
