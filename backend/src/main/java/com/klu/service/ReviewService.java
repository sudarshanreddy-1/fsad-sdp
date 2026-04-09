package com.klu.service;

import com.klu.entity.Project;
import com.klu.entity.Review;
import com.klu.entity.User;
import com.klu.repository.ProjectRepository;
import com.klu.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final AuthService authService;

    public ReviewService(ReviewRepository reviewRepository, ProjectRepository projectRepository, AuthService authService) {
        this.reviewRepository = reviewRepository;
        this.projectRepository = projectRepository;
        this.authService = authService;
    }

    public List<Review> getAll(String authHeader) {
        User user = authService.requireUser(authHeader);

        if ("STUDENT".equals(user.getRole())) {
            return reviewRepository.findByStudentOrderByIdDesc(user);
        }

        return reviewRepository.findAllByOrderByIdDesc();
    }

    public Review create(Long projectId, Review req, String authHeader) {
        User user = authService.requireUser(authHeader);

        if (!"PROFESSOR".equals(user.getRole())) {
            throw new RuntimeException("Only professors can review");
        }
        if (projectId == null) {
            throw new RuntimeException("Project not found");
        }

        Project project = projectRepository.findById(projectId).orElse(null);

        if (project == null) {
            throw new RuntimeException("Project not found");
        }

        Review r = new Review();
        r.setProject(project);
        r.setStudent(project.getOwner());
        r.setProfessor(user);
        r.setRating(req.getRating());
        r.setComment(req.getComment());

        return reviewRepository.save(r);
    }
}