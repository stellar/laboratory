import {dehydrate} from './hydration';

// The store serializer is used to convert the store of a specific page into a
// object of strings to be used in the url hash param.
// It takes in a page slug and will return the string for that specific store
export default function storeSerializer(slug, state) {
  switch (slug) {
    case 'endpoints':
      let endpointsResult = {};
      if (state.endpointExplorer.currentResource) {
        endpointsResult.resource = state.endpointExplorer.currentResource;
      }
      if (state.endpointExplorer.currentEndpoint) {
        endpointsResult.endpoint = state.endpointExplorer.currentEndpoint;
        endpointsResult.params = dehydrate(state.endpointExplorer)
      }
      return endpointsResult;
    case 'txbuilder':
      return {
        params: dehydrate(state.transactionBuilder),
      };
    case 'txsigner':
      // We only want to serialize the imported xdr and not the saved secret key
      // to prevent sensitive data being stored in browser history.
      let txsignerResult = {};
      if (state.transactionSigner.tx.xdr.length > 0) {
        txsignerResult.xdr = state.transactionSigner.tx.xdr;
      }
      return txsignerResult;
    default:
      return {};
  }
}
