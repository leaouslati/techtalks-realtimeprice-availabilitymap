package com.example.demo.product;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.entity.Price;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonManagedReference(value = "product-prices")
    @OneToMany(mappedBy = "product")
    private List<Price> prices;

    public Product() {}

    public Product(String name, String category) {
        this.name = name;
        this.category = category;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<Price> getPrices() { return prices; }
    public void setPrices(List<Price> prices) { this.prices = prices; }
}