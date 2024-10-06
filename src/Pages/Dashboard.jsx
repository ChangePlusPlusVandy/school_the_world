import * as React from "react"
import PouchDB from "pouchdb"
import { useEffect, useState } from "react"
import { TextInputField, Button } from "evergreen-ui"


function Dashboard(){
    const [data, setData] = useState()
    
    const templateDoc = {
        _id: "student_001",
        name: "John Doe", 
        daysInAttendance: 100,
        daysAbsent: 5,
        program: "Primary School"
    }
    
    const createStudent = () => {
        window.electronAPI.createNewStudent(templateDoc).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.error("error", err)
        })
    }

    return (
        <div>
        </div>
    )
    
}

export default Dashboard