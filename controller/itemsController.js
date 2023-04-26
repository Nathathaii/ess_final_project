require('dotenv').config();
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

//////
async function getItems(params) {
    const command = new GetItemCommand(params);
    try {
        const data = await client.send(command);
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
////

exports.getItem = async (req, res) => {
    try {
        const data = await getItems({
            TableName: process.env.AWS_TABLE_NAME,
            Key: {
                'student_id': { S: "6430204221" }
            }
        });
        if (!data.Item) {
            res.status(404).send("Student not found");
            return;
        }
        res.json(data.Item);
        console.log(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server errorrrr");
    }
};


// #1 Get the tasks for a specific student
exports.getStudentInfo = async (req, res) => {
    const { student_id } = req.params;
    try {
        const data = await getItems({
            TableName: process.env.AWS_TABLE_NAME,
            Key: {
                student_id: { S: student_id }
            }
        });
        if (!data.Item) {
            res.status(404).send("Student not found");
            return;
        }
        res.json(data.Item);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// #2 Add a task to student_id's tasks list
exports.addTask = async (req, res) => {
    const { student_id } = req.params;
    const { task_name, description, subject_id, priority, duedate, deadline, status } = req.body;

    const params = {
        TableName: process.env.AWS_TABLE_NAME,
        Item: {
            student_id: { S: student_id },
            tasks: {
                L: [
                    {
                        M: {
                            task_name: { S: task_name },
                            description: { S: description },
                            subject_id: { S: subject_id },
                            priority: { S: priority },
                            duedate: { S: duedate },
                            deadline: { S: deadline },
                            status: { S: status },
                        },
                    },
                ],
            },
        },
    };

    const command = new PutItemCommand(params);

    try {
        const data = await client.send(command);
        res.status(200).json({ message: "Task added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding task to database" });
    }
};

// #3 Delete an item from student_id's tasks list 
exports.deleteTask = async (req, res) => {
    const { student_id, task_name } = req.params;

    const params = {
        TableName: process.env.AWS_TABLE_NAME,
        Key: {
            'student_id': { S: student_id }
        },
        ExpressionAttributeValues: {
            ':tname': { S: task_name }
        },
        FilterExpression: 'contains(tasks, :tname)'
    };

    try {
        const data = await client.send(new ScanCommand(params));
        const task = data.Items[0].tasks.L.find(item => item.M.task_name.S === task_name);
        const taskIndex = data.Items[0].tasks.L.findIndex(item => item.M.task_name.S === task_name);

        const deleteParams = {
            TableName: 'ess_final_group_18',
            Key: {
                'student_id': { S: student_id }
            },
            UpdateExpression: 'REMOVE tasks[' + taskIndex + ']'
        };

        await client.send(new UpdateItemCommand(deleteParams));
        res.send(`Task with task_name ${task_name} has been deleted.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};





