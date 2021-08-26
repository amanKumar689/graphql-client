import React, { useContext } from 'react'
import {Redirect, Route} from 'react-router-dom'
import { AuthContext } from '../context/auth'
const ProtectedRoute = ({children},...rest) => {
    const context = useContext(AuthContext)
    const user = context.user
    return !user ? (
       <Route {...rest}>
       {children}
       </Route>
    ) :(<Redirect to='/'/>)
}

export default ProtectedRoute
