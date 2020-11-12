import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { SQLiteService } from './sqlite.service';

@Injectable()
export class ProductsRepositoryService {
  private readonly insertCommand = `INSERT INTO products (id, title)
  VALUES(`;
  private readonly selectByIdCommand = 'SELECT id, title FROM products where id=';
  private readonly selectAllCommand = 'SELECT * FROM products;';
  private readonly updateCommand = 'UPDATE products SET title="';
  private readonly deleteCommand = 'DELETE FROM products WHERE id=';

  constructor(
    private sqliteService: SQLiteService
  ) { }

  async create(entity: Product): Promise<any> {
    const cmd = this.insertCommand + entity.id.toString() + ', \"' + entity.title + '\");';
    this.executeIfDbExist(cmd);
  }

  async read(id: number): Promise<Product> {
    const cmd = this.selectByIdCommand + id.toString() + ';';
    return this.executeIfDbExist(cmd).then(result => {
      console.log(result);
      return result;
    });
  }

  async readAll(): Promise<Product[]> {
      /*
      return this.executeIfDbExist(this.selectAllCommand).then(result => {
        console.log('Read products result:' + JSON.stringify(result));
        return result;
      });
      */ 
      const values : any = await this.sqliteService.query(this.selectAllCommand);
      return values.values;
  }

  async update(entity: Product): Promise<Product> {
    const cmd = this.updateCommand + entity.title + '" WHERE id=' + entity.id.toString() + ';';
    return this.executeIfDbExist(cmd).then(result => {
      console.log(result);
      return result;
    });
  }

  async delete(id: number): Promise<void> {
    const cmd = this.deleteCommand + id.toString() + ';';
    return this.executeIfDbExist(cmd).then(result => {
      console.log(result);
    });
  }

  private async executeIfDbExist(cmd: string): Promise<any> {
    if (this.sqliteService.isDBExists('testDB')) {
      return this.sqliteService.execute(cmd);
    } else {
      return Promise.resolve('Database not yet created!');
    }
  }
}
