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

module.exports = {
    createNewStudent
}