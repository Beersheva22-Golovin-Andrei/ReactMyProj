import UserData from "../../model/UserData";

export default interface RegistartionUserService {

    getRegistered(user: UserData): UserData;
}