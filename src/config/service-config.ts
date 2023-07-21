import AuthService from "../service/auth/AuthService";
import UserService from "../service/repository/users/UserService";
import AuthServiceFire from "../service/auth/AuthServiceFire";
import RegistrationUserServiceFire from "../service/registartion/RegistrationUserServiceFire";
import RegistartionUserService from "../service/registartion/RegistartionUserService";
import OrdersServiceFire from "../service/repository/orders/OrdersServiceFire";
import OrdersService from "../service/repository/orders/OrdersService";

import UserServiceFire from "../service/repository/users/UserServiseFire";
import GoodsServiceFire from "../service/repository/goods/GoodsServiceFire";
import GoodsService from "../service/repository/goods/GoodsService";
import StorageService from "../service/repository/storage/StorageService";
import StorageServiceFire from "../service/repository/storage/StorageServiceFire";

export const authService: AuthService = new AuthServiceFire();
export const userService: UserService = new UserServiceFire();
export const registrationService: RegistartionUserService = new RegistrationUserServiceFire();
export const ordersService: OrdersService = new OrdersServiceFire();
export const goodsService: GoodsService = new GoodsServiceFire();
export const storageService: StorageService = new StorageServiceFire();