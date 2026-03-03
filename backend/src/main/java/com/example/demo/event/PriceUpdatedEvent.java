package com.example.demo.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceUpdatedEvent {

    private final Long productId;
    private final Long shopId;
    private final BigDecimal oldPrice;
    private final BigDecimal newPrice;
    private final LocalDateTime updatedAt;

    public PriceUpdatedEvent(
            Long productId,
            Long shopId,
            BigDecimal oldPrice,
            BigDecimal newPrice,
            LocalDateTime updatedAt) {

        this.productId = productId;
        this.shopId = shopId;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
        this.updatedAt = updatedAt;
    }

    public Long getProductId() { return productId; }
    public Long getShopId() { return shopId; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public BigDecimal getNewPrice() { return newPrice; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

