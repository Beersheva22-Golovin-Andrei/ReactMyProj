import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import { RouteType } from "./components/navigators/Navigator";
import UserData from "./model/UserData";
import { Box, Snackbar, Alert, AlertColor } from "@mui/material";
import CodePayload from "./model/CodePayload";
import { useDispatch } from "react-redux";
import { codeAction } from "./redux/slices/codeSlice";
import SignUp from "./components/pages/SignUp";
import Showcase from "./components/pages/Showcase";
import AddGoods from "./components/pages/AddGoods";
import OrdersForUser from "./components/pages/OrdersForUser";
import OrdersForAdmin from "./components/pages/adminsdashboard/OrdersForAdmin";
import GoodsForAdmin from "./components/pages/adminsdashboard/GoodsForAdmin";



const {common, admin, user} = routesConfig;
type RouteTypeOrder = RouteType & {order?: number}

function getRoutes(userData: UserData): RouteType[] {
  const res: RouteTypeOrder[] = [];
  if(userData) {
      if (userData.isAdmin) {
        res.push(...admin)
      } else {
        res.push(...user)
      }
  } else {
    res.push(...common);
  }
  res.sort((r1, r2) => {
    let res = 0;
    if (r1.order && r2.order) {
      res = r1.order - r2.order;
    } 
    return res
  });
  return res
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const code = useSelectorCode();
  const {alertMessage, severity} = useMemo(()=>getSnackBarData(code), [code])
  const userData = useSelectorAuth();
  const routes = useMemo(() => getRoutes(userData), [userData])
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<NavigatorDispatcher routes={routes}/>}>
        <Route index element={<Showcase/>}/>
        <Route path="showcase" element={<Showcase/>}/>
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signout" element={<SignOut/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="addproduct" element={<AddGoods/>}/>
        <Route path="ordersUser" element={<OrdersForUser/>}/>
        <Route path="ordersadmin" element={<OrdersForAdmin/>}/>
        <Route path="goodsadmin" element={<GoodsForAdmin/>}/>
    </Route>
  </Routes>
 <Box>
<Snackbar open={!!alertMessage} autoHideDuration={20000}
onClose={() => dispatch(codeAction.reset())}>
   <Alert  onClose = {() => dispatch(codeAction.reset())} severity={severity as AlertColor} sx={{ width: '100%' }}>
       {alertMessage}
   </Alert>
</Snackbar>
</Box>
</BrowserRouter>
}

function getSnackBarData(code: CodePayload):{alertMessage: string, severity: string} {
  let severity: string='';
  switch(code.code){
    case 0:{
      severity = 'success'
      break;
    }
    case 1: {
      severity= 'error'
      break;
    }
    case 2: {
      severity= 'error'
      break;
    }
    case 3:{
      severity= 'warning'
      break;
    }
  }
  const alertMessage= code.message
  return {alertMessage, severity}
}

export default App;