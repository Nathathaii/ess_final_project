require('dotenv').config();
const backendIPAddress = process.env.backendIPAddress

let itemData;
// # 1.GET

//# 1.1 get all data save in a specific student_id
const getItemsFromDB = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = '6430204221'; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};

//show data from calendar
const showItemsInTable = async (itemData) => {
    const table = document.getElementById("") //fill main table body
    table.innerHTML = "";
    const tasks = itemData.tasks;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i].task_name;
        var deadline = task.deadline;
        var description = task.description;
        var duedate = task.duedate;
        var priority = task.priority;
        var status = task.status;
        var subject_id = task.subject_id;
        var task_name = task.task_name

        //เขียนโค้ดฝั่ง front แสดงข้อมูล assignment ลง calendar ได้เลย (อาจใช้แค่ task name กับ duedate)

    }

}

//#1.2 display only "tasks list" of a specific student
const getStudentTasks = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = '6430204221'; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}/tasks`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};

//#1.3 display only "subjects list" of a specific student
const getStudentSubjects = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = '6430204221'; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}/subjects`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};
//------------------------------------------------------------------
//# 2. POST

//# 2.1  add task to a specific student's tasks list
const addTask = async () => {
    //const name = document.getElementById("") //event name
    //const date = document.getElementById("")
    //const description = document.getElementById("")
    const student_id = 'your_student_id';
    const task_name = 'example task';
    const description = 'example description';
    const subject_id = 'example subject id';
    const priority = 'example type';
    const duedate = '2023-05-01';
    const deadline = '2023-05-02';
    const status = 'example status';

    const options = {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            student_id: student_id,
            task_name: task_name,
            description: description,
            subject_id: subject_id,
            priority: priority,
            duedate: duedate,
            deadline: deadline,
            status: status
        }),
        credentials: "include",
    };
    let studentId = '6430204221';
    await fetch(`http://${backendIPAddress}/items/${studentId} `, options)
        .catch((error) => console.error(error))
};

// # 2.2 add subjects
const addSubject = async (studentId, subject) => {
    try {
        const response = await fetch(`http://${backendIPAddress}/items/${studentId}/subjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subject),
        });

        if (!response.ok) {
            throw new Error('Error adding subject');
        }

        const data = await response.json();
        console.log(data.message); // Assuming the response contains a 'message' property

        // Perform any additional actions upon successful subject addition

    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
};

// Example usage (if you want to test uncomment the code below)

// const studentId = "6430204221";
// const subject = {
//     subject_id: "0003",
//     subject_name: "math",
//     subject_color: "#FFD700",
// };

// addSubject(studentId, subject);
//  

// # 3 PUT update a task's status
const updateTaskStatus = async (studentId, taskName, newStatus) => {
    try {
        const response = await fetch(`http://${backendIPAddress}/items/${studentId}/tasks`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_name: taskName, status: newStatus }),
        });

        if (!response.ok) {
            throw new Error('Error updating task status');
        }

        const data = await response.json();
        console.log(data.message); // Assuming the response contains a 'message' property

        // Perform any additional actions upon successful task status update

    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
};

// Example usage
// const studentId = "6430204221";
// const taskName = "backend coding";
// const newStatus = "completed";

// updateTaskStatus(studentId, taskName, newStatus);

//-------------------------------------------------------------------
// # 4. DELETE 

const deleteItem = async (item) => {
    const options = {
        method: "DELETE",
        credentials: "include",
    };
    let student_id = '6430204221';
    let task_name = 'history_reading';
    await fetch(`http://${backendIPAddress}/items/${student_id}/tasks/${task_name}`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};

await getItemsFromDB();
showItemsInTable(itemData);
deleteItem();

//------------------------------------- MCV ----------------------------------------------------
const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const getUserProfile = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(
        `http://${backendIPAddress}/courseville/get_profile_info`,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data.user);
            var id = data.user.id;
            var firstname = data.user.firstname_en;
            var lastname = data.user.lastname_en;
            return [id, firstname, lastname]; //หรือจะเอา return ออกแล้วแสดง profile ในนี้เลยก้ได้
        })
        .catch((error) => console.error(error));
};

document.addEventListener("DOMContentLoaded", async function (event) {
    console.log("Showing items from database.");
    await getItemsFromDB();
    showItemsInTable(itemData);
})
