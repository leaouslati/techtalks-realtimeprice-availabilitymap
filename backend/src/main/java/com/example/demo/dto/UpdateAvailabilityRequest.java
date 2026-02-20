package com.example.demo.dto;

public class UpdateAvailabilityRequest {
    private Long productId;
    private Long shopId;
    private Boolean available;
    private Long userId;

    //constructor
    public UpdateAvailabilityRequest(){

    }
    //getters and setters 
    public Long getProductID(){
        return productId;
    }
    public void setProductID(Long productId){
        this.productId = productId;
    }
    public Long getShopID(){
        return shopId;
    }
    public void setShopID(Long shopId){
        this.shopId = shopId;
    }
    public Boolean getAvailable(){
        return available;
    }
    public void setAvailable(Boolean available){
        this.available = available;
    }
    public Long getUserID(){
        return userId;
    }
    public void setUserID(Long userId){
        this.userId = userId;
    }
}