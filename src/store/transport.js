import __axios from 'axios';
import __socket from 'socket.io-client';

export function throwOnError(result) {
  return result.then(function (response) {
    return response.data && response.data.data;
  }).catch(function (err) {
    if (err.response && typeof err.response.data === 'object') {
      const error = new Error();
      Object.assign(error, err.response.data);
      throw error;
    } else {
      err.code = 0;
      err.type = 'REQUEST';
      throw err;
    }
  });
}

let _axios = null,
  _socket = null,
  sioHandlers = {};

export function axios() {
  return _axios;
}

export function socket() {
  return _socket;
}

export function setAxios(baseURL) {
  return _axios = __axios.create({baseURL});
}

export function setSocket(server) {
  if (_socket)
    _socket.close();
  if (server) {
    _socket = __socket(server, {
      transports: ['websocket']
    });
    const onevent = _socket.onevent;
    _socket.onevent = function (packet) {
      const args = packet.data || [];
      onevent.call (this, packet);
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);
    };

    for (let event in sioHandlers)
      if (sioHandlers.hasOwnProperty(event))
        for (let handler of sioHandlers[event])
          _socket.on(event, handler);
    return _socket;
  } else
    return _socket = null;
}

export function addSioHandler(event, handler) {
  if (sioHandlers[event] === undefined)
    sioHandlers[event] = new Set();
  if (!sioHandlers[event].has(handler)) {
    sioHandlers[event].add(handler);
    if (_socket)
      _socket.on(event, handler);
  }
}

export function removeSioHandler(event, handler) {
  if (sioHandlers[event] !== undefined) {
    if (sioHandlers[event].has(handler)) {
      sioHandlers[event].delete(handler);
      if (_socket)
        _socket.removeEventListener(event, handler);
    }
    if (sioHandlers[event].size === 0)
      delete sioHandlers[event];
  }
}

export function objectToFormData(object) {
  const data = new FormData();
  Object.keys(object).forEach(key => {
    if (typeof object[key] !== 'object' || object[key] instanceof File)
      data.append(key, object[key]);
    else if (typeof object[key].toJSON === 'function')
      data.append(key, object[key].toJSON());
    else
      data.append(key, JSON.stringify(object[key]));
  });
  return data;
}
