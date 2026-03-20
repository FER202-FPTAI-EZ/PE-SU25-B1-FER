import { createContext, useContext, useEffect, useState } from "react"
import { instance } from "../lib/axios"

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [courses, setCourses] = useState([])

    const fetchCourses = async () => {
        await instance.get("/courses").then(res => {
            setCourses(res.data)
        })
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    return (
        <AppContext.Provider value={{ courses, setCourses }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}

export default AppProvider
