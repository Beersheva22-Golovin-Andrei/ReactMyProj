import { CollectionReference, DocumentReference, FirestoreError, addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";
import { Observable, catchError, of } from "rxjs";

import appFirebase from "../../../config/firebase-config";
import { getErrorMessage } from "../users/UserServiseFire";
import Product from "../../../model/Product";
import GoodsService from "../goods/GoodsService";

export default class GoodsServiceFire implements GoodsService {

    private collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'goods');

    getAllGoods(): Observable<string | Product[]> {
        return collectionData(this.collectionRef, {idField: 'id'}).pipe(catchError(error => {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            return of(errorMessage)
        })) as Observable<string | Product[]>        
    }
    
    async  getProdById (id: any): Promise<Product> {
        let docSnap = null;
        try {
        const docRef: DocumentReference =  doc(this.collectionRef, id);
        docSnap = await getDoc(docRef);
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            throw getErrorMessage(firestorError);
        }
        return docSnap.data() as Product;

    }

    async addProduct(prod: Product): Promise<Product> {
        //const id: string = await this.getId();
        //const employee = convertEmployee(empl, id);
        let addedOrderRef: any;
        try {
            addedOrderRef = await addDoc(this.collectionRef, prod)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        prod.id = addedOrderRef.id;
        return prod;
    }

    async updateProduct(order: Product): Promise<Product> {
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

    async deleteProduct(id: any): Promise<void> {
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