import {xdr, StrKey} from 'stellar-sdk';

// converts string keys representing muxed accounts `M...` to their ED25519 public account `G..`
export default function convertMuxedAccountToEd25519Account(muxedAccount) {
    if (muxedAccount.startsWith('G')) {
        return muxedAccount;
    }

    const raw = StrKey.decodeMuxedAccount(muxedAccount)
    const muxed = xdr.MuxedAccount.fromXDR(raw)
    return StrKey.encodeEd25519PublicKey(muxed.med25519().ed25519())
}
