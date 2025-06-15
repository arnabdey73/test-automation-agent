Feature: Shopping Cart Functionality
  As a customer
  I want to add items to my cart and proceed to checkout
  So that I can purchase products online

  Background:
    Given the user is logged in
    And the shopping cart is empty

  Scenario: Add item to cart
    When the user navigates to the product page
    And clicks "Add to Cart" button
    Then the item should be added to the cart
    And the cart count should display "1"

  Scenario: Remove item from cart
    Given the user has added an item to the cart
    When the user views the cart
    And clicks "Remove" on the item
    Then the item should be removed from the cart
    And the cart should be empty

  Scenario: Update item quantity
    Given the user has added an item to the cart
    When the user views the cart
    And changes the quantity to "3"
    And clicks "Update Cart"
    Then the cart should show 3 of the item
    And the subtotal should be updated correctly

  Scenario: Proceed to checkout
    Given the user has added an item to the cart
    When the user views the cart
    And clicks "Proceed to Checkout"
    Then the user should be redirected to the checkout page
    And the cart summary should be displayed

  Scenario Outline: Apply discount code
    Given the user has added items worth "<amount>" to the cart
    When the user enters discount code "<code>"
    And clicks "Apply"
    Then the discount of "<discount>" should be applied
    And the total should be updated correctly

    Examples:
      | amount | code       | discount |
      | $100   | SAVE10     | 10%      |
      | $200   | FREESHIP   | $15      |
      | $50    | INVALID    | $0       |
