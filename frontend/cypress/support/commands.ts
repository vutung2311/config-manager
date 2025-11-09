// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mockApiResponse(
        method: string,
        url: string,
        response: unknown,
        statusCode?: number
      ): Chainable<void>;
      waitForApiCall(alias: string): Chainable<void>;
      verifyErrorMessage(message: string): Chainable<void>;
      verifySuccessMessage(message: string): Chainable<void>;
      login(): Chainable<void>;
      loginWithIntercepts(
        intercepts: Array<{
          method: string;
          url: string | RegExp;
          response: unknown;
          statusCode?: number;
          alias: string;
        }>
      ): Chainable<void>;
    }
  }
}

// Custom command to intercept API calls and mock responses
Cypress.Commands.add(
  'mockApiResponse',
  (method: string, url: string, response: unknown, statusCode = 200) => {
    cy.intercept(method as any, url, {
      statusCode,
      body: response,
    }).as('apiCall');
  }
);

// Custom command to wait for API call and verify response
Cypress.Commands.add('waitForApiCall', (alias: string) => {
  cy.wait(`@${alias}`);
});

// Custom command to verify error message is displayed
Cypress.Commands.add('verifyErrorMessage', (message: string) => {
  cy.contains(message).should('be.visible');
});

// Custom command to verify success message is displayed
Cypress.Commands.add('verifySuccessMessage', (message: string) => {
  cy.contains(message).should('be.visible');
});

// Custom command to perform login with admin credentials
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.get('input[placeholder*="email" i], input[name="email"], input[type="email"]', {
    timeout: 10000,
  })
    .first()
    .clear()
    .type('admin@sun.studio');
  cy.get('input[placeholder*="password" i], input[name="password"], input[type="password"]', {
    timeout: 5000,
  })
    .first()
    .clear()
    .type('adminpassword123');
  cy.get('button[type="submit"], button:contains("Sign in"), button:contains("Login")', {
    timeout: 5000,
  })
    .first()
    .click();

  // Verify successful login by checking we're redirected away from login page
  cy.url().should('not.include', '/login');
});

// Custom command to perform login with predefined API intercepts
Cypress.Commands.add('loginWithIntercepts', intercepts => {
  // Disable auto-login for tests to ensure we can test the login flow
  cy.window().then(win => {
    win.localStorage.setItem('auto_login', 'false');
  });

  // Set up all the API intercepts before login
  intercepts.forEach(({ method, url, response, statusCode = 200, alias }) => {
    cy.intercept(method as any, url, {
      statusCode,
      body: response,
    }).as(alias);
  });

  // Perform login
  cy.visit('/login');
  cy.get('input[placeholder*="email" i], input[name="email"], input[type="email"]', {
    timeout: 10000,
  })
    .first()
    .clear()
    .type('admin@sun.studio');
  cy.get('input[placeholder*="password" i], input[name="password"], input[type="password"]', {
    timeout: 5000,
  })
    .first()
    .clear()
    .type('adminpassword123');
  cy.get('button[type="submit"], button:contains("Sign in"), button:contains("Login")', {
    timeout: 5000,
  })
    .first()
    .click();

  // Wait for all intercepted API calls to complete
  intercepts.forEach(({ alias }) => {
    cy.wait(`@${alias}`);
  });

  // Verify successful login by checking we're redirected away from login page
  cy.url().should('not.include', '/login');
});

export {};
