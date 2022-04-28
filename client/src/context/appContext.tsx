import React, {useContext, useReducer} from 'react'
import {
    CLEAR_ALERT,
    CLEAR_COURT_VALUES,
    CREATE_COURT_BEGIN,
    CREATE_COURT_ERROR,
    CREATE_COURT_SUCCESS,
    DELETE_COURT_BEGIN,
    DISPLAY_ALERT,
    EDIT_COURT_BEGIN,
    EDIT_COURT_ERROR,
    EDIT_COURT_SUCCESS,
    GET_COURTS_BEGIN,
    GET_COURTS_SUCCESS,
    GET_RESERVATIONS_BEGIN,
    GET_RESERVATIONS_SUCCESS,
    HANDLE_CHANGE,
    LOGOUT_USER,
    SET_EDIT_COURT,
    SET_EDIT_RESERVATION,
    SETUP_USER_BEGIN,
    SETUP_USER_ERROR,
    SETUP_USER_SUCCESS,
    TOGGLE_SIDEBAR,
    UPDATE_USER_BEGIN,
    UPDATE_USER_ERROR,
    UPDATE_USER_SUCCESS
} from './actions'
import reducer from './reducer'
import axios from 'axios'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

export const initialState = {
    //General state
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    showSidebar: false,
    isEditing: false,
    //User state
    user: user ? JSON.parse(user) : null,
    token: token,
    //Courts state
    editCourtId: '',
    courtName: '',
    courtTypeOptions: ['tennis', 'padel'],
    courtType: 'tennis',
    inServiceOptions: ['true', 'false'],
    inService: true,
    courts: [],
    totalCourts: 0,
    page: 1,
    numOfPages: 1,
    //Reservations state
    editReservationtId: '',
    courtId: '',
    date: new Date(),
    status: '',
    reservations: [],
    totalReservations: 0,
}

// @ts-ignore
const AppContext = React.createContext<any>()

// @ts-ignore
export function AppProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState)

    // axios
    const authFetch = axios.create({
        baseURL: '/api/v1',
    })
    // request

    authFetch.interceptors.request.use(
        (config) => {
            // @ts-ignore
            config.headers.common['Authorization'] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    // response

    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            // console.log(error.response)
            if (error.response.status === 401) {
                logoutUser()
            }
            return Promise.reject(error)
        }
    )


    const displayAlert = () => {
        // @ts-ignore
        dispatch({type: DISPLAY_ALERT})
        clearAlert()
    }
    const clearAlert = () => {
        setTimeout(() => {
            // @ts-ignore
            dispatch({type: CLEAR_ALERT})
        }, 5000)
    }

    const toggleSidebar = () => {
        console.log('toggle')
        // @ts-ignore
        dispatch({type: TOGGLE_SIDEBAR})
    }

    // @ts-ignore
    const addUserToLocalStorage = ({user, token}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    // @ts-ignore
    const setupUser = async ({currentUser, endPoint, alertText}) => {
        // @ts-ignore
        dispatch({type: SETUP_USER_BEGIN})
        try {
            const {data} = await axios.post(`/api/v1/${endPoint}`, currentUser)
            const {user, token} = data
            // @ts-ignore
            dispatch({type: SETUP_USER_SUCCESS, payload: {user, token, alertText}})
            addUserToLocalStorage({user, token})
        } catch (error) {
            // @ts-ignore
            console.log(error.response.data.message)
            // @ts-ignore
            dispatch({type: SETUP_USER_ERROR, payload: {msg: error.response.data.message}})
        }
        clearAlert()
    }

    // @ts-ignore
    const updateUser = async ({currentUser, endPoint, alertText}) => {
        // @ts-ignore
        dispatch({type: UPDATE_USER_BEGIN})
        try {
            const {data} = await authFetch.patch(`${endPoint}`, currentUser)
            const {user, token} = data
            // @ts-ignore
            dispatch({type: UPDATE_USER_SUCCESS, payload: {user, token, alertText}})
            addUserToLocalStorage({user, token})
        } catch (error) {
            // @ts-ignore
            dispatch({type: UPDATE_USER_ERROR, payload: {msg: error.response.data.message}})
        }
        clearAlert()
    }

    // @ts-ignore
    const handleCourtChange = ({name, value}) => {
        // @ts-ignore
        dispatch({type: HANDLE_CHANGE, payload: {name, value}})
    }

    const clearCourtValues = () => {
        // @ts-ignore
        dispatch({type: CLEAR_COURT_VALUES})
    }

    // @ts-ignore
    const createCourt = async () => {
        // @ts-ignore
        dispatch({type: CREATE_COURT_BEGIN})
        try {
            const {courtName, courtType, inService} = state
            await authFetch.post('/court', {courtName, courtType, inService})
            // @ts-ignore
            dispatch({type: CREATE_COURT_SUCCESS})
            // @ts-ignore
            clearCourtValues()
        } catch (error) {
            // @ts-ignore
            console.log(error.response.data.message)
            // @ts-ignore
            if (error.response.status === 401) logoutUser()
            // @ts-ignore
            dispatch({type: CREATE_COURT_ERROR, payload: {msg: error.response.data.message}})
        }
        clearAlert()
    }

    const getCourts = async () => {
        let url = `/court`
        // @ts-ignore
        dispatch({type: GET_COURTS_BEGIN})
        try {
            const {data} = await authFetch.get(url)
            const {courts, totalCourts, numOfPages} = data
            // @ts-ignore
            dispatch({type: GET_COURTS_SUCCESS, payload: {courts, totalCourts, numOfPages}})
        } catch (error) {
            console.log(error)
            //logoutUser()
        }
        clearAlert()
    }

    const setEditCourt = (id: any) => {
        dispatch({
            // @ts-ignore
            type: SET_EDIT_COURT, payload: {id}
        })
    }

    const editCourt = async () => {
        // @ts-ignore
        dispatch({type: EDIT_COURT_BEGIN})
        try {
            const {courtName, courtType, inService} = state
            await authFetch.patch(`/court/${state.editCourtId}`, {
                courtName, courtType, inService
            })
            // @ts-ignore
            dispatch({type: EDIT_COURT_SUCCESS})
            // @ts-ignore
            dispatch({type: CLEAR_COURT_VALUES})
        } catch (error) {
            // @ts-ignore
            if (error.response.status === 401) return
            // @ts-ignore
            dispatch({type: EDIT_COURT_ERROR, payload: {msg: error.response.data.message}})
            console.log(error)
            //logoutUser()
        }
    }

    const deleteCourt = async (id: any) => {
        // @ts-ignore
        dispatch({type: DELETE_COURT_BEGIN})
        try {
            await authFetch.delete(`/court/${id}`)
            getCourts()
        } catch (error) {
            // @ts-ignore
            console.log(error.response)
            //logoutUser()
        }
    }

    const createReservation = async () => {

    }

    // @ts-ignore
    const handleReservationChange = ({name, value}) => {
        // @ts-ignore
        dispatch({type: HANDLE_CHANGE, payload: {name, value}})
    }

    const updateReservation = async () => {
    }

    const getReservations = async () => {
        let url = `/reservation`
        // @ts-ignore
        dispatch({type: GET_RESERVATIONS_BEGIN})
        try {
            const {data} = await authFetch.get(url)
            console.log(data)
            const {reservations, totalReservations, numOfPages} = data
            // @ts-ignore
            dispatch({type: GET_RESERVATIONS_SUCCESS, payload: {reservations, totalReservations, numOfPages}})
        } catch (error) {
            console.log(error)
            //logoutUser()
        }
        clearAlert()
    }

    const setEditReservation = (id: any) => {
        dispatch({
            // @ts-ignore
            type: SET_EDIT_RESERVATION, payload: {id}
        })
    }

    const logoutUser = () => {
        // @ts-ignore
        dispatch({type: LOGOUT_USER})
        removeUserFromLocalStorage()
    }


    return (
        <AppContext.Provider
            value={{
                ...state,
                displayAlert,
                setupUser,
                updateUser,
                logoutUser,
                toggleSidebar,
                createCourt,
                clearCourtValues,
                handleCourtChange,
                getCourts,
                setEditCourt,
                editCourt,
                deleteCourt,
                handleReservationChange,
                getReservations,
                setEditReservation,
                updateReservation,
                createReservation
            }}>
            {children}
        </AppContext.Provider>
    )
}

// Create hook
export function useAppContext() {
    return useContext(AppContext)
}
