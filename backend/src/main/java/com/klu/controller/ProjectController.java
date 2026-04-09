package com.klu.controller;

import com.klu.entity.Project;
import com.klu.entity.User;
import com.klu.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")

@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final HttpServletRequest httpServletRequest;

    public ProjectController(ProjectService projectService, HttpServletRequest httpServletRequest) {
        this.projectService = projectService;
        this.httpServletRequest = httpServletRequest;
    }

    @GetMapping
    public List<Project> getAll() {
        List<Project> projects = projectService.getAll(getAuthorizationHeader());
        return sanitizeProjects(projects);
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id) {
        return sanitizeProject(projectService.getById(id, getAuthorizationHeader()));
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return sanitizeProject(projectService.create(project, getAuthorizationHeader()));
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        return sanitizeProject(projectService.update(id, project, getAuthorizationHeader()));
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        projectService.delete(id, getAuthorizationHeader());
        return "Deleted successfully";
    }

    private String getAuthorizationHeader() {
        return httpServletRequest.getHeader("Authorization");
    }

    private List<Project> sanitizeProjects(List<Project> projects) {
        List<Project> safeProjects = new ArrayList<>();
        for (Project project : projects) {
            safeProjects.add(sanitizeProject(project));
        }
        return safeProjects;
    }

    private Project sanitizeProject(Project source) {
        if (source == null) {
            return null;
        }
        Project copy = new Project();
        copy.setId(source.getId());
        copy.setTitle(source.getTitle());
        copy.setDescription(source.getDescription());
        copy.setTechStack(source.getTechStack());
        copy.setStatus(source.getStatus());

        User owner = source.getOwner();
        if (owner != null) {
            User safeOwner = new User();
            safeOwner.setId(owner.getId());
            safeOwner.setName(owner.getName());
            safeOwner.setEmail(owner.getEmail());
            safeOwner.setRole(owner.getRole());
            copy.setOwner(safeOwner);
        }
        return copy;
    }
}
