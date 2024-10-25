async function createProgram(params, db) {
  await db
    .put(params)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("Error creating new doc:", err);
    });
}

async function getAllPrograms(db) {
  try {
    const result = await db.allDocs({ include_docs: true });
    const students = result.rows.map((row) => row.doc);
    return students;
  } catch (err) {
    console.error("error: ", err);
    throw err;
  }
}

async function editProgram(params, db) {
  try {
    const { _id, updatedFields } = params;
    const doc = await db.get(_id);
    Object.assign(doc, updatedFields);
    const result = await db.put(doc);
    console.log("Program updated successfully:", result);
    return result;
  } catch (err) {
    console.error("Error editing program:", err);
    throw err;
  }
}

module.exports = {
  createProgram,
  getAllPrograms,
  editProgram,
};
