package com.klu.controller;

import com.klu.entity.Review;
import com.klu.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviews")
    public List<Map<String, Object>> getAll(@RequestHeader("Authorization") String auth) {
        List<Review> reviews = reviewService.getAll(auth);
        return reviews.stream().map(this::toReviewMap).toList();
    }

    @PostMapping("/projects/{projectId}/reviews")
    public Map<String, Object> create(
            @PathVariable Long projectId,
            @RequestBody Review req,
            @RequestHeader("Authorization") String auth
    ) {
        Review review = reviewService.create(projectId, req, auth);
        return toReviewMap(review);
    }

    private Map<String, Object> toReviewMap(Review review) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", review.getId());
        map.put("rating", review.getRating());
        map.put("comment", review.getComment());
        map.put("projectId", review.getProject() == null ? null : review.getProject().getId());
        map.put("studentId", review.getStudent() == null ? null : review.getStudent().getId());
        map.put("studentName", review.getStudent() == null ? null : review.getStudent().getName());
        map.put("professorId", review.getProfessor() == null ? null : review.getProfessor().getId());
        map.put("professorName", review.getProfessor() == null ? null : review.getProfessor().getName());
        return map;
    }
}
