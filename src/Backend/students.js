const templateDoc = {
    _id: "student_001",
    name: "John Doe", 
    daysInAttendance: 100,
    daysAbsent: 5,
    program: "Primary School"
}

function createNewStudent(params, db){
    db.put(params).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.error("Error creating new doc:", err)
    })
}

//get student using studentId and programId
async function getStudent(studentId, programId, db) {
    try {
        const program = await db.get(programId);
        if (program.students && program.students[studentId]) {
            return program.students[studentId]; 
        } else {
            console.error("Student not found");
        }
    } catch (err) {
        console.error("Error getting student:", err);
    }  
}

module.exports = {
    createNewStudent,
    getStudent
}
