package com.klu.entity;

import jakarta.persistence.*;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Project project;
    @ManyToOne
    private User student;
    @ManyToOne
    private User professor;
    private Integer rating;
    private String comment;

    public Review() {
    }

    public Review(Long id, Project project, User student, User professor, Integer rating, String comment) {
        this.id = id;
        this.project = project;
        this.student = student;
        this.professor = professor;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public User getProfessor() { return professor; }
    public void setProfessor(User professor) { this.professor = professor; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
