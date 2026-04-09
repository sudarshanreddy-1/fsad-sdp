package com.klu.repository;

import com.klu.entity.Project;
import com.klu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
    List<Project> findByOwnerOrderByIdDesc(User owner);
    List<Project> findAllByOrderByIdDesc();
}
