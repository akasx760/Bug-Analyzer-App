package com.examly.springapp.model;
import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class Bug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bugId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String reporter;
    private LocalDate createdDate;
    @ElementCollection
    private List<String> imageUrls;
    
    @ElementCollection
    private List<String> documentUrls;
    public Bug() {}
    public Long getBugId() {
    return bugId;
    }
    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getPriority() {
        return priority;
    }
    public void setPriority(String priority) {
        this.priority = priority;
    }
    public String getReporter() {
        return reporter;
    }
    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
       // New getters and setters for attachments
       public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public List<String> getDocumentUrls() {
        return documentUrls;
    }
    
    public void setDocumentUrls(List<String> documentUrls) {
        this.documentUrls = documentUrls;
    }
}
