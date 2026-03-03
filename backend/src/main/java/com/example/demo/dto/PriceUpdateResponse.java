package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

    public class PriceUpdateResponse {
    private String type;
    private Long productId;
    private Long shopId;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private LocalDateTime updatedAt;

    //contructor
  public PriceUpdateResponse(
        String type,
        Long productId,
        Long shopId,
        BigDecimal oldPrice,
        BigDecimal newPrice,
        LocalDateTime updatedAt) {

    this.type = type;
    this.productId = productId;
    this.shopId = shopId;
    this.oldPrice = oldPrice;
    this.newPrice = newPrice;
    this.updatedAt = updatedAt;
}

    //getters
    public String getType(){
        return type;
    }
    public Long getProductId(){
        return productId;
    }
    public Long getShopId(){
        return shopId;
    }
    public BigDecimal getOldPrice(){
        return oldPrice;
    }
    public BigDecimal getNewPrice(){
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
    public void setOldPrice(BigDecimal oldPrice){
        this.oldPrice = oldPrice;
    }
    public void setNewPrice(BigDecimal newPrice){
        this.newPrice = newPrice;
    }
    public void setUpdatedAt(LocalDateTime updatedAt){
        this.updatedAt = updatedAt;
    }




}
