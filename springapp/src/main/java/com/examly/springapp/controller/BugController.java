package com.examly.springapp.controller;

import com.examly.springapp.model.Bug;
import com.examly.springapp.service.BugService;
import com.examly.springapp.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bugs")
public class BugController {

    private final BugService bugService;
    private final FileStorageService fileStorageService;

    public BugController(BugService bugService, FileStorageService fileStorageService) {
        this.bugService = bugService;
        this.fileStorageService = fileStorageService;
    }

    // ✅ Create Bug with file uploads
    @PostMapping()
    public ResponseEntity<Bug> createBug(
            @RequestPart("bug") Bug bug,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {
        
        try {
            // Handle image uploads
            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String filename = fileStorageService.storeFile(image);
                        imageUrls.add(filename);
                    }
                }
                bug.setImageUrls(imageUrls);
            }
            
            // Handle document uploads
            if (documents != null && !documents.isEmpty()) {
                List<String> documentUrls = new ArrayList<>();
                for (MultipartFile document : documents) {
                    if (!document.isEmpty()) {
                        String filename = fileStorageService.storeFile(document);
                        documentUrls.add(filename);
                    }
                }
                bug.setDocumentUrls(documentUrls);
            }
            
            Bug savedBug = bugService.addBug(bug);
            return ResponseEntity.ok(savedBug);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Get All Bugs (for existing tests and filtered requests)
    @GetMapping()
    public ResponseEntity<?> getAllBugs(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdDate") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction) {
        
        // If status filter is provided, return filtered results without pagination
        if (status != null && !status.isEmpty() && !status.equals("all")) {
            List<Bug> filteredBugs = bugService.getBugsByStatus(status);
            return ResponseEntity.ok(filteredBugs);
        }
        
        // Otherwise, return paginated results
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Bug> bugsPage = bugService.getBugsPaginated(pageable);
        return ResponseEntity.ok(bugsPage);
    }

    // ✅ Get Bug By ID
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        Optional<Bug> bug = bugService.getBugById(id);
        return bug.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update Bug with file uploads
    @PutMapping("/{id}")
    public ResponseEntity<Bug> updateBug(
            @PathVariable Long id,
            @RequestPart("bug") Bug bug,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {
        
        try {
            // Get existing bug to preserve existing attachments
            Optional<Bug> existingBugOpt = bugService.getBugById(id);
            if (!existingBugOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Bug existingBug = existingBugOpt.get();
            
            // Handle image uploads - preserve existing and add new ones
            List<String> imageUrls = existingBug.getImageUrls() != null ? 
                    new ArrayList<>(existingBug.getImageUrls()) : new ArrayList<>();
            
            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String filename = fileStorageService.storeFile(image);
                        imageUrls.add(filename);
                    }
                }
            }
            bug.setImageUrls(imageUrls);
            
            // Handle document uploads - preserve existing and add new ones
            List<String> documentUrls = existingBug.getDocumentUrls() != null ? 
                    new ArrayList<>(existingBug.getDocumentUrls()) : new ArrayList<>();
            
            if (documents != null && !documents.isEmpty()) {
                for (MultipartFile document : documents) {
                    if (!document.isEmpty()) {
                        String filename = fileStorageService.storeFile(document);
                        documentUrls.add(filename);
                    }
                }
            }
            bug.setDocumentUrls(documentUrls);
            
            Bug updatedBug = bugService.updateBug(id, bug);
            return ResponseEntity.ok(updatedBug);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Delete Bug (with file cleanup)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (bugOpt.isPresent()) {
            Bug bug = bugOpt.get();
            
            // Delete associated files
            if (bug.getImageUrls() != null) {
                for (String imageUrl : bug.getImageUrls()) {
                    fileStorageService.deleteFile(imageUrl);
                }
            }
            
            if (bug.getDocumentUrls() != null) {
                for (String documentUrl : bug.getDocumentUrls()) {
                    fileStorageService.deleteFile(documentUrl);
                }
            }
        }
        
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Delete specific attachment from a bug
    @DeleteMapping("/{id}/attachments/{filename}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long id,
            @PathVariable String filename,
            @RequestParam String type) {
        
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (!bugOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Bug bug = bugOpt.get();
        
        if ("image".equalsIgnoreCase(type) && bug.getImageUrls() != null) {
            bug.getImageUrls().remove(filename);
            fileStorageService.deleteFile(filename);
        } else if ("document".equalsIgnoreCase(type) && bug.getDocumentUrls() != null) {
            bug.getDocumentUrls().remove(filename);
            fileStorageService.deleteFile(filename);
        } else {
            return ResponseEntity.notFound().build();
        }
        
        bugService.updateBug(id, bug);
        return ResponseEntity.noContent().build();
    }

    // ✅ New Endpoint: Get bugs by status (for filtering)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bug>> getBugsByStatus(@PathVariable String status) {
        List<Bug> bugs = bugService.getBugsByStatus(status);
        return ResponseEntity.ok(bugs);
    }

    // ✅ Paginated endpoint (kept for backward compatibility)
    @GetMapping("/paginated")
    public ResponseEntity<Page<Bug>> getBugsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Bug> bugs = bugService.getBugsPaginated(pageable);
        return ResponseEntity.ok(bugs);
    }
}