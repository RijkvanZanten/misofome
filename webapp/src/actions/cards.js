import request from 'superagent';

// Get cards
// -----------------------------------------------------------------------------
function requestCards(order_by, page) {
  return {
    type: 'REQUEST_CARDS',
    order_by,
    page
  };
}

function receiveCards(cards) {
  return {
    type: 'RECEIVE_CARDS',
    cards,
    moreCardsAvailable: cards.length === 10
  };
}

export const fetchCards = (token, page, order_by, ...param) => dispatch => {
  let order = 'desc';
  if(order_by === 'normalizedTitle') order = 'asc';

  dispatch(requestCards(order_by, page));

  request
    .get('/api/collection/card')
    .query({
      per_page: 10,
      populate: 'createdBy',
      page,
      order_by,
      order,
      ...param
    })
    .set('x-access-token', token)
    .end((err, res) => {
      if(err) throw err;
      dispatch(receiveCards(res.body));
    });
};


// Create new card
// -----------------------------------------------------------------------------
function addNewCard(card) {
  return {
    type: 'ADD_CARD',
    card,
  };
}

export function createCard(token, card) {
  return dispatch => {
    request
      .post('/api/collection/card')
      .set('x-access-token', token)
      .query({ populate: 'createdBy' })
      .send(card)
      .end((err, res) => {
        if(err) throw err;
        dispatch(addNewCard(res.body));
      });
  };
}
