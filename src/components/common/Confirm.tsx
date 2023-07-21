import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React from 'react';

type Props = {
    header: string,
    message: string,
    acceptFn1?: (dec: boolean)=> void;
    acceptFn2?: (dec: boolean)=> Promise<void>;
    isOpen: boolean;

}

const Confirm: React.FC<Props> = ({header, message, acceptFn1, acceptFn2, isOpen}) => {
    
    const acceptFn = acceptFn1 == undefined ? acceptFn2 : acceptFn1;
    return <Box>
        <Dialog
          open={isOpen}
          onClose={()=>acceptFn!(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {header}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>acceptFn!(false)}>Disagree</Button>
            <Button onClick={()=>acceptFn!(true)} autoFocus>Agree</Button>
          </DialogActions>
        </Dialog>
</Box>
}




export default Confirm;