import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Search } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductSearchDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/query-product.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid data or category not found' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filters and pagination' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query() query:ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({summary: "search products by name or description"})
  @ApiQuery({name: 'q', description: 'search query'})
  @ApiResponse({status: 200, description: "search results retrieved successfully"})
  search(@Query() searchDto: ProductSearchDto){
    return this.productsService.search(searchDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid data or category not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
