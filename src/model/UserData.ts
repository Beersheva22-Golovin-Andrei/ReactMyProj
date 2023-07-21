import Order from "./Order";
import Product from "./Product";

type UserData = {
    id?: any
    email: string;
    password: string;
    isAdmin?: boolean;
    name: string;
    lastName: string;
    address?: string;
    cart?: Order;
} | null
export default UserData;