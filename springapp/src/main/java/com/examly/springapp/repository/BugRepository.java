package com.examly.springapp.repository;

import com.examly.springapp.model.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    
    // ✅ Find bugs by status
    List<Bug> findByStatus(String status);
    
    // ✅ Pagination is already provided by JpaRepository
    // The findAll(Pageable pageable) method is available by default
}