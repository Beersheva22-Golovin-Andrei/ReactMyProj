import { Timestamp } from "firebase/firestore";
import Product from "./Product";
import UserData from "./UserData";
type Order = {
    id?: any
    orderDate: Date;
    customer?: string;
    goods: Product[];
    counts: number[]
    status: string;
}
export default Order;