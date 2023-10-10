const socket = io();

let username = '';

function setUsername() {
    const input = document.getElementById('username');
    username = input.value;
    if (username) {
        input.disabled = true;
        document.getElementById('adminCheckbox').style.display = 'block';
        if (document.getElementById('isAdmin').checked) {
            document.getElementById('revealButton').style.display = 'block';
        } else {
            document.getElementById('votingButtons').style.display = 'block';
        }
    }
}

function castVote(value) {
    if (!username) {
        alert('Please set your name first.');
        return;
    }
    socket.emit('vote', { user: username, value });
    if (document.getElementById('isAdmin').checked) {
        document.getElementById('revealButton').style.display = 'block';
    }
}

function revealVotes() {
    socket.emit('reveal');
}

socket.on('voteCount', (count) => {
    document.getElementById('results').textContent = `${count} votes cast`;
});

socket.on('revealVotes', (votes) => {
    let results = '';
    for (let vote in votes) {
        results += `User ${vote}: ${votes[vote]}<br>`;
    }
    document.getElementById('results').innerHTML = results;
});
