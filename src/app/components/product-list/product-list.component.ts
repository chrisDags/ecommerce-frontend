import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] =[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //pagination props
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyword: string = '';
  
  constructor(private productService: ProductService, private cartService: CartService,
    //useful for accessing route params
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // this.listProducts();
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  addToCart(product: Product){

    console.log(`adding to cart: ${product.name}, ${product.unitPrice}`)

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }
  
  handleSearchProducts() {
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than the previous, set pageNumber to 1

    if(this.previousKeyword != searchKeyword){
      this.pageNumber = 1;
    }

    this.previousKeyword = searchKeyword;

    console.log(`keyword = ${searchKeyword}, pageNumber = ${this.pageNumber}`)

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, searchKeyword)
      .subscribe(this.processResult());

  }

  handleListProducts(){
        // check if 'id' param is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if(hasCategoryId){
          // convert 'id' string to a number
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        } else {
          // default to 1
          this.currentCategoryId = 1;
        }

        // check if we have a different category than the previous
        // Angular will reuse a component if it is currently being viewed
        if(this.previousCategoryId != this.currentCategoryId){
          this.pageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`)
    
                                                  //Spring Data Rest pages are 0 based
        this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
              .subscribe(this.processResult());

  }

  processResult() {
    return (data: any) =>{
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.pageSize = pageSize;
    this.pageNumber =1;
    this.listProducts();
  }

}
