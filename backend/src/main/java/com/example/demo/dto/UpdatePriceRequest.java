package com.example.demo.dto;

public class UpdatePriceRequest {

    
    private long productId;
    private long shopId;
    private double newPrice;
    private long userId;
   
    //constructer
    public UpdatePriceRequest(){
        
    }
    //getters and setters
    public long getProductID(){
        return productId;
    }
    public void setProductID(long productId){
        this.productId = productId;
    }

    public long getShopID(){
        return shopId;
    }
    public void setShopID(long shopId){
        this.shopId = shopId;
    }

    public double getNewPrice(){
        return newPrice;
    }
    public void setNewPrice(double newPrice){
        this.newPrice = newPrice;
    }

    public long getUserID(){
        return userId;
    }
    public void setUserID(long userId){
        this.userId = userId;
    }
  

}
