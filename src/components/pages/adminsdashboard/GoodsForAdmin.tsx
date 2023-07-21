import { Delete, Edit } from "@mui/icons-material";
import { Box, Modal, Button } from "@mui/material";
import { GridColDef, GridActionsCellItem, DataGrid } from "@mui/x-data-grid";
import { useState, useRef, useEffect } from "react";
import { goodsService } from "../../../config/service-config";
import Product from "../../../model/Product";
import { useDispatchCode } from "./dispatchingCode";
import Confirm from "../../common/Confirm";
import GoodsAddingForm from "../../forms/GoodsAddingForm";


const GoodsForAdmin: React.FC = () => {

    const dispatch = useDispatchCode();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openAdding, setOpenAdding] = useState(false);
    const content = useRef('');
    const productId = useRef('');
    const product = useRef<Product | undefined>();
    const [allGoods, setAllGoods] = useState<Product[]>([]);

    function getAllColumns(): GridColDef[] {
        const unitedArray: GridColDef[] = columnsCommon;
        columnsAdmin.forEach(col => unitedArray.push(col));
        return unitedArray;
    }

    function removeProduct(id: any) {
        content.current = `You want to delete item ID ${id}`;
        productId.current = id;
        setOpenConfirm(true);
    }

    async function actualRemove(isOk: boolean): Promise<void> {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await goodsService.deleteProduct(productId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }

    async function updateProduct(prod: Product): Promise<Product | null> {
        setFlEdit(false)
        let res: Product | null = null;
        if (JSON.stringify(product.current) != JSON.stringify(prod)) {
            product.current = prod;
            let errorMessage: string = '';
            try {
                await goodsService.updateProduct(product.current!);
                res = prod;
            } catch (error: any) {
                errorMessage = error
            }
            dispatch(errorMessage, '');
        }
        return res;
    }

    const columnsAdmin: GridColDef[] = [
        {
            headerName: 'Delete/Update', flex: 0.6, headerClassName: 'data-grid-header',
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => removeProduct(params.id)} />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => {
                            if (params.row) {
                                const prod = params.row;
                                prod && (product.current = prod);
                                setFlEdit(true)
                            }
                        }} />
                ];
            }
        }]

    useEffect(() => {
        const subscriptionGoods = goodsService.getAllGoods().subscribe({
            next(allGoods: Product[] | string) {
                if (typeof allGoods != 'string') {
                    setAllGoods(allGoods);
                }
            }
        });
        return () => {
            subscriptionGoods.unsubscribe();
        };
    }, [])

    async function addingNewProd(prod: Product): Promise<Product | null> {
        let res: Product | null = prod;
        let errorMessage: string = '';
        try {
            await goodsService.addProduct(prod);
        } catch (error: any) {
            errorMessage = error;
            res = null;
        }
        dispatch(errorMessage, '');
        return res
    }
    return <Box sx={{
        display: 'flex', justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" onClick={() => setOpenAdding(true)}>Add new product</Button>
        </Box>
        <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={getAllColumns()} rows={allGoods} />
        </Box>
        <Confirm header="Delete?" message={content.current} acceptFn2={actualRemove} isOpen={openConfirm} />
        <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <GoodsAddingForm submitFn={updateProduct} product={product.current} />
            </Box>
        </Modal>
        <Modal
            open={openAdding}
            onClose={() => setOpenAdding(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <GoodsAddingForm submitFn={addingNewProd} />
            </Box>
        </Modal>
    </Box>
}

export default GoodsForAdmin;

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const columnsCommon: GridColDef[] = [
    { field: 'imageLink', headerName: 'Image', flex: 0.5, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center', renderCell: (params) => <img src={params.value} width={50} height={50} /> },
    { field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    { field: 'avalability', headerName: 'Stock avalability', flex: 0.8, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    { field: 'price', headerName: "Price", flex: 0.8, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    { field: 'description', headerName: 'Description', flex: 0.6, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    { field: 'notice', headerName: 'Notice', flex: 0.6, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' }
];

