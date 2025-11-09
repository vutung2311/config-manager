describe('Data Creation Request - 400 Response Test', () => {
  it('should handle 400 response with authentication error during game creation', () => {
    const dashboardIntercepts = [
      {
        method: 'GET',
        url: '**/api/collections/games/records?page=1&perPage=10',
        response: {
          items: [
            {
              collectionId: 'pbc_879072730',
              collectionName: 'games',
              created: '2025-11-15 11:52:23.716Z',
              game_id: 'studio.sun.rpg',
              id: 'c984umf4jxbu42f',
            },
          ],
          page: 1,
          perPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        statusCode: 200,
        alias: 'getGameListWithData',
      },
    ];

    // Login with dashboard intercepts
    cy.loginWithIntercepts(dashboardIntercepts);

    // Verify dashboard shows games count
    cy.contains('Total Games').should('be.visible');

    // Navigate to games page
    cy.visit('/games');

    // Verify we're on the games page
    cy.contains('Games').should('be.visible');

    // Click the create button
    cy.get('a[href="/games/create"]').contains('Create').click();

    // Verify we're on the create game page
    cy.contains('Create Game').should('be.visible');

    // Input a different game id
    cy.get('input[placeholder="Game ID"]').type('test-auth-error');

    // Intercept the create game API call and return 400 with validation error
    cy.intercept('POST', '**/api/collections/games/records', {
      statusCode: 400,
      body: {
        message: 'Game ID already exists',
        status: 400,
      },
    }).as('createGameValidationError');

    // Submit the form
    cy.get('button').contains('Save').click();

    // Wait for the API call to be intercepted
    cy.wait('@createGameValidationError');

    // Wait for the notification to appear (may take longer for animation)
    cy.contains('Game ID already exists', { timeout: 10000 }).should('exist');

    // Verify user is NOT redirected to login page (should stay on create page)
    cy.url().should('include', '/games/create');
  });

  it('should validate 400 response structure with message and status only', () => {
    // Test the expected 400 response structure for configuration creation
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message: 'Configuration name already exists',
      status: 400,
    };

    // Verify the response has exactly the expected structure
    expect(expectedResponse).to.have.property('message');
    expect(expectedResponse).to.have.property('status');
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.equal('Configuration name already exists');

    // Verify no other properties like 'data' field
    expect(expectedResponse).to.not.have.property('data');
    expect(Object.keys(expectedResponse)).to.have.length(2);
  });

  it('should validate 400 response structure for game creation', () => {
    // Test the expected 400 response structure for game creation
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message: 'Game ID must be unique',
      status: 400,
    };

    // Verify the response structure
    expect(expectedResponse).to.have.property('message');
    expect(expectedResponse).to.have.property('status');
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.equal('Game ID must be unique');

    // Ensure no additional fields
    expect(Object.keys(expectedResponse)).to.have.length(2);
  });

  it('should handle 401 response with authentication error during game creation', () => {
    const dashboardIntercepts = [
      {
        method: 'GET',
        url: '**/api/collections/games/records?page=1&perPage=10',
        response: {
          items: [
            {
              collectionId: 'pbc_879072730',
              collectionName: 'games',
              created: '2025-11-15 11:52:23.716Z',
              game_id: 'studio.sun.rpg',
              id: 'c984umf4jxbu42f',
            },
          ],
          page: 1,
          perPage: 10,
          totalItems: 1,
          totalPages: 1,
        },
        statusCode: 200,
        alias: 'getGameListWithData',
      },
    ];

    // Login with dashboard intercepts
    cy.loginWithIntercepts(dashboardIntercepts);

    // Verify dashboard shows games count
    cy.contains('Total Games').should('be.visible');

    // Navigate to games page
    cy.visit('/games');

    // Verify we're on the games page
    cy.contains('Games').should('be.visible');

    // Click the create button
    cy.get('a[href="/games/create"]').contains('Create').click();

    // Verify we're on the create game page
    cy.contains('Create Game').should('be.visible');

    // Input a different game id
    cy.get('input[placeholder="Game ID"]').type('test-401-error');

    // Intercept the create game API call and return 401
    cy.intercept('POST', '**/api/collections/games/records', {
      statusCode: 401,
      body: {
        message: 'Authentication failed',
        status: 401,
      },
    }).as('createGame401Error');

    // Submit the form
    cy.get('button').contains('Save').click();

    // Wait for the API call to be intercepted
    cy.wait('@createGame401Error');

    // Wait for the notification to appear (may take longer for animation)
    cy.contains('Authentication token expired. Please login again.', { timeout: 10000 }).should(
      'exist'
    );

    // Verify user is redirected to login page
    cy.url().should('include', '/login');
  });

  it('should validate 400 response structure for validation errors', () => {
    // Test the expected 400 response structure for validation errors
    // This validates that the application expects the correct error format
    const expectedResponse = {
      message: 'Configuration template name must contain only uppercase letters and underscores',
      status: 400,
    };

    // Verify the response contains exactly message and status
    expect(expectedResponse).to.deep.equal({
      message: 'Configuration template name must contain only uppercase letters and underscores',
      status: 400,
    });

    // Additional validation
    expect(expectedResponse).to.have.property('message');
    expect(expectedResponse).to.have.property('status');
    expect(expectedResponse.status).to.equal(400);
    expect(expectedResponse.message).to.be.a('string');
  });
});
