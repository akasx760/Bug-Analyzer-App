package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
public class SpringappBugAnalyserTests {

    @Autowired
    private MockMvc mockMvc;

    // === API TESTS ===

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Add_Bug() throws Exception {
        String json = """
        {
          "title": "Sample Bug",
          "description": "This is a bug description",
          "status": "Open",
          "priority": "High",
          "reporter": "Alice",
          "createdDate": "2025-08-10"
        }
        """;

        mockMvc.perform(post("/bugs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Get_All_Bugs() throws Exception {
        mockMvc.perform(get("/bugs")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // === DIRECTORY CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Controller_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/controller");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Model_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/model");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Repository_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/repository");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Service_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/service");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    // === FILE CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_BugModel_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/model/Bug.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_BugController_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/controller/BugController.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_BugRepository_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/repository/BugRepository.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_BugService_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/service/BugService.java");
        assertTrue(file.exists());
    }

    // === CLASS CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_BugModel_Class_Exists() {
        checkClassExists("com.examly.springapp.model.Bug");
    }

    // === FIELD CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_Bug_Model_Has_Title_Field() {
        checkFieldExists("com.examly.springapp.model.Bug", "title");
    }

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_Bug_Model_Has_Description_Field() {
        checkFieldExists("com.examly.springapp.model.Bug", "description");
    }

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_Bug_Model_Has_Status_Field() {
        checkFieldExists("com.examly.springapp.model.Bug", "status");
    }

    // === UTILITY METHODS ===

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + className);
        }
    }
}
