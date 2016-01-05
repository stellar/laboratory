import PickerGenerator from './PickerGenerator';
import {Keypair} from 'stellar-sdk';

export default PickerGenerator({
  pickerName: 'SecretKey',
  fields: [{
    type: 'text',
    name: 'secretKey',
    placeholder: 'Example: SAEXAMPLE6TLGEF6ASOTVTLFUK7LE2K2PFVPFGTEZMMVHH7KLLBBROEQ',
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
