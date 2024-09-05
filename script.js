const socket = io();

const promptElement = document.getElementById('prompt');

const roomIdDisplay = document.getElementById('room-id-display');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
if (roomId) {
  roomIdDisplay.innerText = `${roomId}`;
}

if (roomId) {
  socket.emit('joinRoom', roomId);
  // Disable the join room button to prevent multiple joins
}

// Function to update the prompt's content and style
function updatePrompt(message, type) {
  promptElement.textContent = message;
  promptElement.className = `prompt ${type}`;
  setTimeout(() => {
    promptElement.textContent = '';
    promptElement.className = 'prompt';
  }, 3000); 
}

    let username;
    socket.on('requestUsername', (roomId) => {
      while(!username) {
        username = prompt('Please enter your name:');
        if (!username) {
          alert('Username cannot be empty. Please try again.');
        }
      }
      roomIdDisplay.innerText = roomId;
      socket.emit('submitUsername', username);
    });

    // Join room
    document.getElementById('join-room').addEventListener('click', () => {
      const roomId = document.getElementById('room-id').value;
      socket.emit('joinRoom', roomId);
    });

    // Leave room
    document.getElementById('leave-room').addEventListener('click', () => {
      const roomId = document.getElementById('room-id').value;
      socket.emit('leaveRoom', roomId);
      // Clear the chat log
      document.getElementById('chat-log').innerHTML = '';
    });

    // Send message
    document.getElementById('send-message').addEventListener('click', () => {
      const message = document.getElementById('message-input').value;
      const roomId = document.getElementById('room-id').value;
      socket.emit('sendMessage', roomId, message, username);
      document.getElementById('message-input').value = '';
    });

    // Display new messages
    socket.on('newMessage', (message, senderUsername) => {
      const chatLog = document.getElementById('chat-log');
      const messageElement = document.createElement('p');
      messageElement.innerText = `${senderUsername}: ${message}`;
      chatLog.appendChild(messageElement);
      chatLog.scrollTop = chatLog.scrollHeight;
    });

    // Listen for new user joined event
    socket.on('newUserJoined', (message) => {
      console.log(message);
      updatePrompt(message, 'join');
      setTimeout(() => {
        promptElement.innerText = '';
      }, 3000);
    });

    // Listen for user left event
    socket.on('userLeft', (message) => {
      console.log(message);
      updatePrompt(message, 'leave');
      // Hide the prompt after a few seconds
      setTimeout(() => {
        promptElement.innerText = '';
      }, 3000);
    });

    socket.on('onlineUsers', (users) => {
      const onlineUsersElement = document.getElementById('online-users');
      onlineUsersElement.innerHTML = '';
      users.forEach((user) => {
        const userElement = document.createElement('p');
        const onlineIcon = document.createElement('i');
        onlineIcon.className = 'fas fa-circle text-green-500'; // Use a green circle icon
        userElement.appendChild(onlineIcon);
        userElement.appendChild(document.createTextNode(` ${user.username}`));
        onlineUsersElement.appendChild(userElement);
      });
    });

    const themeToggle = document.getElementById('theme-toggle');
      let isDarkTheme = false;

      themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
          document.body.classList.add('dark-theme');
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          document.body.classList.remove('dark-theme');
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
      });
      const shareRoomButton = document.getElementById('share-room');
      shareRoomButton.addEventListener('click', () => {
        const roomId = roomIdDisplay.innerText;
        console.log(roomId)
        const roomUrl = `${window.location.origin}?roomId=${roomId}`;
        const shareLink = document.createElement('textarea');
        shareLink.value = roomUrl;
        document.body.appendChild(shareLink);
        shareLink.select();
        document.execCommand('copy');
        document.body.removeChild(shareLink);
        alert(`Room link copied to clipboard: ${roomUrl}`);
      });