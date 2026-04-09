package com.klu.repository;

import com.klu.entity.Review;
import com.klu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStudentOrderByIdDesc(User student);
    List<Review> findAllByOrderByIdDesc();
}
