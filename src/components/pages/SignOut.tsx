import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Button, Typography } from '@mui/material';
import Confirm from '../common/Confirm';
import { useState } from 'react';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);

    function acceptFn(decision: boolean) {
            if (decision) {
                dispatch(authActions.reset())
            }
            setOpenConfirm(false);
        }

    return <Typography>
    <Button onClick={()=>setOpenConfirm(true)}>sign out</Button>
    <Confirm header="Sign out" message="Are you really want to exit?" acceptFn1={acceptFn} isOpen={openConfirm} />
    </Typography>
}
 
 export default SignOut;


 //() => dispatch(authActions.reset())