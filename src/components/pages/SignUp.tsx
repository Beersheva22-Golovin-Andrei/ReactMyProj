import { Typography } from "@mui/material";
import { registrationService, authService } from "../../config/service-config";
import InputResult from "../../model/InputResult";
import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import { authActions } from "../../redux/slices/authSlice";
import SignUpForm from "../forms/SignUpForm";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    async function submitFn(user: UserData): Promise<InputResult> {
        let inputResult: InputResult = {status: 'error',
         message: "Server unavailable, repeat later on"}
        try {
            const res: UserData = await registrationService.getRegistered(user);
            inputResult = {status: res ? 'success' : 'error',
            message: res ? '' : 'Incorrect Credentials'}
        } catch (error) {
            
        }
        navigate('/signin');
        return inputResult;
    }
    return <Typography>
        <SignUpForm submitFn={submitFn}/>
    </Typography>
}
 
 export default SignUp;