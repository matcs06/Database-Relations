import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';

import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { id } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const allProductsByID = products.map(product => product.id);

    const productsById = await this.ormRepository.find({
      where: {
        id: In(allProductsByID),
      },
    });

    return productsById;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsData = await this.findAllById(products);

    const productsToUpdate = productsData.map(productData => {
      const foundProduct = products.find(
        product => product.id === productData.id,
      );

      if (!foundProduct) {
        throw new AppError('Product not found');
      }

      if (productData.quantity < foundProduct.quantity) {
        throw new AppError('Insufficient product quantity');
      }

      const productUpdated = productData;

      productUpdated.quantity -= foundProduct.quantity;

      return productUpdated;
    });

    await this.ormRepository.save(productsToUpdate);

    return productsToUpdate;
  }

  public async save(product: Product): Promise<void> {
    await this.ormRepository.save(product);
  }
}

export default ProductsRepository;
