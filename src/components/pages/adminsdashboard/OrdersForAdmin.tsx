import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import DeleteIcon from '@mui/icons-material/Delete';
import { ordersService, authService, userService } from '../../../config/service-config';
import Order from '../../../model/Order';
import UserData from '../../../model/UserData';
import { useSelectorOpenDetails } from '../../../redux/store';
import stages from '../../../config/orders-config.json'
import Selector from '../../common/Selector';
import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Modal, TableContainer, TablePagination, Typography } from '@mui/material';
import { detailsAction } from '../../../redux/slices/detailsSlice';
import Product from '../../../model/Product';





const {ordersStages} = stages;

const OrdersForAdmin: React.FC = () => {
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = React.useState<UserData[]>([]);
  const [allOrders, setAllOrders] = React.useState<Order[]>([]);
  const [orderForDetails, setOrderForDetails] = React.useState<Order>();
  const openDetailsModal = useSelectorOpenDetails();

  React.useEffect(() => {
    const subscriptionOrders = ordersService.getAllOrders().subscribe({
      next(allOrders: Order[] | string) {
        if (typeof allOrders != 'string') {
          setAllOrders(allOrders.map(e => ({ ...e, orderDate: new Date(e.orderDate) })));
        }
      }
    });
    const subscriptionUsers = userService.getAllUsers().subscribe({
      next(allUsers: UserData[] | string) {
        if (typeof allUsers != 'string') {
          setAllUsers(allUsers);
        }
      }
    });
    return () => {
      subscriptionOrders.unsubscribe();
      subscriptionUsers.unsubscribe();

    };
  }, [])

  function openDetailHandler(order: Order): void {
    setOrderForDetails(order);
    dispatch(detailsAction.set());
  }

  function getRowsForDetails(): JSX.Element[] {
    let res:  JSX.Element[] = [];  
    if (orderForDetails!= undefined) {
    res = orderForDetails!.goods.map((prod, index) => <TableRow
        key={prod.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row"> <img src={prod.imageLink} style={{ height: '100px', width: '100px' }} /> </TableCell>
        <TableCell align="right">{prod.name}</TableCell>
        <TableCell align="right"> {orderForDetails.counts[index]}</TableCell>
        <TableCell align="right">{prod.price}</TableCell>
        <TableCell align="right">{prod.price * orderForDetails.counts[index]}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="delete" onClick={() => deleteFromDetailsHandle(prod)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>)
    }
      return res;
  }

  async function deleteFromDetailsHandle(product: Product): Promise<void> {
    const indexForDelete = orderForDetails!.goods.findIndex(prod => prod.id == product.id);
    const copyOrderObj: Order = JSON.parse(JSON.stringify(orderForDetails));

    const prodArr: Product[] = copyOrderObj.goods;
    const countArr: number[] = copyOrderObj.counts;
    
    if (indexForDelete == 0 && prodArr.length == 1) {
      dispatch(detailsAction.reset());
      await ordersService.deleteOrder(product.id);
      setOrderForDetails(undefined);
    }
    prodArr.splice(indexForDelete, 1);
    countArr.splice(indexForDelete, 1);
    await ordersService.updateOrder(copyOrderObj);
    setOrderForDetails(copyOrderObj);
  }

async function updateStatus(selected:string, orderForUpdate:Order){
  //const orderForUpdate = allOrders.find(ord=>ord.id===orderId);
  if (orderForUpdate!=undefined){
    orderForUpdate.status = selected;
    const copyObj: Order = JSON.parse(JSON.stringify(orderForUpdate));
    await ordersService.updateOrder(copyObj);
  }
}

  return (
    <React.Fragment>
      <h3 >Orders</h3>
      <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order Id</TableCell>
            <TableCell>Orders Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total price</TableCell>
            <TableCell>Orders status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allOrders.map((ord) => (
            <TableRow key={ord.id}>
              <TableCell>
                <Button onClick={()=>openDetailHandler(ord)}>{ord.id}</Button>
              </TableCell>
              <TableCell>{ord.orderDate.toDateString()}</TableCell>
              <TableCell>{(() => {
                const user= allUsers.find(user=>user!.id===ord.customer);
                return user?.name + " " + user?.lastName;
              })()}</TableCell>
              <TableCell>{ord.goods.reduce((a, b, index) => a + b.price * ord.counts[index], 0)}</TableCell>
              <TableCell>
                <Selector items={ordersStages} nameSelector={'Set status'} selctorId={'status-selector-id'}
                 first={ord.status} submitFn={updateStatus} order={ord}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
      <Modal
        open={openDetailsModal}
        onClose={() => { }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
            {'Goods in order N ' + orderForDetails?.id}
          </Typography>
          
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Product name</TableCell>
                    <TableCell align="center">Count</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Total price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getRowsForDetails()}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
          <Box sx={{textAlign: 'center'}}>
          <Button variant="contained" onClick={() => dispatch(detailsAction.reset())}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default OrdersForAdmin;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};