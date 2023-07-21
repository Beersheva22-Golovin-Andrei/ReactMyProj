import { Observable} from "rxjs";
import Product from "../../../model/Product";

export default interface GoodsService{
    
    getProdById (id: any): Promise<Product>;
    getAllGoods(): Observable<string | Product[]>;
    addProduct(product: Product): Promise<Product>
    updateProduct(product: Product): Promise<Product>;
    deleteProduct(id: any): Promise<void>;
}