import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, ProductSearchDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { ProductQueryDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  async create(createProductDto: CreateProductDto) {
    // Verify category exists
    const category = await this.db.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = await this.db.product.create({
      data: createProductDto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // where obj
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.db.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.db.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // If categoryId is being updated, verify it exists
    if (updateProductDto.categoryId) {
      const category = await this.db.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    try {
      const product = await this.db.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.db.product.delete({
        where: { id },
      });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async search(searchDto: ProductSearchDto) {
    const { q } = searchDto;

    const products = await this.db.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      products,
      query: q,
      count: products.length,
    };
  }
}
