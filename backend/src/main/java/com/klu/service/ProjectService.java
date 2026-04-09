package com.klu.service;

import com.klu.entity.Project;
import com.klu.entity.User;
import com.klu.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AuthService authService;

    public ProjectService(ProjectRepository projectRepository, AuthService authService) {
        this.projectRepository = projectRepository;
        this.authService = authService;
    }

    public List<Project> getAll(String authHeader) {
        User user = authService.requireUser(authHeader);
        if ("STUDENT".equals(user.getRole())) {
            return projectRepository.findByOwner(user);
        }
        return projectRepository.findAll();
    }

    public Project getById(Long id, String authHeader) {
        authService.requireUser(authHeader);
        if (id == null) {
            return null;
        }
        return projectRepository.findById(id).orElse(null);
    }

    public Project create(Project project, String authHeader) {
        User user = authService.requireUser(authHeader);
        project.setOwner(user);
        return projectRepository.save(project);
    }

    public Project update(Long id, Project req, String authHeader) {
        authService.requireUser(authHeader);
        if (id == null) {
            return null;
        }
        Project project = projectRepository.findById(id).orElse(null);
        if (project != null) {
            project.setTitle(req.getTitle());
            project.setDescription(req.getDescription());
            project.setTechStack(req.getTechStack());
            project.setStatus(req.getStatus());
            return projectRepository.save(project);
        }
        return null;
    }

    public void delete(Long id, String authHeader) {
        authService.requireUser(authHeader);
        if (id == null) {
            return;
        }
        projectRepository.deleteById(id);
    }
}
