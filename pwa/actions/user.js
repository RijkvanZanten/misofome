import request from 'superagent';

function requestKey() {
  return {
    type: 'REQUEST_KEY',
  };
}

export function receiveKey(success, token, username) {
  return {
    type: 'RECEIVE_KEY',
    success,
    token,
    username,
  };
}

function authenticateUser(username, password, cb) {
  return (dispatch) => {
    dispatch(requestKey());

    request
        .post('/api/1/auth')
        .send({ username, password })
        .end((err, res) => {
          if (err) throw err;

          if (res.body.success) {
            dispatch(receiveKey(true, res.body.token, username));
            cb(true);
          } else {
            dispatch(receiveKey(false, '', ''));
          }
        });
  };
}

export function registerUser(user, cb) {
  return (dispatch) => {
    request
      .post('/api/1/auth/register')
      .send({ user })
      .end((err, res) => {
        if (err) throw err;

        if (res.body.success) {
          dispatch(receiveKey(true, res.body.token, ''));
          cb(true);
        }
      });
  };
}

export default authenticateUser;
