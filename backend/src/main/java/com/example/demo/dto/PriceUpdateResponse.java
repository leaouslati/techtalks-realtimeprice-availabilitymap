package com.example.demo.dto;

import java.time.LocalDateTime;

    public class PriceUpdateResponse {
    private String type;
    private Long productId;
    private Long shopId;
    private Double oldPrice;
    private Double newPrice;
    private LocalDateTime updatedAt;

    //contructor
    public PriceUpdateResponse(String string, Long long1, Long long2, Double oldPrice2, Double double1, LocalDateTime localDateTime){

    }

    //getters
    public String getType(){
        return type;
    }
    public Long getProductID(){
        return productId;
    }
    public Long getShopID(){
        return shopId;
    }
    public Double getOldPrice(){
        return oldPrice;
    }
    public Double getNewPrice(){
        return newPrice;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

    //setters
    public void setType(String type){
        this.type = type;
    }
    public void setProductID(Long productId){
        this.productId = productId;
    }
    public void setShopID(Long shopId){
        this.shopId = shopId;
    }
    public void setOldPrice(Double oldPrice){
        this.oldPrice = oldPrice;
    }
    public void setNewPrice(Double newPrice){
        this.newPrice = newPrice;
    }
    public void setUpdatedAt(LocalDateTime updatedAt){
        this.updatedAt = updatedAt;
    }




}
