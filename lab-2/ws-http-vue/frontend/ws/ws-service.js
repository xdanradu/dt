const globalMessages$ = new rxjs.BehaviorSubject([]);

var socket = null;
try {
    socket = io.connect('localhost:8000');

    socket.on('connect', function () {
        console.log('Connect');    
    });
  
    socket.on('message-from-server', function (entry) {
      globalMessages$.next([...globalMessages$.getValue(), entry]);
    });
  } catch (err) {
    console.log('ERROR: socket.io encountered a problem:\n', err);
  }