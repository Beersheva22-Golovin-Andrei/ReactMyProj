import { Observable} from "rxjs";
import Order from "../../../model/Order";

export default interface OrdersService{
    
    getAllOrders(): Observable<string | Order[]>;
    addOrder(order: Order): Promise<Order>;
    updateOrder(order: Order): Promise<Order>;
    deleteOrder(id: any): Promise<void>;
    
}