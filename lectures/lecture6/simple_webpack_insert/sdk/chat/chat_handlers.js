const io = require('socket.io-client')
let socket;
let username;
let chatsDivId;

function setUpSocketCommunication(recipient) {
    function appendMessage(messageDiv) {
        let chatMessages = document.getElementById('chatMessages' + recipient);

        if (!chatMessages) {
            createChatBox(chatsDivId);
        }

        setTimeout(() => {
            chatMessages = chatMessages || document.getElementById('chatMessages' + recipient);
            chatMessages && chatMessages.appendChild(messageDiv);
        }, 0);
    }

    // Send a private message
    document.getElementById('chatBox' + recipient).addEventListener('submit', function (e) {
        const messageInput = document.getElementById('messageInput' + recipient);
        const message = messageInput.value.trim();
        e.preventDefault();
        const to = recipient;
        if (to && message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent-message';
            messageDiv.textContent = message;
            appendMessage(messageDiv);

            socket.emit('send private message', {from: username, to, message});
            messageInput.value = '';
            messageInput.focus();
        }
    });

    // Receive private messages
    socket.on('receive private message', function (data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received-message';
        messageDiv.textContent = data.message;
        appendMessage(messageDiv, data.username);
    });

    // Handle errors for private messages
    socket.on('private message error', function (error) {
        alert(error);
    });
}

function addUserOnline(username, password) {
    socket = io('http://localhost:8081');

    // fetch post request for login and auth
    socket.emit('store user', username);
}

function createChatBox(divId, recipient) {
    fetch('http://localhost:8080/chat', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: recipient
        })
    })
        .then(result => result.text())
        .then(body => {
            const chatBoxDiv = document.createElement('div');
            chatBoxDiv.innerHTML = body;
            console.log(divId)
            document.getElementById(divId).appendChild(chatBoxDiv);
            setUpSocketCommunication(recipient);
        })
}

module.exports = {createChatBox, addUserOnline}