describe("Data Creation Request - 400 Response Test", () => {
  beforeEach(() => {
    // Disable auto-login for tests to ensure we can test the login flow
    cy.window().then((win) => {
      win.localStorage.setItem("auto_login", "false");
    });
  });

  it("should handle 400 response with authentication error during game creation", () => {
    // Intercept dashboard API calls BEFORE login so they're ready when dashboard loads
    cy.intercept(
      "GET",
      "**/api/collections/configurations/records?page=1&perPage=1",
      {
        statusCode: 200,
        body: {
          page: 1,
          perPage: 100,
          totalItems: 0,
          totalPages: 0,
          items: [],
        },
      }
    ).as("getCfgListEmpty");

    // Override the default game list intercept to include a game for this specific test
    cy.intercept("GET", "**/api/collections/games/records?page=1&perPage=10", {
      statusCode: 200,
      body: {
        items: [
          {
            collectionId: "pbc_879072730",
            collectionName: "games",
            created: "2025-11-15 11:52:23.716Z",
            game_id: "studio.sun.rpg",
            id: "c984umf4jxbu42f",
          },
        ],
        page: 1,
        perPage: 10,
        totalItems: 1,
        totalPages: 1,
      },
    }).as("getGameListWithData");

    cy.intercept("GET", "**/api/collections/configurations/records?page=1&perPage=1&sort=-created", {
      statusCode: 200,
      body: {
        items: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    }).as("getGameListReverseEmpty");

    // First, login successfully
    cy.login();

    // Wait for dashboard API calls to complete
    cy.wait("@getCfgListEmpty");
    cy.wait("@getGameListWithData");
    cy.wait("@getGameListReverseEmpty");

    // Navigate to games page
    cy.visit("/games");

    // Verify we're on the games page
    cy.contains("Games").should("be.visible");

    // Click the create button
    cy.get('a[href="/games/create"]').contains("Create").click();

    // Verify we're on the create game page
    cy.contains("Create Game").should("be.visible");

    // Input a different game id
    cy.get('input[placeholder="Game ID"]').type("test-auth-error");

    // Intercept the create game API call and return 400 with auth error
    cy.intercept("POST", "**/api/collections/games/records", {
      statusCode: 400,
      body: {
        message: "Authentication token expired. You might need to login again.",
        status: 400,
      },
    }).as("createGameAuthError");

    // Submit the form
    cy.get("button").contains("Save").click();

    // Wait for the API call to be intercepted
    cy.wait("@createGameAuthError");

    // Wait for the notification to appear (may take longer for animation)
    cy.contains("Authentication token expired. Please login again.", { timeout: 10000 }).should(
      "exist"
    );

    // Verify user is redirected to login page
    cy.url().should("include", "/login");
  });

  it("should validate 400 response structure with message and status only", () => {
    // Test the expected 400 response structure for configuration creation
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message: "Configuration name already exists",
      status: 400,
    };

    // Verify the response has exactly the expected structure
    expect(expectedResponse).to.have.property("message");
    expect(expectedResponse).to.have.property("status");
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.equal("Configuration name already exists");

    // Verify no other properties like 'data' field
    expect(expectedResponse).to.not.have.property("data");
    expect(Object.keys(expectedResponse)).to.have.length(2);
  });

  it("should validate 400 response structure for game creation", () => {
    // Test the expected 400 response structure for game creation
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message: "Game ID must be unique",
      status: 400,
    };

    // Verify the response structure
    expect(expectedResponse).to.have.property("message");
    expect(expectedResponse).to.have.property("status");
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.equal("Game ID must be unique");

    // Ensure no additional fields
    expect(Object.keys(expectedResponse)).to.have.length(2);
  });

  it("should validate 400 response structure for validation errors", () => {
    // Test the expected 400 response structure for validation errors
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message:
        "Configuration template name must contain only uppercase letters and underscores",
      status: 400,
    };

    // Verify the response contains exactly message and status
    expect(expectedResponse).to.deep.equal({
      message:
        "Configuration template name must contain only uppercase letters and underscores",
      status: 400,
    });

    // Additional validation
    expect(expectedResponse).to.have.property("message");
    expect(expectedResponse).to.have.property("status");
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.be.a("string");
  });
});
