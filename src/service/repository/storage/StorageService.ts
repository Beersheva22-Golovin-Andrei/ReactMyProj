import { StorageReference } from "firebase/storage";

export default interface StorageService{
    
    uploadImg (image: File, id:any): Promise<StorageReference>;
    getImg (name?:string, storageRef?: StorageReference): Promise<string>;
}