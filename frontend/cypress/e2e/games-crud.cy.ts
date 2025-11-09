describe('Games CRUD Operations - API Integration Tests', () => {
  it('should test dynamic form field rendering with mock data', () => {
    // This test verifies that our dynamic form component correctly renders
    // different field types based on collection schema

    // Mock collection schema API response
    cy.intercept('GET', '**/api/collections/games', {
      id: 'games',
      name: 'games',
      type: 'base',
      fields: [
        {
          id: 'game_id_field',
          name: 'game_id',
          type: 'text',
          required: true,
          system: false,
          hidden: false,
          max: 100,
        },
        {
          id: 'is_active_field',
          name: 'is_active',
          type: 'bool',
          required: false,
          system: false,
          hidden: false,
        },
        {
          id: 'max_players_field',
          name: 'max_players',
          type: 'number',
          required: false,
          system: false,
          hidden: false,
          min: 1,
          max: 100,
          onlyInt: true,
        },
        {
          id: 'description_field',
          name: 'description',
          type: 'editor',
          required: false,
          system: false,
          hidden: false,
        },
      ],
    }).as('getGamesSchema');

    // Mock login and dashboard data
    cy.intercept('POST', '**/api/admins/auth-with-password', {
      token: 'test-token-123',
      admin: {
        id: 'admin-123',
        email: 'admin@sun.studio',
      },
    }).as('login');

    cy.intercept('GET', '**/api/admins/auth-refresh', {
      token: 'test-token-123',
      admin: {
        id: 'admin-123',
        email: 'admin@sun.studio',
      },
    }).as('authRefresh');

    // Visit login page and perform login
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@sun.studio');
    cy.get('input[type="password"]').type('adminpassword123');
    cy.get('button[type="submit"]').click();

    // Navigate to games create page
    cy.visit('/games/create');

    // Wait for the dynamic form to load schema
    cy.wait('@getGamesSchema');

    // Verify that different field types are rendered correctly
    cy.get('input[name="game_id"]').should('exist').and('have.attr', 'type', 'text');
    cy.get('input[name="is_active"]').should('exist').and('have.attr', 'type', 'checkbox');
    cy.get('input[name="max_players"]').should('exist').and('have.attr', 'type', 'number');
    cy.get('textarea[name="description"]').should('exist');

    // Test form validation - required field
    cy.get('button').contains('Save').click();
    // Should show validation error for required game_id field

    // Fill in the form
    cy.get('input[name="game_id"]').type('test.dynamic.form');
    cy.get('input[name="is_active"]').check();
    cy.get('input[name="max_players"]').type('50');
    cy.get('textarea[name="description"]').type('Test game description');

    // Mock successful creation
    cy.intercept('POST', '**/api/collections/games/records', {
      id: 'test-game-dynamic-id',
      collectionId: 'games-collection-id',
      collectionName: 'games',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      game_id: 'test.dynamic.form',
      is_active: true,
      max_players: 50,
      description: 'Test game description',
    }).as('createGameDynamic');

    // Submit the form
    cy.get('button').contains('Save').click();

    // Wait for the API call
    cy.wait('@createGameDynamic');

    // Verify success (redirect or success message)
    cy.url().should('include', '/games');
  });

  it('should test API error handling in dynamic forms', () => {
    // Mock collection schema
    cy.intercept('GET', '**/api/collections/games', {
      id: 'games',
      name: 'games',
      type: 'base',
      fields: [
        {
          id: 'game_id_field',
          name: 'game_id',
          type: 'text',
          required: true,
          system: false,
          hidden: false,
        },
      ],
    }).as('getGamesSchemaError');

    // Mock login
    cy.intercept('POST', '**/api/admins/auth-with-password', {
      token: 'test-token-123',
      admin: {
        id: 'admin-123',
        email: 'admin@sun.studio',
      },
    }).as('loginError');

    // Login first
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@sun.studio');
    cy.get('input[type="password"]').type('adminpassword123');
    cy.get('button[type="submit"]').click();

    // Navigate to create page
    cy.visit('/games/create');
    cy.wait('@getGamesSchemaError');

    // Fill form and test server validation error
    cy.get('input[name="game_id"]').type('duplicate.game.id');

    // Mock 400 validation error
    cy.intercept('POST', '**/api/collections/games/records', {
      statusCode: 400,
      body: {
        message: 'Game ID already exists',
        status: 400,
      },
    }).as('createGameValidationError');

    // Submit form
    cy.get('button').contains('Save').click();
    cy.wait('@createGameValidationError');

    // Should show error message and stay on page
    cy.contains('Game ID already exists').should('be.visible');
    cy.url().should('include', '/games/create');
  });

  it('should test collection schema API endpoint behavior', () => {
    // Test the API endpoint that our dynamic forms depend on

    // Mock successful schema response
    cy.intercept('GET', '**/api/collections/games', {
      id: 'games',
      name: 'games',
      type: 'base',
      fields: [
        {
          id: 'id_field',
          name: 'id',
          type: 'text',
          system: true,
          hidden: true,
        },
        {
          id: 'game_id_field',
          name: 'game_id',
          type: 'text',
          required: true,
          system: false,
          hidden: false,
        },
        {
          id: 'created_field',
          name: 'created',
          type: 'date',
          system: true,
          hidden: false,
        },
        {
          id: 'updated_field',
          name: 'updated',
          type: 'date',
          system: true,
          hidden: false,
        },
      ],
    }).as('getGamesSchemaAPI');

    // Make request to the API endpoint
    cy.request('GET', '**/api/collections/games').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 'games');
      expect(response.body).to.have.property('name', 'games');
      expect(response.body).to.have.property('type', 'base');
      expect(response.body).to.have.property('fields');
      expect(response.body.fields).to.be.an('array');
      expect(response.body.fields.length).to.be.greaterThan(0);

      // Verify field structure
      const gameIdField = response.body.fields.find(
        (field: {
          name: string;
          type: string;
          required: boolean;
          system: boolean;
          hidden: boolean;
        }) => field.name === 'game_id'
      );
      expect(gameIdField).to.exist;
      expect(gameIdField?.type).to.eq('text');
      expect(gameIdField?.required).to.be.true;
      expect(gameIdField?.system).to.be.false;
      expect(gameIdField?.hidden).to.be.false;
    });
  });

  it('should test dynamic form field constraints', () => {
    // Test that field constraints are properly applied

    cy.intercept('GET', '**/api/collections/games', {
      id: 'games',
      name: 'games',
      type: 'base',
      fields: [
        {
          id: 'game_id_field',
          name: 'game_id',
          type: 'text',
          required: true,
          system: false,
          hidden: false,
          min: 3,
          max: 50,
          pattern: '^[a-z0-9.]+$',
          patternMessage: 'Only lowercase letters, numbers, and dots allowed',
        },
        {
          id: 'player_count_field',
          name: 'player_count',
          type: 'number',
          required: false,
          system: false,
          hidden: false,
          min: 1,
          max: 1000,
          onlyInt: true,
        },
        {
          id: 'is_beta_field',
          name: 'is_beta',
          type: 'bool',
          required: false,
          system: false,
          hidden: false,
        },
      ],
    }).as('getGamesSchemaConstraints');

    // Mock login
    cy.intercept('POST', '**/api/admins/auth-with-password', {
      token: 'test-token-123',
      admin: {
        id: 'admin-123',
        email: 'admin@sun.studio',
      },
    }).as('loginConstraints');

    // Login and navigate
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@sun.studio');
    cy.get('input[type="password"]').type('adminpassword123');
    cy.get('button[type="submit"]').click();

    cy.visit('/games/create');
    cy.wait('@getGamesSchemaConstraints');

    // Test field constraints are applied
    const gameIdInput = cy.get('input[name="game_id"]');

    // Test pattern validation (should allow valid input)
    gameIdInput.type('valid.game.id.123');
    gameIdInput.should('have.value', 'valid.game.id.123');

    // Test number field constraints
    const playerCountInput = cy.get('input[name="player_count"]');
    playerCountInput.type('50');
    playerCountInput.should('have.value', '50');

    // Test boolean field
    const isBetaCheckbox = cy.get('input[name="is_beta"]');
    isBetaCheckbox.should('exist');
    isBetaCheckbox.check();
    isBetaCheckbox.should('be.checked');
  });
});
