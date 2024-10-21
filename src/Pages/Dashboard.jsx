import * as React from "react"
import { useState } from "react"
import { Button } from "evergreen-ui"


function Dashboard(){
    const [data, setData] = useState()
    
    const templateDoc = {
        _id: "tutor_program",
        students: []
    }
    
    const createProgram = async (doc) => {
        const res = await window.electronAPI.createProgram(doc);
    }

    const getAllPrograms = async () => {
        const curData = await window.electronAPI.getAllPrograms();
        console.log(curData)
    }


    const deleteProgram = async (docId) => {
        const res = await window.electronAPI.deleteProgram(docId);
    }

    return (
        <div>
            <Button onClick={() => {getAllPrograms()}}>print programs</Button>
        </div>
    )
    
}

export default Dashboard