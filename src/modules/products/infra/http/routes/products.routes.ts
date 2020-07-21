import { Router } from 'express';

import ProductsController from '../controller/ProductsController';
import UpdateProductsQuantity from '../controller/AddProductController';

const productsRouter = Router();
const productsController = new ProductsController();
const updateProductsController = new UpdateProductsQuantity();

productsRouter.post('/', productsController.create);
productsRouter.post('/update-quantity', updateProductsController.create);

export default productsRouter;
