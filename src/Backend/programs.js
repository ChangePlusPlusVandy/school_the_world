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

module.exports = {
    createProgram,
    getAllPrograms
}