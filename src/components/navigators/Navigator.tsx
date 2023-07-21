import { ShoppingCart } from '@mui/icons-material';
import { AppBar, Badge, BadgeProps, BottomNavigationAction, Box, Tab, Tabs, Typography, styled } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelectorAuth } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { cartAction } from '../../redux/slices/cartSlice';
import AlertSnackBar from '../common/AlertSnackBar';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));
  
export type RouteType = {
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({ routes }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);
    const currentUser = useSelectorAuth();
    const dispatch = useDispatch();
    const [message, setMessage] = useState<string>('');

    function addCart () {
        let res = <Typography></Typography>;
        if (currentUser && !currentUser.isAdmin){
            const numberOfGoods: number = currentUser.cart==undefined ? 0 : currentUser.cart.counts.reduce((a,b)=>a+b);
        res = <BottomNavigationAction sx={{left:'65vw'}} onClick={()=>openShoppingCartHandler()}
            icon={
                <StyledBadge badgeContent={numberOfGoods} color="secondary">
                    <ShoppingCart/>
                </StyledBadge>
            } />
        }
        return res;
    }

    function openShoppingCartHandler (){
        if (currentUser!.cart) {
            dispatch(cartAction.set());
        } else {
            setMessage('Shopping cart is empty!')
        }
    }

    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname);
        if (index < 0) {
            index = 0;
        }
        navigate(routes[index].to);
        setValue(index);
    }, [routes])
    
    function onChangeFn(event: any, newValue: number) {
        setValue(newValue);
    }

    function getTabs(): ReactNode {
        return routes.map(r => <Tab component={NavLink} to={r.to} label={r.label} key={r.label}/>)
    }
    return <Box mt={10}>
        <AppBar sx={{ backgroundColor: "LightSeaGreen",  display: 'flex', flexDirection: 'row'}}>
            <Tabs value={value} onChange={onChangeFn}>
                {getTabs()}
            </Tabs>
            {addCart()}
        </AppBar>
        <Outlet></Outlet>
        <AlertSnackBar message={message} duration={2000} severity='warning'/>
    </Box>
}
export default Navigator;