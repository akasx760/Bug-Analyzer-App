package com.examly.springapp.service;

import com.examly.springapp.model.Bug;
import com.examly.springapp.repository.BugRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    private final BugRepository bugRepository;

    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    // ✅ Add Bug
    public Bug addBug(Bug bug) {
        return bugRepository.save(bug);
    }

    // ✅ Get All Bugs (used in existing tests)
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    // ✅ Get Bugs by Status
    public List<Bug> getBugsByStatus(String status) {
        return bugRepository.findByStatus(status);
    }

    // ✅ Get Bug by ID
    public Optional<Bug> getBugById(Long id) {
        return bugRepository.findById(id);
    }

    // ✅ Update Bug
    public Bug updateBug(Long id, Bug updatedBug) {
        return bugRepository.findById(id).map(bug -> {
            bug.setTitle(updatedBug.getTitle());
            bug.setDescription(updatedBug.getDescription());
            bug.setStatus(updatedBug.getStatus());
            bug.setPriority(updatedBug.getPriority());
            bug.setReporter(updatedBug.getReporter());
            bug.setCreatedDate(updatedBug.getCreatedDate());
            bug.setImageUrls(updatedBug.getImageUrls());
            bug.setDocumentUrls(updatedBug.getDocumentUrls());
            return bugRepository.save(bug);
        }).orElseThrow(() -> new RuntimeException("Bug not found with id " + id));
    }

    // ✅ Delete Bug
    public void deleteBug(Long id) {
        bugRepository.deleteById(id);
    }

    // ✅ Paginated + Sorted Bugs
    public Page<Bug> getBugsPaginated(Pageable pageable) {
        return bugRepository.findAll(pageable);
    }
}