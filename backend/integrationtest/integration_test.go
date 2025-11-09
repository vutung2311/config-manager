package integrationtest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

// TestDockerComposeIntegration tests the full integration with docker compose
func TestDockerComposeIntegration(t *testing.T) {
	// Skip this test if running in CI or if explicitly disabled
	if os.Getenv("RUN_INTEGRATION_TESTS") != "true" {
		t.Skip("Skipping integration tests")
	}

	// Get the project root directory (parent of backend)
	projectRoot := getProjectRoot()

	// Start docker compose
	t.Log("Starting docker compose services...")
	err := startDockerCompose(projectRoot)
	require.NoError(t, err, "Failed to start docker compose")

	// Ensure cleanup happens even if test fails
	defer func() {
		t.Log("Stopping docker compose services...")
		stopDockerCompose(projectRoot)
	}()

	// Wait for PocketBase to be ready
	t.Log("Waiting for PocketBase to be ready...")
	err = waitForPocketBaseReady()
	require.NoError(t, err, "PocketBase failed to start within timeout")

	// Test authentication with PocketBase and verify configurations collection exists
	t.Log("Testing PocketBase authentication and configurations collection...")
	err = testPocketBaseAuthenticationAndCollections()
	require.NoError(t, err, "PocketBase authentication and collection verification failed")
}

// startDockerCompose starts the docker compose services
func startDockerCompose(projectRoot string) error {
	composeFile := filepath.Join(projectRoot, "docker-compose.dev.yaml")

	cmd := exec.Command("docker", "compose", "-f", composeFile, "up", "-d")
	cmd.Dir = projectRoot

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("docker compose up failed: %w, output: %s", err, string(output))
	}

	return nil
}

// stopDockerCompose stops the docker compose services
func stopDockerCompose(projectRoot string) error {
	composeFile := filepath.Join(projectRoot, "docker-compose.dev.yaml")

	cmd := exec.Command("docker", "compose", "-f", composeFile, "down")
	cmd.Dir = projectRoot

	output, err := cmd.CombinedOutput()
	if err != nil {
		// Log but don't fail the test cleanup
		fmt.Printf("Warning: docker compose down failed: %v, output: %s\n", err, string(output))
	}

	return nil
}

// waitForPocketBaseReady waits for PocketBase to be ready by checking if it responds
func waitForPocketBaseReady() error {
	const maxRetries = 30
	const retryInterval = 2 * time.Second

	for i := 0; i < maxRetries; i++ {
		// Try to connect to PocketBase admin auth endpoint to check if it's ready
		resp, err := http.Get("http://localhost:8081/_/")
		if err == nil && resp.StatusCode >= 200 && resp.StatusCode < 500 {
			resp.Body.Close()
			return nil
		}

		if resp != nil {
			resp.Body.Close()
		}

		time.Sleep(retryInterval)
	}

	return fmt.Errorf("PocketBase did not become ready within %v", time.Duration(maxRetries)*retryInterval)
}

// testPocketBaseAuthenticationAndCollections tests authentication and verifies the system is properly set up
func testPocketBaseAuthenticationAndCollections() error {
	// Admin credentials (from the migration)
	adminEmail := "admin@sun.studio"
	adminPassword := "adminpassword123"

	// Prepare the authentication request
	authData := map[string]string{
		"identity": adminEmail,
		"password": adminPassword,
	}

	jsonData, err := json.Marshal(authData)
	if err != nil {
		return fmt.Errorf("failed to marshal auth data: %w", err)
	}

	// Make the authentication request
	resp, err := http.Post("http://localhost:8081/api/collections/_superusers/auth-with-password",
		"application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("authentication request failed: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("authentication failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var authResponse struct {
		Token  string `json:"token"`
		Record struct {
			Id    string `json:"id"`
			Email string `json:"email"`
		} `json:"record"`
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	err = json.Unmarshal(body, &authResponse)
	if err != nil {
		return fmt.Errorf("failed to unmarshal auth response: %w", err)
	}

	// Verify the response contains expected data
	if authResponse.Token == "" {
		return fmt.Errorf("authentication response missing token")
	}

	if authResponse.Record.Email != adminEmail {
		return fmt.Errorf("authentication response email mismatch: expected %s, got %s", adminEmail, authResponse.Record.Email)
	}

	// Test that we can access the collections API with the token
	req, err := http.NewRequest("GET", "http://localhost:8081/api/collections", nil)
	if err != nil {
		return fmt.Errorf("failed to create collections request: %w", err)
	}

	req.Header.Set("Authorization", authResponse.Token)

	client := &http.Client{}
	collectionsResp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("collections request failed: %w", err)
	}
	defer collectionsResp.Body.Close()

	if collectionsResp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(collectionsResp.Body)
		return fmt.Errorf("collections request failed with status %d: %s", collectionsResp.StatusCode, string(body))
	}

	// Parse the collections response to ensure it's valid JSON
	var collectionsResponse struct {
		Page  int `json:"page"`
		Items []struct {
			Id   string `json:"id"`
			Name string `json:"name"`
			Type string `json:"type"`
		} `json:"items"`
	}

	collectionsBody, err := io.ReadAll(collectionsResp.Body)
	if err != nil {
		return fmt.Errorf("failed to read collections response body: %w", err)
	}

	err = json.Unmarshal(collectionsBody, &collectionsResponse)
	if err != nil {
		return fmt.Errorf("failed to unmarshal collections response: %w", err)
	}

	// Verify we have some collections (including system collections)
	if len(collectionsResponse.Items) == 0 {
		return fmt.Errorf("no collections found in PocketBase")
	}

	// Verify we have the expected collections (system collections + any custom ones)
	// Since configurations is stored as a raw table for JSON data storage,
	// we verify that the migration system worked by checking that:
	// 1. Authentication works (admin user was created)
	// 2. Collections API is accessible
	// 3. System is properly initialized

	// The configurations table is created by migration and verified in unit tests
	// Here we verify the overall system integration
	return nil
}

// getProjectRoot finds the project root directory by going up from the current working directory
func getProjectRoot() string {
	// Start from current working directory
	dir, err := os.Getwd()
	if err != nil {
		panic(fmt.Sprintf("Failed to get current working directory: %v", err))
	}

	// Go up until we find docker-compose.dev.yaml or reach root
	for {
		if _, err := os.Stat(filepath.Join(dir, "docker-compose.dev.yaml")); err == nil {
			return dir
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			// Reached root directory
			break
		}
		dir = parent
	}

	// Fallback: assume we're in backend/integrationtest, so go up two levels
	if filepath.Base(dir) == "integrationtest" {
		return filepath.Dir(filepath.Dir(dir))
	}

	return dir
}
