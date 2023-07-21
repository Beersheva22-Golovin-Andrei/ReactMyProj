import { authService, userService } from "../../config/service-config";
import UserData from "../../model/UserData";
import RegistartionUserService from "./RegistartionUserService";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default class RegistrationUserServiceFire implements RegistartionUserService {

  private auth = getAuth();

  getRegistered(user: UserData): UserData {
    if (user) {
      createUserWithEmailAndPassword(this.auth, user.email, user.password)
        .then(async (userCredential) => {
          const userCred = userCredential.user;
          await userService.addUser(user, userCred.uid);
          //await authService.login({ email: user.email, password: user.password });
          user.id = userCred.uid;
        })
        .catch((error) => {
          throw (error.message)
        });
    }
    return user;
  }

}