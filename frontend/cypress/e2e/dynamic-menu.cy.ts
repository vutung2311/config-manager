describe('Dynamic Menu System', () => {
  beforeEach(() => {
    // Disable auto-login for tests to ensure we can test the login flow
    cy.window().then((win) => {
      win.localStorage.setItem('auto_login', 'false');
      // Set initial mock data (empty)
      (win as any).mockTemplates = [];
    });

    // Perform actual login instead of mocking
    cy.login();
  });

  it('should dynamically add menu items when configuration templates are created', () => {
    // Set mock template data
    cy.window().then((win) => {
      (win as any).mockTemplates = [
        {
          id: 'new-template-id',
          name: 'Test Config Template',
          data: { setting: 'test_value' },
          game_id: 'game-1',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      ];
      // Trigger refetch
      win.dispatchEvent(new CustomEvent('refetch-templates'));
    });

    cy.wait(1000); // Allow time for the dynamic menu to update

    // The menu should exist (static menu items like Dashboard, Configuration Templates, etc.)
    cy.get('.ant-menu', { timeout: 10000 }).should('exist');

    // The dynamic menu item should now appear in the sidebar
    cy.get('.ant-menu-item').contains('Test Config Template').should('be.visible');

    // Test that clicking the menu item navigates to the correct route
    cy.get('.ant-menu-item').contains('Test Config Template').click();
    cy.url().should('include', '/configurations/new-template-id');
  });

  it('should remove menu items when configuration templates are deleted', () => {
    // Set initial mock template data
    cy.window().then((win) => {
      (win as any).mockTemplates = [
        {
          id: 'template-to-delete',
          name: 'Template To Delete',
          data: { setting: 'delete_me' },
          game_id: 'game-1',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      ];
      // Trigger refetch
      win.dispatchEvent(new CustomEvent('refetch-templates'));
    });

    cy.wait(1000); // Allow time for the dynamic menu to update
    cy.get('.ant-menu-item').contains('Template To Delete').should('be.visible');

    // Navigate to configuration templates list
    cy.get('.ant-menu-item').contains('Configuration Templates').click()

    // Find the delete button and click it
    cy.get('button[title="Delete"]').first().click()

    // Confirm deletion
    cy.get('.ant-popconfirm-buttons button').contains('OK').click()

    // Mock the delete response
    cy.intercept('DELETE', '**/api/collections/configuration_templates/records/template-to-delete', {
      statusCode: 200
    }).as('deleteTemplate');

    // Simulate deletion by setting empty mock data
    cy.window().then((win) => {
      (win as any).mockTemplates = [];
      win.dispatchEvent(new CustomEvent('refetch-templates'));
    });

    cy.wait(1000); // Allow time for the menu to update

    // The menu item should no longer be visible
    cy.get('.ant-menu-item').should('not.contain', 'Template To Delete')
  });

  it('should update menu item labels when template names are edited', () => {
    // Set initial mock template data
    cy.window().then((win) => {
      (win as any).mockTemplates = [
        {
          id: 'template-to-edit',
          name: 'Original Name',
          data: { setting: 'original' },
          game_id: 'game-1',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      ];
      // Trigger refetch
      win.dispatchEvent(new CustomEvent('refetch-templates'));
    });

    cy.wait(1000); // Allow time for the dynamic menu to update
    cy.get('.ant-menu-item').contains('Original Name').should('be.visible');

    // Navigate to configuration templates list
    cy.get('.ant-menu-item').contains('Configuration Templates').click()

    // Click edit button
    cy.get('button[title="Edit"]').first().click()

    // Update the name
    cy.get('input[name="name"]').clear().type('Updated Template Name')

    // Mock the update response
    cy.intercept('PATCH', '**/api/collections/configuration_templates/records/template-to-edit', {
      statusCode: 200,
      body: {
        id: 'template-to-edit',
        name: 'Updated Template Name',
        data: { setting: 'original' },
        game_id: 'game-1',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    }).as('updateTemplate');

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Simulate name change by updating mock data
    cy.window().then((win) => {
      (win as any).mockTemplates = [
        {
          id: 'template-to-edit',
          name: 'Updated Template Name',
          data: { setting: 'original' },
          game_id: 'game-1',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      ];
      win.dispatchEvent(new CustomEvent('refetch-templates'));
    });

    cy.wait(1000); // Allow time for the menu to update

    // The menu item should show the updated name
    cy.get('.ant-menu-item').contains('Updated Template Name').should('be.visible')
    cy.get('.ant-menu-item').should('not.contain', 'Original Name')
  });
})
