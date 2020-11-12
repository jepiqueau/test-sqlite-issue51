import { Component, AfterViewInit } from '@angular/core';
import { DatabaseInitializationService } from '../services/database.initialization.service';
import { ProductsRepositoryService } from '../services/products.repository.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [DatabaseInitializationService,
              ProductsRepositoryService]
})
export class HomePage implements AfterViewInit {
  public products: Array<Product> = [];

  constructor(private databaseInitialization: DatabaseInitializationService,
    private productsRepository: ProductsRepositoryService) {}

  async ngAfterViewInit() {
    this.databaseInitialization.initializeDatabase().then(async (res: boolean) => {
      if(res) {
        this.products = await this.refreshData();
      } else {
        console.log("** initializeDatabase failed **");
      }
    });
  
  }
  async refreshData(): Promise<Product[]> {
     
        const retProducts: Product[] = await this.productsRepository.readAll();
        for( let i: number = 0; i < retProducts.length ; i++) {
          console.log(`retProducts[${i}] ${JSON.stringify(retProducts[i])})`);
        }
        return retProducts;
      }
          
}
