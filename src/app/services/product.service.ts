import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryBaseUrl = 'http://localhost:8080/api/productCategories';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]>{
    
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryBaseUrl).pipe(
      map(response => response._embedded.productCategories)
    )
  }
}



interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
}
interface GetResponseProductCategory{
  _embedded:{
    productCategories: ProductCategory[];
  }
}
