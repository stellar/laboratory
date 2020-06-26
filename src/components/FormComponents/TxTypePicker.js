import React from 'react';
import RadioButtonPicker from './RadioButtonPicker';

export default function TxTypePicker(props) {
	const { onUpdate, value } = props;
  return (
  	<div>
  		<RadioButtonPicker
  			className="picker--spaceBottom"
  			onUpdate={onUpdate}
  			value={value}
  			items={{'REGULAR_TX': 'Transaction','FEE_BUMP_TX': 'Fee Bump'}}
  		/>
  	</div>
  	);
}
