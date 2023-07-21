import { CollectionReference, DocumentReference, FirestoreError, collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";
import { Observable, catchError, of } from "rxjs";

import appFirebase from "../../../config/firebase-config";
import { getErrorMessage } from "../users/UserServiseFire";

import { StorageReference, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import StorageService from "./StorageService";

export default class StorageServiceFire implements StorageService {

    private storage = getStorage();
    private storageRef = ref(this.storage);
    private imagesRef = ref(this.storageRef, 'images');
   
    async uploadImg (image: File, name:string): Promise<StorageReference> { 
        const fileName = `images/${name}.jpg`
        const newImgRef = ref(this.storage, fileName);
        const metadata = { 
            contentType: 'image/jpeg',
          };
        try {
          await uploadBytes(newImgRef, image, metadata)
        } catch (error: any) {
            const firestorError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestorError);
            throw errorMessage;
        }
        return newImgRef;
        }
        
    
    async getImg (name?:string, storageRef?: StorageReference): Promise<string> {
        const newImgRef: StorageReference = name==undefined ? storageRef! : ref(this.storage, `images/${name}.jpg`);
        const newLink = await getDownloadURL(newImgRef)
        return newLink;
       
    }


    
}