async function createProgram(params, db){
    await db.put(params).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.error("Error creating new doc:", err)
    })
}

async function getAllPrograms(db){
    try {
        const result = await db.allDocs({include_docs: true});
        const students = result.rows.map(row => row.doc);
        return students;
    }catch (err) {
        console.error("error: ", err);
        throw err;
    }
}

async function deleteProgram(params, db) {
    try {   
        const target = await db.get(params);   //look up the document through docId
        await db.remove(target);
        console.log("Successfully deleted the program.");
    } catch (err) {
        console.error("Error deleting the doc:", err);
    }
}

module.exports = {
    createProgram,
    getAllPrograms,
    deleteProgram
}