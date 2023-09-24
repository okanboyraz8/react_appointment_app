// CSS Module
import './Admin.css'

// React Hooks
import React, { useEffect, useState } from 'react'

// useSelector: to access administrative information
// useDispatch: to run logout slice
import { useDispatch, useSelector } from 'react-redux'

// useNavigate: in order to give direction
import { useNavigate } from 'react-router-dom'

// Initialize the slice of "logout" & "bringModerator" & "assignModeratorToUnit" & "reset"
import { logout, bringModerator, assignModeratorToUnit, reset, bringUnitsModerator } from '../../features/admin/adminSlice'

// Initialize the slice of "bringUnits"
import { bringUnits } from '../../features/units/unitSlice'

// Building the toast from react-toastify to use in Admin.jsx and its css part
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function Admin() {

  const { admin, isSuccess, moderators, moderatorAssignmentMessage, authorities } = useSelector((state) => state.adminState)
  const { units } = useSelector((state) => state.unitsState)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [unit, setUnit] = useState("")
  const [moder, setModer] = useState("")

  const handleAuthorizedAssignment = () => {

    if ((unit !== "" && moder !== "") && (unit !== "1" && moder !== "1")) {
      //console.log(unit);
      //console.log(moder);

      const data = {
        unit,
        moder
      }
      dispatch(assignModeratorToUnit(data));
    }
  }

  const handleLogout = () => {

    dispatch(logout())
    navigate('/')

  }

  useEffect(() => {

    if (admin) {
      if (admin.authority !== "admin") {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }

    dispatch(bringModerator())
    dispatch(bringUnits())
    dispatch(bringUnitsModerator())

  }, [isSuccess])

  useEffect(() => {

    if (moderatorAssignmentMessage !== '') {
      toast.success(moderatorAssignmentMessage)

      dispatch(reset())
    }

  }, [moderatorAssignmentMessage])

  return (
    <div className='admin'>

      <div className="alert alert-secondary" role="alert">
        <span>Welcome to the Admin Panel</span>
        <div className='text-end'>
          {admin && <span className='me-4'>Hello {admin.email} </span>}
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="alert alert-primary" role="alert">
        <h3>Add New Moderator</h3>
        <div className="mt-3">
          <div className='row'>
            <div className='col-6'>
              <label htmlFor="email" className="form-label">Email Address:</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="New moderator email address to be added" />
            </div>
            <div className='col-6'>
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" className="form-control" id="password" name="password" placeholder="New moderator password to be added" />
            </div>
          </div>
          <div className='row mt-4'>
            <div className='text-center'><button className='btn btn-outline-primary btn-sm'>ADD</button></div>
          </div>
        </div>
      </div>

      <div className="alert alert-dark" role="alert">
        <h4>Give Moderator Authority to Unit</h4>
        <div className="mt-3">
          <div className='row'>
            <div className='col-6'>
              <select className="form-select" aria-label="Default select example" onChange={(e) => setUnit(e.target.value)} value={unit}>
                <option value="1">Select Unit</option>
                {
                  units && units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))
                }
              </select>
            </div>
            <div className='col-6'>
              <select className="form-select" aria-label="Default select example" onChange={(e) => setModer(e.target.value)} value={moder}>
                <option value="1">Select a Moderator</option>
                {
                  moderators && moderators.map(moder => (
                    <option key={moder.id} value={moder.id}>{moder.email}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='text-center'><button className='btn btn-outline-dark btn-sm' onClick={handleAuthorizedAssignment}>AUTHORIZED ASSIGNMENT</button></div>
          </div>
        </div>
      </div>

      <div className='alert alert-secondary' role='alert'>
        <h5>Unit Moderators</h5>
        <div className='mt-3'>
          <div className='row mt-4'>
            <ul className='list-group'>
              {
                authorities && authorities.map(authority => (
                  <li className='list-group-item d-flex justify-content-between align-items-center' key={authority.email}>
                    {authority.email}
                    <span className='badge bg-primary rounded-pill'>{authority.unitName}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}
