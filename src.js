let pending_task_btn = document.getElementById('pending');
let completed_task_btn = document.getElementById('completed');
let pending_task = document.getElementById('pending-task');
let completed_task = document.getElementById('completed-task');
let input = document.getElementById('task-input');
let input_empty_btn = document.getElementById('close-input-empty');

let data = [];
let counter = 1;

function saveData(){
    localStorage.clear();
    localStorage.setItem('tasks',JSON.stringify(data));
    localStorage.setItem('id',counter);
}

function fetchData(){
    data = JSON.parse(localStorage.getItem('tasks'));
    counter = localStorage.getItem('id');
    if(counter == null) counter = 1;

    if(data == null) data = [];
    for(let i=0;i<data.length;i++){
        if(!data[i].is_complete)
            pending_task.appendChild(createHtmlElement(data[i]));
        else
            completed_task.appendChild(createHtmlElement(data[i]));
    }
}

function createHtmlElement(element_data){
    let task = document.createElement('div');
    task.id = element_data.task_id;
    task.setAttribute('class','task');

    const task_field = document.createElement('span');
    task_field.innerText = element_data.text;

    const task_complete = document.createElement('input');
    task_complete.type = 'checkbox';
    task_complete.checked = element_data.is_complete;
    if(element_data.is_complete) task_field.classList.add('task-completed');
    task_complete.addEventListener('click',completeTask);
    
    const task_input_field = document.createElement('input');
    task_input_field.type = 'text';

    const editbtn = document.createElement('button');
    editbtn.textContent = 'Edit';
    editbtn.setAttribute('class','edit');
    editbtn.addEventListener('click',editTask);

    const deletebtn = document.createElement('button');
    deletebtn.textContent = 'Delete';
    deletebtn.setAttribute('class','delete');
    deletebtn.addEventListener('click',removeTask);

    task.appendChild(task_field);
    task.appendChild(task_input_field);
    task.appendChild(task_complete);
    task.appendChild(editbtn);
    task.appendChild(deletebtn);

    return task;
}

function newTask(text){
    const task_state = {task_id:counter++,text:text,is_complete:false};
    data.push(task_state);

    const element = createHtmlElement(task_state);

    let pending_task = document.getElementById('pending-task');
    pending_task.appendChild(element);
}

function editTask(){
    let div = event.target.parentNode;
    let edit_input_field = div.querySelector('input[type="text"]');
    let span = div.querySelector('span');

    edit_input_field.style.display = 'inline';
    span.style.display = 'none';

    edit_input_field.addEventListener('keypress',()=>{
        if(event.key == 'Enter' && edit_input_field.value != ''){
            for(let i=0;i<data.length;i++){
                if(data[i].task_id == div.id){
                    data[i].text = edit_input_field.value;
                    break;
                }   
            }
            span.innerText = edit_input_field.value;
            
            span.style.display = 'inline';
            edit_input_field.style.display = 'none';
        }
    })
}

function completeTask(){
    let div = event.target.parentNode;
    let span = div.querySelector('span');
    for(let i=0;i<data.length;i++){
        if(data[i].task_id == div.id){
            data[i].is_complete = !data[i].is_complete;
            if(data[i].is_complete) completed_task.appendChild(createHtmlElement(data[i]));
            else pending_task.appendChild(createHtmlElement(data[i]));
            span.classList.toggle('task-completed');
            break;
        }
    }
    div.remove();
}

function removeTask(){
    let div = event.target.parentNode;
    let index = -1;
    for(let i=0;i<data.length;i++){
        if(div.id == data[i].task_id){
            index = i;
            break;
        }
    }
    if(index >= 0)
        data.splice(index,1);
    div.remove();
}

fetchData();

pending_task_btn.addEventListener('click',()=>{
    if(pending_task.style.display == '' || pending_task.style.display == 'none'){
        pending_task.style.display = 'flex';
        completed_task.style.display = 'none';
    }
});

completed_task_btn.addEventListener('click',()=>{
    if(completed_task.style.display == '' || completed_task.style.display == 'none'){
        pending_task.style.display = 'none';
        completed_task.style.display = 'flex';
    }
});

input_empty_btn.addEventListener('click',()=>{
    let input_empty = document.getElementById('input-empty');
    input_empty.style.display = 'none';
});

input.addEventListener('keypress',()=>{
    if(event.key == 'Enter'){
        if(input.value == ''){
            event.preventDefault();
            let input_empty = document.getElementById('input-empty');
            input_empty.style.display = 'flex';
            return;
        }
        newTask(input.value);
    }
});

window.addEventListener('beforeunload',()=>{
    saveData();
})