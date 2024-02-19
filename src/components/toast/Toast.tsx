import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react';

export default function Toast(props: { show: boolean; message?: string }) {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    setShowSnackbar(props.show);
  }, [setShowSnackbar, props.show]);

  const handleClose = () => {
    setShowSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar open={showSnackbar} autoHideDuration={5000} action={action}>
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {props.message
          ? props.message
          : 'There was an error processing your request'}
      </Alert>
    </Snackbar>
  );
}
