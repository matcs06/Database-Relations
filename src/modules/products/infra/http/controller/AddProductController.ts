import { Request, Response } from 'express';

import { container } from 'tsyringe';
import AddProductQuantityService from '@modules/products/services/AddProductQuantityService';
import { classToClass } from 'class-transformer';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id, quantity } = request.body;

    const addQuantity = container.resolve(AddProductQuantityService);

    const product = await addQuantity.execute({
      id,
      quantity,
    });

    return response.json(classToClass(product));
  }
}
