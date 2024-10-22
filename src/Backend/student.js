async function addStudent(params, db){
    // params[0] will be the program
    await db.get(params.programId).then((res) => {
        // checking if the student alr exists
        // res.students is an object that has (studentIds, another object representing the student)
        if (!res.students[params.studentId]) {
            res.students[params.studentId] = {
                _id: params.studentId,
                name: params.name,
                daysAttended: params.daysAttended,
                daysAbsent: params.daysAbsent
            }
            db.put(res)
        }
    }).catch((err) => {
        console.error("Error creating new doc:", err)
    })
}