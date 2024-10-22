// Edits a student's details within the program database.
async function editStudent(params, db) {
  try {
    // Find the student in the program's students array
    const programDoc = await db.get(params.programId);
    const studentIndex = programDoc.students.findIndex(
      (student) => student._id === params.studentId
    );
    if (studentIndex === -1) {
      throw new Error(
        `Student with ID ${params.studentId} not found in program ${params.programId}`
      );
    }

    // Update the fields for the found student
    const updatedStudent = {
      ...programDoc.students[studentIndex],
      ...params.updatedFields,
    };

    // Replace the old student data with the updated one in the students array
    programDoc.students[studentIndex] = updatedStudent;
    const response = await db.put(programDoc);
    return response;
  } catch (err) {
    console.error("Error updating student:", err);
    throw new Error("Could not update the student record.");
  }
}

module.exports = { editStudent };
