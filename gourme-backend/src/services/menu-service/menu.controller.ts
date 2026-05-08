import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  @Get('available')
  async findAvailable() {
    return this.menuService.findAvailable();
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.menuService.findByCategory(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: CreateMenuItemDto) {
    return this.menuService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateMenuItemDto) {
    return this.menuService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}