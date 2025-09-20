import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.db.category.create({
        data: createCategoryDto,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return {
        ...category,
        productCount: category._count.products,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const categories = await this.db.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return categories.map(({ _count, ...rest }) => ({
      ...rest,
      productCount: _count.products,
    }));
  }

  async findOne(id: string) {
    const category = await this.db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.db.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return {
        ...category,
        productCount: category._count.products,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if category has products
      const categoryWithProducts = await this.db.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (!categoryWithProducts) {
        throw new NotFoundException('Category not found');
      }

      if (categoryWithProducts._count.products > 0) {
        throw new BadRequestException('Cannot delete category with existing products');
      }

      await this.db.category.delete({
        where: { id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }
}
