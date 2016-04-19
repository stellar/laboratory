import _ from 'lodash';
import {stateToQueryObj, queryObjToLoadStatePayload} from '../../src/utilities/stateSerializer';
import SLUG from '../../src/constants/slug';
import rootReducer from '../../src/reducers/root';
import {loadState} from '../../src/actions/routing';

// The routing system converts the state into a url, which gets converted back
// into the state thus forming an infinite loop. In general, the starting state
// should be the same as the ending state because it indicates the serialization,
// deserialization, and loading process is working correctly.
// @param {string} opts.slug - slug constant
// @param {object} opts.initialState - the state when we start with
// @param {object} opts.intermediateQueryObj - converted from initialState using stateToQueryObj
// @param {object} opts.intermediateLoadStatePayload - converted from intermediateQueryObj using queryObjToLoadStatePayload
// @param {object} (opts.endingQueryObj) - Some times, we do want to ending state to
//   be different from the starting one. For example, the stateSerializer always
//   includes the network if it is in the state, and the reducers ensure that the
//   network state is set.
function itCircularlyTransformsState(opts) {
  opts = _.assign({}, opts);

  if (opts.slug === undefined ||
      opts.initialState === undefined ||
      opts.intermediateQueryObj === undefined ||
      opts.intermediateLoadStatePayload === undefined) {
    throw new Error('test case is missing an option parameter');
  }

  if (opts.endingQueryObj === undefined) {
    opts.endingQueryObj = opts.initialState;
  }

  it('correctly converts [state] to [query obj]', () => {
    expect(stateToQueryObj(opts.slug, opts.initialState)).to.deep.equal(opts.intermediateQueryObj);
  });
  it('correctly converts [query obj] to [load state payload]', () => {
    expect(queryObjToLoadStatePayload(opts.slug, opts.intermediateQueryObj)).to.deep.equal(opts.intermediateLoadStatePayload);
  });
  it('correctly converts [load state payload] to [state] to [query obj]', () => {
    expect(
      stateToQueryObj(opts.slug,
        rootReducer(undefined,
          loadState(opts.slug,
            opts.intermediateLoadStatePayload
          )
        )
      )
    ).to.deep.equal(opts.intermediateQueryObj);
  });
}

describe('routing system (state serializer and reducer state loading)', () => {
  describe('for endpoint explorer', () => {
    describe('in an empty scenario', () => {
      itCircularlyTransformsState({
        slug: SLUG.EXPLORER,
        initialState: {
          endpointExplorer: {
            currentEndpoint: '',
            currentResource: '',
            pendingRequest: {
              values: {},
            },
          },
          network: {
            current: 'test',
          },
        },
        intermediateQueryObj: {
          network: 'test',
        },
        intermediateLoadStatePayload: {
          network: 'test',
        },
      });
    });

    describe('in a configured scenario', () => {
      itCircularlyTransformsState({
        slug: SLUG.EXPLORER,
        initialState: {
          endpointExplorer: {
            currentEndpoint: 'all',
            currentResource: 'transactions',
            pendingRequest: {
              values: {
                cursor: '5',
              },
            },
          },
          network: {
            current: 'test',
          },
        },
        intermediateQueryObj: {
          endpoint: 'all',
          resource: 'transactions',
          values: 'eyJjdXJzb3IiOiI1In0=',
          network: 'test',
        },
        intermediateLoadStatePayload: {
          endpoint: 'all',
          resource: 'transactions',
          values: {
            cursor: '5',
          },
          network: 'test',
        },
      });
    });
  });
});
