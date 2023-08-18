var socket = new JsSIP.WebSocketInterface('wss://' + domain + ':8089/ws');

var configuration = {

sockets: [socket],

uri: 'sip:'+ localUser.value +'@' + domain,

authorization_user: localUser.value,

// password: ‘123456’

}
ua = new JsSIP.UA(configuration)
ua.start()
ua.on('newRTCSession', function (e) {
console.log('newRTCSession', e)
session = e.session 
if(e.originator === 'remote') {
    session.answer()
}
session.on('sdp', (data) => {
if(isChrome) {
    console.log('doing dark magic in chrome…')
    let desc = new RTCSessionDescription({
    type: data.type,
    sdp: data.sdp
})

if (data.originator === 'local') {
converted = interop.toUnifiedPlan(desc)
} else {
    converted = interop.toPlanB(desc)
}
data.sdp = converted.sdp
}
})

session.on('ended', data => {
    localVideo.src = ''
    remoteVideo.src = ''
})
session.on('confirmed', () => {
    stream = session.connection.getLocalStreams()[0]
    localVideo.srcObject = stream
})

session.connection.ontrack = evt => {
    remoteVideo.srcObject = evt.streams[0]
}

})


btnCall.addEventListener('click', () => {
var options = {
    'mediaConstraints': {
    'audio': false, 
    'video': true
}
}
session = ua.call('sip:' + remoteUser.value + '@' + domain, options)

})

btnHangup.addEventListener('click', () => {
    session.terminate()
    session = null
})