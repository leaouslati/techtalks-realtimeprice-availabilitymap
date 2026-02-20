package com.example.demo.dto;

public class UpdatePriceRequest {


    private double newPrice;
   
    //constructer
    public UpdatePriceRequest(){
        
    }

    public double getNewPrice(){
        return newPrice;
    }
    public void setNewPrice(double newPrice){
        this.newPrice = newPrice;
    }

  

}
