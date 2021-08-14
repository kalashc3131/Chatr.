const socket = io();
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.messageArea')
const btn = document.querySelector('.btn')
const audio = new Audio('notification.mp3');
var tempName = '';
let name;

do {
    name = prompt('Enter Your Name:')
} while (!name);
socket.emit('userJoined', name);

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    // if(message === '') confirm('You sure about sending a blank text?');
    let msg = {
        user: name,
        message: message.trim() 
    }
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    socket.emit('message', msg)
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type + 'Message';
    mainDiv.classList.add(className, 'Message')
    if(msg.user === tempName){var markup = `
    <p>${msg.message}</p>
    `;}
    else {var markup = `
    <h4>${msg.user}</h4> 
    <p>${msg.message}</p>
    `;} 
    tempName = msg.user ;
    mainDiv.innerHTML = markup ;
    messageArea.appendChild(mainDiv) ;
    scrollToBottom();
    if(type === 'incoming') // audio.pause();
    audio.play();
}

socket.on('message', (msg) =>{
    appendMessage(msg, 'incoming');
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight ;
    
}

socket.on('newUser', name =>{
    msg = {
    user: name,
    message: `${name} joined the chat.`
    }
    appendMessage(msg, 'incoming');
})

socket.on('left', name =>{
    msg = {
        user: name,
    message: `${name} left the chat.`
    }
    appendMessage(msg, 'incoming');
})

function sendMessagebySubmit(){
    message = textarea.value;
    sendMessage(message);
}