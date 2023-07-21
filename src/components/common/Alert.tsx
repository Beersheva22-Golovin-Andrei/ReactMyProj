import { CSSProperties } from "react";
import { StatusType } from "../../model/StatusType";

type Props = {
    status: StatusType;
    message: string;
}
const statusProps: Map<StatusType,CSSProperties> = new Map([
   ["error",{backgroundColor: "lightpink"}],
   ["success",{backgroundColor: "lightgreen"}],
   ["warning", {backgroundColor: "yellow"}],
   
])
const Alert: React.FC<Props> = ({status, message}) => {
    return <div>
        <p style={statusProps.get(status)}>{message}</p>
    </div>
}
export default Alert;
