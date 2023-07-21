import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService from "./AuthService";
import {getFirestore, collection, getDoc, doc} from "firebase/firestore";
import {GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import appFirebase from "../../config/firebase-config";
import { userService } from "../../config/service-config";


export default class AuthServiceFire implements AuthService {
    private auth = getAuth(appFirebase);
    private administrators = collection(getFirestore(appFirebase), 'administrators');
    
    private async isAdmin(uid: any): Promise<boolean> {
        const docRef = doc(this.administrators, uid)
        return (await getDoc(docRef)).exists();
    }

    async login(loginData: LoginData): Promise<UserData> {
        let userData: UserData = null;
        try {
            const userAuth = loginData.email === "GOOGLE" ? 
            await signInWithPopup (this.auth, new GoogleAuthProvider()) :
            await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
            const id = userAuth.user.uid;
            userData = await userService.getUserById(id);
            const isAdmin:boolean = await this.isAdmin(id);
            if (userData === undefined){
                userData = {id: id, email: userAuth.user.email!, isAdmin: isAdmin, name: "admin", lastName: "admin", password: loginData.password};
            } else {
                userData!.id = id;
            }
          
                
        } catch (error: any) {
            console.log(error.code, error)
        }
        return userData;
    }

    logout(): Promise<void> {
        return signOut(this.auth);
    }
    
}



