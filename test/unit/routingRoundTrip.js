import _ from 'lodash';
import {stateToQueryObj, queryObjToLoadStatePayload} from '../../src/utilities/stateSerializer';
import SLUG from '../../src/constants/slug';
import rootReducer from '../../src/reducers/root';
import {loadState} from '../../src/actions/routing';

// The routing system converts the state into a url, which gets converted back
// into the state thus forming an infinite loop. In general, the starting state
// should be the same as the ending state because it indicates the serialization,
// deserialization, and loading process is working correctly.
// @param {string} slug - slug constant
// @param {object} queryObj - the url query object that we start from and end at
function itCircularlyTransformsState(slug, queryObj) {
  it('circularly converts [query obj] to [state] to initial [query obj]', () => {
    let resultQueryObj = stateToQueryObj(slug,
      rootReducer(undefined,
        loadState(slug,
          queryObjToLoadStatePayload(slug, queryObj)
        )
      )
    );
    expect(resultQueryObj).to.deep.equal(queryObj);
  });
}

describe('routing system', () => {
  describe('for endpoint explorer', () => {
    describe('in an empty scenario', () => {
      itCircularlyTransformsState(SLUG.EXPLORER, {
        network: 'test',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyTransformsState(SLUG.EXPLORER, {
        endpoint: 'all',
        resource: 'transactions',
        values: 'eyJjdXJzb3IiOiI1In0=',
        network: 'test',
      });
    });
  });

  describe('for transaction builder', () => {
    describe('in a default scenario', () => {
      itCircularlyTransformsState(SLUG.TXBUILDER, {
        network: 'test',
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyTransformsState(SLUG.TXBUILDER, {
        network: 'test',
        params: 'eyJhdHRyaWJ1dGVzIjp7InNvdXJjZUFjY291bnQiOiJzb21ld2hlcmUiLCJzZXF1ZW5jZSI6Im92ZXIiLCJtZW1vVHlwZSI6Ik1FTU9fVEVYVCIsIm1lbW9Db250ZW50IjoidGhlIn0sIm9wZXJhdGlvbnMiOlt7ImlkIjowLCJhdHRyaWJ1dGVzIjp7ImRlc3RpbmF0aW9uIjoicmFpbmJvdyJ9LCJuYW1lIjoicGF5bWVudCJ9XX0=',
      });
    });
  });
});
