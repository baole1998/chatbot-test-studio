import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DefaultSnackBar({...props}) {
    const { message, open, onClose, ...other } = props

    return (
        <Snackbar 
            open={open} 
            autoHideDuration={2000} 
            onClose={() => onClose(true)} 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
            <Alert 
                onClose={() => onClose(true)}  
                sx={{ width: '100%' }}
                {...other}
                >
            {message}
            </Alert>
        </Snackbar>
    );
}