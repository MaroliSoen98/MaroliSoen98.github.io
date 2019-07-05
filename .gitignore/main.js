const socket = io('https://stream3007.herokuapp.com/');

$('#div-chat').hide();

socket.on('List_Online', arrUserInfo => {
    $('#div-chat').show();
    $('#div-register').hide();

    arrUserInfo.forEach(user => {
        const { name,peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    });

    socket.on('Guest', user => {
        const { name,peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    });

    socket.on('who has connected', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('isExist', () => alert('Please choose another username!'));


function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config); 
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));
var peer = new Peer(); 

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('Reco-009', {name: username, peerId: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
});

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});