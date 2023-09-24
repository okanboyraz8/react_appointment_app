// CSS Module
import './Home.css'

// React Hooks
import React, { useEffect } from 'react'

// We need dispatch for "bringUnits in unitSlice" that is worked!
// We need to access the state to show it after running it. For this, we need "useSelector".
import { useDispatch, useSelector } from 'react-redux'

// Initialize bringUnits from unitSlice
import { bringUnits } from '../../features/units/unitSlice'

// isLaoding from state is used on homepage together, with ClipLoader from React Spinners...
import { ClipLoader } from 'react-spinners'

// Redirection from the Homepage to the Login with React Router Dom 
import { useNavigate } from 'react-router-dom'

export default function Home() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { units, isLoading } = useSelector((state) => state.unitsState)

    useEffect(() => {
        dispatch(bringUnits())
    }, [])

    const handleSelectUnit = (id) => {

        localStorage.setItem('selectedUnit', JSON.stringify(id))
        navigate('/login')

    }

    if (isLoading) {
        return (
            <div className='text-center'>
                <ClipLoader size={200} color='#bde0fe' />
            </div>
        )
    }

    return (
        <div className='text-center paper'>
            <form className='text-center'>

                <div className='alert alert-primary text-center'>
                    <h1 className='h1 mb-2 font-weight-normal text-center'>APPOINTMENT APP</h1>
                </div>

                {
                    units.length > 0 ? (
                        <div className='row'>
                            {
                                units.map(unit => (
                                    <div className='col mb-2 mt-4 pr-1' key={unit.id}>
                                        <p className='btn btn-primary' onClick={() => handleSelectUnit(unit.id)}>{unit.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col mb-2 mt-4 pr-1">
                                <p className="alert alert-secondary text-center">No units added yet!</p>
                            </div>
                        </div>
                    )
                }

                <p className='mt-5 mb-3 text-muted'>&copy; by AOS SOFTWARE 2023 IN UDEMY</p>
                <p className='text-muted'>&copy; A very valuable educational series. I am grateful to him</p>

            </form>
        </div>
    )
}
