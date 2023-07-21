import { useDispatch } from "react-redux";
import InputResult from "../../model/InputResult";
import { authActions } from "../../redux/slices/authSlice";
import LoginData from "../../model/LoginData";
import { authService } from "../../config/service-config";
import UserData from "../../model/UserData";
import SignInForm from "../forms/SignInForm";
import { Typography, Button } from "@mui/material";

const SignIn: React.FC = () => {
    const dispatch = useDispatch();

    async function submitFn(loginData?: LoginData, withGoogle?: boolean ): Promise<InputResult> {
        let inputResult: InputResult = {status: 'error',
         message: "Server unavailable, repeat later on"}
         
        if (loginData==undefined && withGoogle){
            loginData={email: 'GOOGLE', password:""};
        }

        try {
            const res: UserData = await authService.login(loginData!);
            res && dispatch(authActions.set(res));
            inputResult = {status: res ? 'success' : 'error',
            message: res ? '' : 'Incorrect Credentials'}
            
        } catch (error) {
            
        }
        return inputResult;
    }


    return <Typography>
        <SignInForm submitFn={submitFn}/>
        </Typography>

}

 export default SignIn;