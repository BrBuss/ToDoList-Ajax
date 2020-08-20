//setting CSRF_TOKEN from Django Docs
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

//display list
displayList()   
function displayList(){
    const listContainer = document.getElementById('task-container')
    listContainer.innerHTML = ''    //clean container to prevent item duplication

    //api list url
    const url = 'http://localhost:8000/api/'

    //fetching url data
    fetch(url)
    .then((resp) => resp.json()) //convert data into json response
    .then(function(data){
        console.log('Data:',  data)

        let list = data
        for(let i in list){
            let title = ` <p class="title">${list[i].title}</p>`
            if(list[i].completed == true){
                title = `<strike class="title">${list[i].title}</strike>`
            }
            let task = `
            <div class="title-container"  id=${i}>
                ${title}
                <button class="btn  edit">Edit </button>
                <button class="btn  delete">Delete</button>
            </div>
            `
            listContainer.insertAdjacentHTML('beforeend', task) // Inside the task-container, insert after its last child.

            const editBtn = document.getElementsByClassName('edit')[i];
            const deleteBtn = document.getElementsByClassName('delete')[i];
            const completeBtn = document.getElementsByClassName('title')[i];

            editBtn.addEventListener('click', (function(task) {
                return function(){
                    editTask(task)
                }
            })(list[i]))

            deleteBtn.addEventListener('click', (function(task) {
                return function(){
                    deleteTask(task)
                }
            })(list[i]))

            completeBtn.addEventListener('click', (function(task) {
                return function(){
                    completeUncomplete(task)
                }
            })(list[i]))
        }
    })
}
var activeEdit = null
const form = document.getElementById('form-container')
form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('form-submitted')
    //api edit list url   
    // api create list url
    let url = 'http://localhost:8000/api/create/';
    //change api url to update after edit button is clicked
    if(activeEdit != null){
        url = `http://localhost:8000/api/update/${activeEdit.id}`
        activeEdit = null
    }
    
    let title = document.getElementById('title').value //gets title value from form
    //send POST Http method to backend
    fetch(url, {
        method:'POST',
        headers:{
         'Content-type': 'application/json',
         'X-CSRFToken':csrftoken,
         },
        body:JSON.stringify({'title':title}) //send title data as string to backend
    }
    //recall displayList function and reset form
    ).then(function(response){
        displayList();
        document.getElementById('task-form').reset();

    })
})
//edit task
function editTask(task){
    console.log(task);
    activeEdit = task; //pass task object to activeEdit
    document.getElementById('title').value = activeEdit.title //set title input value from task-form to activeEdit.title value

}

//delete task
function deleteTask(task){
    //send DELETE Http method to backend
    fetch(`http://localhost:8000/api/delete/${task.id}`, //api delete url
     {method:'DELETE',
        headers:{
            'Content-type': 'application/json',
            'X-CSRFToken':csrftoken,
        }
        //recal task list
    }).then((response) => {
        displayList()
    })

}

function completeUncomplete(task){

    task.completed = !task.completed;

    fetch(`http://localhost:8000/api/update/${task.id}`, {
    method:'POST',
    headers:{
     'Content-type': 'application/json',
     'X-CSRFToken':csrftoken,
     },
     body:JSON.stringify({'title':task.title, 'completed':task.completed})
    }).then((response) => {
        displayList()
    })
}
