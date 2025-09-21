import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Search, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductSearchDto } from './dto/create-product.dto';
import { CreateProductWithFileDto } from './dto/create-product-with-file.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/query-product.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UploadService } from 'src/upload/upload.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid data or category not found' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('with-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new product with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Product with image successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid data, category not found, or invalid file' })
  async createWithImage(
    @Body() createProductDto: CreateProductWithFileDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (image) {
      if (!this.uploadService.validateFileType(image)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
        );
      }

      if (!this.uploadService.validateFileSize(image)) {
        throw new BadRequestException('File size too large. Maximum size is 5MB.');
      }
      
      imageUrl = await this.uploadService.fileToBase64(image);
    }

    // string to numbers
    const price = Number(createProductDto.price);
    const stock = Number(createProductDto.stock);

    if (isNaN(price) || price <= 0) {
      throw new BadRequestException('Price must be a valid positive number');
    }

    if (isNaN(stock) || stock <= 0 || !Number.isInteger(stock)) {
      throw new BadRequestException('Stock must be a valid positive integer');
    }

    const productData: CreateProductDto = {
      name: createProductDto.name,
      description: createProductDto.description,
      price,
      stock,
      categoryId: createProductDto.categoryId,
      imageUrl,
    };

    return this.productsService.create(productData);
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
