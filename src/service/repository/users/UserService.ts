import { Observable } from "rxjs";
import UserData from "../../../model/UserData";


export default interface UserService{
    getUserById (id: any): Promise<UserData>;
    addUser(user: UserData, id:any):Promise<UserData | null>;
    getAllUsers(): Observable<UserData[] | string>;
    deleteUser(id:any): Promise<void>;
    updateUser(empl: UserData): Promise<UserData|null> 
}