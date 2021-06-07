import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors{
        
        // check if string only contains whitespace
        if(control.value != null && control.value.trim().length === 0){
            // return an error object
            return {'notOnlyWhitespace': true};
        } else {
             return null as any;
        }
    }
}
