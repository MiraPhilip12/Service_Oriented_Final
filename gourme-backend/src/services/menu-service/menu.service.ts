import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { CreateMenuItemDto, UpdateMenuItemDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private menuRepository: Repository<MenuItem>,
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuRepository.find();
  }

  async findAvailable(): Promise<MenuItem[]> {
    return this.menuRepository.find({ where: { isAvailable: true } });
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    return this.menuRepository.find({ where: { category, isAvailable: true } });
  }

  async findOne(id: number): Promise<MenuItem> {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return item;
  }

  async create(createDto: CreateMenuItemDto): Promise<MenuItem> {
    const newItem = this.menuRepository.create(createDto);
    return this.menuRepository.save(newItem);
  }

  async update(id: number, updateDto: UpdateMenuItemDto): Promise<MenuItem> {
    await this.findOne(id);
    await this.menuRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.menuRepository.remove(item);
  }
}