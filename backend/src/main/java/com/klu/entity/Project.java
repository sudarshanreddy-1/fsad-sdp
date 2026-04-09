package com.klu.entity;

import jakarta.persistence.*;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String techStack;
    private String status;
    @ManyToOne
    private User owner;

    public Project() {
    }

    public Project(Long id, String title, String description, String techStack, String status, User owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.status = status;
        this.owner = owner;
    }

    public Long getId() { 
    	return id; 
    	}
    public void setId(Long id) {
    	this.id = id;
    	
    }
    public String getTitle() { 
    	return title; 
    	}
    public void setTitle(String title) {
    	this.title = title; 
    	}
    public String getDescription() { 
    	return description;
    	}
    public void setDescription(String description) { 
    	this.description = description;
    	}
    public String getTechStack() { 
    	return techStack; 
    	}
    public void setTechStack(String techStack) { 
    	
    	this.techStack = techStack; }
    public String getStatus() {
    	return status; }
    public void setStatus(String status) { this.status = status; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}
