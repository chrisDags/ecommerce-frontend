import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartItems: CartItem[] = [];

  // Subject is a subclass of observable that can be used to publish events.
  // this event will be sent to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0){
      this.remove(cartItem)
    }else{
      this.computeCartTotals();
    }

  }
  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(elem => elem.id === cartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1)

      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {

    // check if an item exists in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      //find item based on item id
      existingCartItem = this.cartItems.find(elem => elem.id === cartItem.id)!;
      //check if it was found
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      // increment item quantity in the array
      existingCartItem.quantity++;
    } else {
      // add item to array
      this.cartItems.push(cartItem);
    }
    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let elem of this.cartItems) {
      totalPriceValue += elem.quantity * elem.unitPrice;
      totalQuantityValue += elem.quantity;
    }

    // for debugging only ///////////////////////////////
    console.log(`Contenets of the cart: `);
    for (let elem of this.cartItems) {
      console.log(elem.name + ', ' + elem.unitPrice + ', ' + elem.quantity);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}`);
    console.log(`totalQuantity: ${totalQuantityValue}`);
    console.log('---------------------');

    //publish the new values to the subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
