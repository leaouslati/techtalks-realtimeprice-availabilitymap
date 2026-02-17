
package com.example.demo.entity;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import com.example.demo.product.Product;



@Entity
@Table(name = "shops")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String address;
    private String contact;
    private String location;
    private String category;


    private Double latitude;
    private Double longitude;

    private boolean claimed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    private List<Product> products;

    public Shop() {}

    public Shop(String name, String address, String contact, Double latitude, Double longitude, boolean claimed, String location, String category) {
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.latitude = latitude;
        this.longitude = longitude;
        this.claimed = claimed;
        this.location = location;
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

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLocation(){
        return location;
    }
    public void setLocation(String location){
        this.location = location;
    }

    public String getCategory(){
        return category;
    }
    public void setCategory(String category){
        this.category = category;
    }
}
