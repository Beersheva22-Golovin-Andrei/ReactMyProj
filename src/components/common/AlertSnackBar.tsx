import { Snackbar, Alert } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { StatusType } from "../../model/StatusType";

type Props = {
    message: string;
    duration?: number;
    severity: StatusType;
}
const DEFAULT_DURATION = 20000
const AlertSnackBar: React.FC<Props> = ({message, duration, severity}) => {
    const [open, setOpen] = useState(false);
    const alertMessage = useRef('')
    useEffect(() => {
        message && setOpen(true);
        alertMessage.current = message;
    }, [message])
    return <Snackbar open={open} autoHideDuration={duration || DEFAULT_DURATION}
                     onClose={() => setOpen(false)}>
                        <Alert  onClose = {() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
}
export default AlertSnackBar;