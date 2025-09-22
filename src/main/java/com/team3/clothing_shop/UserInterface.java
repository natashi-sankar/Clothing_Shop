package com.team3.clothing_shop;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserInterface {

    private final DatabaseController controller;

    // Spring injects DatabaseController automatically
    public UserInterface(DatabaseController controller) {
        this.controller = controller;
    }

    // 1) Search products
    @GetMapping("/search")
    public Object searchProducts(@RequestParam String query) {
        return controller.getSearchResults(query);
    }

    // 2) Create account
    @PostMapping("/account")
    public String createAccount(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String password) {
        return controller.createAccount(email, name, password);
    }

    // 3) Print cart
    @GetMapping("/cart")
    public Object getCart(@RequestParam String email,
                          @RequestParam String password) {
        return controller.printCartContents(email, password);
    }

    // 4) Handle order
    @PostMapping("/order")
    public String handleOrder(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String address) {
        controller.handleOrder(email, password, address);
        return "Order placed successfully!";
    }

    // 5) Get orders by email
    @GetMapping("/orders")
    public Object getOrders(@RequestParam String email,
                            @RequestParam String password) {
        return controller.printOrdersByEmail(email, password);
    }

    // 6) Edit cart quantity
    @PutMapping("/cart")
    public String editCart(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String itemId,
            @RequestParam int quantity) {
        controller.editCartQuantity(email, password, itemId, quantity);
        return "Cart updated";
    }

    // 7) Empty cart
    @DeleteMapping("/cart")
    public String emptyCart(@RequestParam String email,
                            @RequestParam String password) {
        controller.emptyCart(email, password);
        return "Cart emptied";
    }
}
