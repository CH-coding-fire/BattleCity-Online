

const socket = io.connect()
const chat = document.querySelector('.chat-form')
const Input = document.querySelector('.chat-input')
const chatWindow = document.querySelector('.chat-window')

const renderMessage = message => {
  const div = document.createElement('div')
  div.classList.add('render-message')
  div.innerText = message
  chatWindow.appendChild(div)
}

socket.on('chat', message => {
  //console.log('From server: ', message)
  renderMessage(message)
})
socket.on('new-user-online', message => {
  console.log('should refresh');
  init()
})
socket.on('connect', () => {
  console.log('connected to server');
  init()
})
function init() {
  fetchOnlineUser()
}
// let createGame = document.getElementById('createGame')
// createGame.addEventListener('click',()=>{
  
//   socket.emit('createGame')
// })
// let joinGame = document.getElementById('joinGame')
// joinGame.addEventListener('click',()=>{
  
//   socket.emit('Start')
// })

// async function turnGame() {
//   let res = await fetch('/gameroom',{
//     method: "Get"
//   })
// }

async function fetchOnlineUser() {

  let res = await fetch('/online-users')

  let onlineUsers = await res.json()
  console.log('current online user count =', Object.keys(onlineUsers).length);

  let onlinePlayerContainer = document.querySelector('#player-list')
  onlinePlayerContainer.innerHTML = ''
  for (let userName in onlineUsers) {
    onlinePlayerContainer.innerHTML += `<div class="list-window">${userName}</div>`
  }
}

let chatMessageForm = document.querySelector('form#chat-message')
chatMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  let content = chatMessageForm.content.value
  console.log(content);
  let res = await fetch('/message', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  })
  if (res.ok) {
    chatMessageForm.reset()
  }
})

socket.on('new-message', ({ from, content }) => {
  console.log('new message from server data:', content);
  document.querySelector('.message-container').innerHTML += `<div class='message-item'>${from} : ${content}</div>`
  window.scrollTo(0, document.querySelector('.message-item:last-of-type').scrollHeight);
})
