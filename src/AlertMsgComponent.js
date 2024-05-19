/**
 * this component is use to display the alert msg of any type 
 * @input props require "alertType" and "alertBody"
 */
import React, { useState } from 'react';
import { Alert } from 'reactstrap';

const AlertMsgComponent = (props) => {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert color={props.alertType} isOpen={visible} toggle={onDismiss}>
        {props.alertBody ? props.alertBody : "Something went wrong."}
    </Alert>
  );
}

export default AlertMsgComponent