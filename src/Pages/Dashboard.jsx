import * as React from "react";
import { useState } from "react";
import { Button } from "evergreen-ui";

function Dashboard() {
  const [data, setData] = useState();

  const templateDoc = {
    _id: "tutor_program",
    students: [],
  };

  const editDoc = {
    _id: "tutor_program",
    updatedFields: {
      students: {
        name: "Jerry Smith",
        daysAttended: 105,
        daysAbsent: 12,
      },
    },
  };

  const createProgram = async (doc) => {
    const res = await window.electronAPI.createProgram(doc);
  };

  const getAllPrograms = async () => {
    const curData = await window.electronAPI.getAllPrograms();
    console.log(curData);
  };

  const editProgram = async (doc) => {
    const res = await window.electronAPI.editProgram(doc);
  };

  return (
    <div>
      <Button
        onClick={() => {
          getAllPrograms();
        }}
      >
        print programs
      </Button>
      <Button
        onClick={() => {
          createProgram(templateDoc);
        }}
      >
        add program
      </Button>
      <Button
        onClick={() => {
          editProgram(editDoc);
        }}
      >
        edit program
      </Button>
    </div>
  );
}

export default Dashboard;
