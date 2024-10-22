

async function deleteStudent(student, db){
    try {
        await db.remove(student._id);
        console.log("Student deleted successfully");
    }
    catch(error) {
        console.error("Error deleting student: ", error);
    }
}
