import { CollectionReference, DocumentReference, FirestoreError, addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";
import { Observable, catchError, of } from "rxjs";
import Order from "../../../model/Order";
import OrdersService from "./OrdersService";

import appFirebase from "../../../config/firebase-config";
import { getErrorMessage } from "../users/UserServiseFire";

export default class OrdersServiceFire implements OrdersService {

    private collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'orders');

    getAllOrders(): Observable<string | Order[]> {
        return collectionData(this.collectionRef, {idField: 'id'}).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | Order[]>        
    }

//     const querySnapshot = await getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });
    
     async addOrder(order: Order): Promise<Order> {
        //const id: string = await this.getId();
        //const employee = convertEmployee(empl, id);
        let addedOrderRef: any;
        try {
            addedOrderRef = await addDoc(this.collectionRef, order)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        order.id = addedOrderRef.id;
        return order;
    }

    async updateOrder(order: Order): Promise<Order> {
        if (order && (!order.id ||!await this.isExist(order.id))) {
            throw 'not found';
        }
        //const employee = convertEmployee(user);
        const docRef = doc(this.collectionRef, order!.id);
        try {
            await setDoc(docRef, order)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return order;
    }

    async deleteOrder(id: any): Promise<void> {
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