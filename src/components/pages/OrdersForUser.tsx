import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ordersService, authService } from '../../config/service-config';
import CodeType from '../../model/CodeType';
import Order from '../../model/Order';
import { authActions } from '../../redux/slices/authSlice';
import { codeAction } from '../../redux/slices/codeSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Product from '../../model/Product';
import { Button, ButtonGroup, Typography } from '@mui/material';
import UserData from '../../model/UserData';
import { useSelectorAuth } from '../../redux/store';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const OrdersForUser: React.FC = () => {
  const [sort, setSort] = useState<'all'|'compl'|'proc'>('all');
  const currentUser: UserData = useSelectorAuth();
  const dispatch = useDispatch();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  React.useEffect(() => {
    const subscription = ordersService.getAllOrders().subscribe({
      next(allOrders: Order[] | string) {
        if (typeof allOrders == 'string') {
          if (allOrders.includes('Authentication')) {
            authService.logout();
            dispatch(authActions.reset());
            dispatch(codeAction.set({ code: CodeType.AUTH_ERROR, message: allOrders }))
          } else {
            dispatch(codeAction.set({ code: CodeType.SERVER_ERROR, message: allOrders }))
          }
        } else {
          setAllOrders(allOrders.filter(order=>order.customer===currentUser?.id).map(e => ({ ...e, orderDate: new Date(e.orderDate) })));
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [])

  function sortOrders():Order[] {
    let res: Order[] = allOrders;
    if (sort==='compl') {
      res = allOrders.filter(ord => ord.status==='Completed')
    } if (sort==='proc'){
      res = allOrders.filter(ord=>ord.status === 'Ordered' || ord.status === 'In processing' || ord.status === 'Delivery')
    }
    return res;
  }

  return (
    <Typography>
  <Typography sx={{textAlign:'center'}}>
    <h2>My orders</h2>
  </Typography>
  <ButtonGroup variant="text" aria-label="text button group" sx={{marginBottom: '10px'}}>
  <Button sx={{ color: 'black'}} onClick={()=>setSort('all')}>All</Button>
  <Button sx={{ color: 'black'}} onClick={()=>setSort('proc')}>In process</Button>
  <Button sx={{ color: 'black'}} onClick={()=>setSort('compl')}>Completed</Button>
</ButtonGroup> 
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{width: 200}}>Order id</StyledTableCell>
            <StyledTableCell align="center" sx={{width: 300}}>Orders date</StyledTableCell>
            <StyledTableCell align="left" sx={{width: 1000}}>Goods</StyledTableCell>
            <StyledTableCell align="center">Total Price</StyledTableCell>
            <StyledTableCell align="center">Orders status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortOrders().map((order) => (
            <StyledTableRow key={order.id}>
              <StyledTableCell component="th" scope="row">{'..'+order.id.substring(order.id.length -4)}</StyledTableCell>
              <StyledTableCell align="center">{order.orderDate.toDateString()}</StyledTableCell>
              <StyledTableCell align="center">{
                <TableBody>
                  {order.goods.map((prod: Product, index) => (
                    <TableRow
                      key={prod.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {prod.name}
                      </TableCell>
                      <TableCell align="center">{prod.description}</TableCell>
                      <TableCell align="center">{prod.price}</TableCell>
                      <TableCell align="center">{order.counts[index] +' pcs'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              }</StyledTableCell>
              <StyledTableCell align="center">{order.goods.reduce((a, b, index) => a + b.price * order.counts[index], 0)}</StyledTableCell>
              <StyledTableCell align="center">{order.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Typography>
  );
}

export default OrdersForUser;
