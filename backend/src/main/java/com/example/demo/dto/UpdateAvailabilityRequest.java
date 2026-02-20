package com.example.demo.dto;

public class UpdateAvailabilityRequest {
    private Boolean available;

    //constructor
    public UpdateAvailabilityRequest(){

    }
    //getters and setters 
   
    public Boolean getAvailable(){
        return available;
    }
    public void setAvailable(Boolean available){
        this.available = available;
    }

}