import { ButtonGroup, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { authService, goodsService, ordersService } from "../../config/service-config";
import { useState } from "react";
import CodeType from "../../model/CodeType";
import { authActions } from "../../redux/slices/authSlice";
import { codeAction } from "../../redux/slices/codeSlice";
import { useDispatch } from "react-redux";
import Product from "../../model/Product";
import UserData from "../../model/UserData";
import { useSelectorAuth, useSelectorOpenCart } from "../../redux/store";
import stages from "../../config/orders-config.json"
import Order from "../../model/Order";
import { cartAction } from "../../redux/slices/cartSlice";
import AlertSnackBar from "../common/AlertSnackBar";
import { StatusType } from "../../model/StatusType";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { AddBox } from "@mui/icons-material";


const defaultTheme = createTheme();
const { ordersStages } = stages;

const Showcase: React.FC = () => {
  const dispatch = useDispatch();

  const openCartModal = useSelectorOpenCart();
  const [errorObj, setErrorObj] = useState<{ errorMessage: string, severity: StatusType }>({ errorMessage: '', severity: "success" });
  const [goods, setGoods] = useState<Product[]>([]);
  const currentUser: UserData = useSelectorAuth();
  React.useEffect(() => {
    const subscription = goodsService.getAllGoods().subscribe({
      next(goods: Product[] | string) {
        if (typeof goods == 'string') {
          if (goods.includes('Authentication')) {
            authService.logout();
            dispatch(authActions.reset());
            dispatch(codeAction.set({ code: CodeType.AUTH_ERROR, message: goods }))
          } else {
            dispatch(codeAction.set({ code: CodeType.SERVER_ERROR, message: goods }))
          }
        } else {
          setGoods(goods);
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [])

  function addingToCart(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, addingProduct: Product): void {
    //const productId = event.currentTarget.id;
    if (currentUser) {
      const copyObj: UserData = JSON.parse(JSON.stringify(currentUser));
      if (copyObj!.cart == undefined) {
        const obj: Order = {
          orderDate: new Date(),
          goods: [addingProduct],
          counts: [1],
          status: ordersStages[0]
        }
        copyObj!.cart = obj;
      } else {
        const index: number = copyObj!.cart.goods.findIndex((prod) => prod.id === addingProduct.id);
        if (+index < 0) {
          copyObj!.cart!.goods.push(addingProduct);
          copyObj!.cart!.counts.push(1);
        } else {
          copyObj!.cart!.counts[index]++;
        }
      }
      dispatch(authActions.set(copyObj));
    }
  }

  function changeAmount(operation: 'minus' | 'plus', id: string) {
    const copyObj: UserData = JSON.parse(JSON.stringify(currentUser));
    const indexForChanging: number = copyObj!.cart!.goods.findIndex(prod => prod.id == id);
    let counter: number[] = copyObj!.cart!.counts;
    if (operation === 'minus') {
      if (counter[indexForChanging] >= 1) {
        counter[indexForChanging]--;
        if (counter[indexForChanging] == 0) {
          deleteFromCartHandle(id);
        } else {
          dispatch(authActions.set(copyObj));
        }
      }
    } else {
      counter[indexForChanging]++;
      dispatch(authActions.set(copyObj));
    }
  }

  function getRowsForCart(): JSX.Element[] {
    let res: JSX.Element[] = [];
    if (currentUser && currentUser.cart) {
      res = currentUser.cart.goods.map((prod, index) => <TableRow
        key={prod.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row"> <img src={prod.imageLink} style={{ height: '100px', width: '100px' }} /> </TableCell>
        <TableCell align="right">{prod.name}</TableCell>
        <TableCell align="right">
          <ButtonGroup>
            <Button aria-label="reduce" onClick={() => changeAmount('minus', prod.id!)} sx={{ marginRight: '10px' }}>
              <RemoveIcon fontSize="small" />
            </Button>
            <Typography>
              {currentUser!.cart!.counts[index]}
            </Typography>
            <Button aria-label="increase" onClick={() => changeAmount('plus', prod.id!)} sx={{ marginLeft: '10px' }}>
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        </TableCell>
        <TableCell align="right">{prod.price}</TableCell>
        <TableCell align="right">{prod.price * currentUser!.cart!.counts[index]}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="delete" onClick={() => deleteFromCartHandle(prod.id as string)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>)
    }
    return res;
  }

  function deleteFromCartHandle(id: string): void {
    const indexForDelete = currentUser!.cart!.goods.findIndex(prod => prod.id == id);
    const copyObj: UserData = JSON.parse(JSON.stringify(currentUser));
    const prodArr: Product[] = copyObj!.cart!.goods;
    const countArr: number[] = copyObj!.cart!.counts;
    if (indexForDelete == 0 && prodArr.length == 1) {
      dispatch(cartAction.reset());
      copyObj!.cart = undefined;
    }
    prodArr.splice(indexForDelete, 1);
    countArr.splice(indexForDelete, 1);
    dispatch(authActions.set(copyObj));
  }

  async function makeOrderHandler() {
    const copyObj: UserData = JSON.parse(JSON.stringify(currentUser));
    const orderForSaving: Order = copyObj!.cart!;


    orderForSaving.customer = copyObj!.id;

    try {
      orderForSaving.status = ordersStages[1];
      await ordersService.addOrder(orderForSaving);
      copyObj!.cart = undefined;
      dispatch(authActions.set(copyObj));
      dispatch(cartAction.reset());
      setErrorObj({ errorMessage: 'Order has been completed successfully', severity: "success" });
    } catch (error: any) {
      const mes: string = error;
      setErrorObj({ errorMessage: mes, severity: "error" })
    }
  }

  return <Typography>
    <ThemeProvider theme={defaultTheme}>
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {goods!.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '56.25%',
                    }}
                    image={card.imageLink}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="large" onClick={(event) => addingToCart(event, card)}><AddShoppingCartIcon /> Add to cart</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>

      <Modal
        open={openCartModal}
        onClose={() => { }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Shopping cart
          </Typography>
          <Box>
            <Typography>
              Customer: {currentUser!.name + " " + currentUser!.lastName}
            </Typography>
            {/* <Typography>
              Orders date: {currentUser!.cart && currentUser!.cart.orderDate ? currentUser!.cart.orderDate.toDateString() : ''}
            </Typography> */}
            <Typography>
              Address for delevery: {currentUser!.address}
            </Typography>
          </Box>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
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
                  {getRowsForCart()}
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
          <Button variant="contained" onClick={() => dispatch(cartAction.reset())}>Close</Button>
          <Typography>
          <Box sx={{textAlign: 'center'}}>
            <Button variant="outlined"  onClick={() => makeOrderHandler()}>Confirm order</Button>
          </Box>
          </Typography>
        </Box>
      </Modal>
      <AlertSnackBar message={errorObj.errorMessage} duration={5000} severity={errorObj.severity} />
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Contacts here
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  </Typography>
}

export default Showcase;

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
