import { useDispatch } from "react-redux";
import { codeAction } from "../../../redux/slices/codeSlice";
import CodeType from "../../../model/CodeType";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        
        if (error.includes('Authentication')) {

            code = CodeType.AUTH_ERROR;
            message = "Authentication error, mooving to Sign In";
        } else {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR :
                CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeAction.set({ code, message: message || successMessage }))
    }
}