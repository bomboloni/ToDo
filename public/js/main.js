const deleteButton = document.querySelectorAll('.delete-button')
const checkBox = document.querySelectorAll('.update')

Array.from(deleteButton).forEach((element) => {
    element.addEventListener('click', deleteTask)
})
Array.from(checkBox).forEach((element) => {
    element.addEventListener('click', updateTask)
})
//or (Dab's stream, 1:37:00 in) BTW - DAB USED AN UPDATE BUTTON, NOT CHECKBOX
/*
[...checkBox].forEach((element) => {
    element.addEventListener('click', updateTask);
});
*/


async function deleteTask(event) {
    const tTask = event.target.parentElement.previousElementSibling.innerText;
    console.log(tTask)

    try {
        const response = await fetch('deleteTask', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                task : tTask
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function updateTask(event) {
    const tTask = event.target.nextElementSibling.innerText;
    console.log(tTask)

    try {
        const response = await fetch('updateTask', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                task: tTask,
            }),
        });
        const data = await response.json()
            console.log(data)
            location.reload()
    }catch(err){
        console.log(err)
    }
}