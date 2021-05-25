import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
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
  pageSize: number = 10;
  totalElements: number = 0;
  
  
  constructor(private productService: ProductService, 
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
  handleSearchProducts() {
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(searchKeyword).subscribe(
      data =>{
        this.products = data;
      }
    )

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

}
