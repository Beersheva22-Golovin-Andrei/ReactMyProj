import { Observable, catchError, of } from "rxjs";
import UserService from "./UserService";

import {CollectionReference, DocumentReference, getFirestore,
     collection, getDoc,FirestoreError, setDoc, deleteDoc, doc} from 'firebase/firestore';
import {collectionData} from 'rxfire/firestore'   
import appFirebase from "../../../config/firebase-config";
import UserData from "../../../model/UserData";


// const MIN_ID = 100000;
// const MAX_ID = 1000000;

//??????????
// function convertEmployee(user: UserData, id?: string): any {
//     const res: any = {...user, id: id ? id : user.id,
//          birthDate: getISODateStr(user.birthDate)}
//          return res;
// }



export default class UserServiceFire implements UserService {

    private collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'users');


     async  getUserById (id: any): Promise<UserData> {
        let docSnap = null;
        try {
        const docRef: DocumentReference =  doc(this.collectionRef, id);
        docSnap = await getDoc(docRef);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            throw getErrorMessage(firestorError);
        }
        return docSnap.data() as UserData;

    }

    async addUser(user: UserData, id:any): Promise<UserData> {
        //const id: string = await this.getId();
        //const employee = convertEmployee(empl, id);
        const docRef = doc(this.collectionRef, id);
        try {
            await setDoc(docRef, user)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return user;
    }
    // private getDocRef(id: string): DocumentReference {
    //     return doc(this.collectionRef, id);
    // }


    // private async  getId(): Promise<string> {
    //     let id: string = '';
    //     do {
    //         id = getRandomInt(MIN_ID, MAX_ID).toString();
    //     }while (await this.exists(id));
    //     return id;
    // }
    async updateUser(user: UserData): Promise<UserData> {
        if (user && (!user.id ||!await this.isExist(user.id))) {
            throw 'not found';
        }
        //const employee = convertEmployee(user);
        const docRef = doc(this.collectionRef, user!.id);
        try {
            await setDoc(docRef, user)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return user;
    }

    getAllUsers(): Observable<string | UserData[]> {
        return collectionData(this.collectionRef, {idField: 'id'}).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | UserData[]>        
    }
    async deleteUser(id: any): Promise<void> {
        const docRef = doc(this.collectionRef, id);
        if (!await this.isExist(id)) {
            throw 'not found';
        }
        try {
            await deleteDoc(docRef);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
    }

    private async  isExist(id: string): Promise<boolean> {
        const docRef: DocumentReference =  doc(this.collectionRef, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();

    }
}

export function getErrorMessage(firestoreError: FirestoreError): string {
    let errorMessage = '';
    switch(firestoreError.code) {
        case "unauthenticated":
            case "permission-denied": errorMessage = "Authentication"; break;
        default: errorMessage = firestoreError.message;
    }
    return errorMessage;
}