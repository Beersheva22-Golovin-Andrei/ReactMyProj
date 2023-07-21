import { Typography } from "@mui/material"
import GoodsAddingForm from "../forms/GoodsAddingForm";
import { goodsService, userService } from "../../config/service-config";

const AddGoods: React.FC = () => {
    return <Typography variant="h4" align="center">
             <GoodsAddingForm submitFn={ async prod=>{
               return await goodsService.addProduct(prod);
            }}/> 
    </Typography>
}
export default AddGoods;