import PickerGenerator from './PickerGenerator';
import {Keypair} from 'stellar-sdk';

export default PickerGenerator({
  pickerName: 'SecretKey',
  fields: [{
    type: 'text',
    name: 'secretKey',
    validator: (value) => {
      try{
        Keypair.fromSeed(value);
      } catch (err) {
        return 'Invalid secret key.';
      }
      return null;
    }
  }],
});
