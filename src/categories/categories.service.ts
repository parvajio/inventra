import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    if(!category){
      throw new NotFoundException("Category not found")
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
