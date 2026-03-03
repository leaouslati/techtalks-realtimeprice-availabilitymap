package com.example.demo.dto;

import java.math.BigDecimal;

public class UpdatePriceRequest {


    private BigDecimal newPrice;
   
    //constructer
    public UpdatePriceRequest(){
        
    }

    public BigDecimal getNewPrice(){
        return newPrice;
    }
    public void setNewPrice(BigDecimal newPrice){
        this.newPrice = newPrice;
    }

  

}
