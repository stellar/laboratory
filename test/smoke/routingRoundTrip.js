import _ from 'lodash';
import {stateToQueryObj, queryObjToLoadStatePayload} from '../../src/utilities/stateSerializer';
import SLUG from '../../src/constants/slug';
import rootReducer from '../../src/reducers/root';
import {loadState} from '../../src/actions/routing';
import {dehydrate} from '../../src/utilities/hydration';

// The routing system converts the state into a url, which gets converted back
// into the state thus forming an infinite loop. In general, the starting state
// should be the same as the ending state because it indicates the serialization,
// deserialization, and loading process is working correctly.
// @param {string} slug - slug constant
// @param {object} queryObj - the url query object that we start from and end at
// @param {object} (endingqueryObj) - In some situations, we expect the round
//   trip to end with more parameters it started with because the routing system
//   ensures that some parameters are always set in the url. For example, we
//   always have the network setting in the url.
function itCircularlyConvertsState(slug, queryObj, endingQueryObj) {
  if (endingQueryObj === undefined) {
    endingQueryObj = queryObj;
  }

  it('circularly converts [query obj] to [state] to initial [query obj]', () => {
    let resultQueryObj = stateToQueryObj(slug,
      rootReducer(undefined,
        loadState(slug,
          queryObj
        )
      )
    );
    expect(resultQueryObj).to.deep.equal(endingQueryObj);
  });
}

describe('routing system', () => {
  describe('for endpoint explorer', () => {
    describe('in an empty scenario', () => {
      itCircularlyConvertsState(SLUG.EXPLORER, {
        network: 'test',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyConvertsState(SLUG.EXPLORER, {
        endpoint: 'all',
        resource: 'transactions',
        values: dehydrate({
          cursor: 5,
        }),
        network: 'test',
      });
    });
  });

  describe('for transaction builder', () => {
    describe('in a default scenario', () => {
      itCircularlyConvertsState(SLUG.TXBUILDER, {
        network: 'test',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyConvertsState(SLUG.TXBUILDER, {
        network: 'test',
        params: dehydrate({
          attributes: {
            sourceAccount: 'somewhere',
            sequence: 'over',
            memoType: 'MEMO_TEXT',
            memoContent: 'the'
          },
          operations: [{
            id: 0,
            attributes: {
              destination: 'rainbow'
            },
            name: 'payment'
          }]
        }),
      });
    });
  });

  describe('for transaction signer', () => {
    describe('in an empty scenario', () => {
      itCircularlyConvertsState(SLUG.TXSIGNER, {
        network: 'test',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyConvertsState(SLUG.TXSIGNER, {
        network: 'test',
        xdr: 'AAAAAOviDWZdAxfxZ83i1Dx6ZGbnSM8pxoPMrtc5VuSJSBKsAAAAZAAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAA=',
      });
    });
  });

  describe('for XDR viewer', () => {
    describe('in an empty scenario', () => {
      itCircularlyConvertsState(SLUG.XDRVIEWER, {
        network: 'test',
      }, {
        network: 'test',
        type: 'TransactionEnvelope',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyConvertsState(SLUG.XDRVIEWER, {
        network: 'test',
        type: 'TransactionEnvelope',
        input: 'AAAAAOviDWZdAxfxZ83i1Dx6ZGbnSM8pxoPMrtc5VuSJSBKsAAAAZAAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAJAAAAAAAAAAA=',
      });
    });
  });

  describe('for any page', () => {
    describe('where network is not specified and should be added ', () => {
      itCircularlyConvertsState(SLUG.EXPLORER, {
      }, {
        network: 'test',
      });
    });
  });
});
