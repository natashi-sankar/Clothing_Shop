package emu.cosc481;

import java.io.Console;
import java.util.Scanner;

public class UserInterface {
    private Console console;
    private DatabaseController controller;

    private boolean runCommand(String c) {
        switch (c) {

            case "1":
                // search products
                System.out.print("Enter search query: ");
                String query = console.readLine();
                controller.getSearchResults(query);
                return false;

            case "2":
                // create account
                System.out.print("Enter email: ");
                String email = console.readLine();

                System.out.print("Enter name: ");
                String name = console.readLine();

                System.out.print("Enter password: ");
                String password = new String(console.readPassword());

                System.out.println(
                        controller.createAccount(email, name, password));

                return false;

            case "3":
                // print cart
                System.out.print("Enter email: ");
                email = console.readLine();

                System.out.print("Enter password: ");
                password = new String(console.readPassword());

                controller.printCartContents(email, password);

                return false;
            case "4":
                // handle order
                System.out.print("Enter email: ");
                email = console.readLine();

                System.out.print("Enter password: ");
                password = new String(console.readPassword());

                System.out.print("Enter address: ");
                String address = console.readLine();

                controller.handleOrder(email, password, address);

                System.out.println("done");

                return false;
            case "5":
                // print orders by email
                System.out.print("Enter email: ");
                email = console.readLine();

                System.out.print("Enter password: ");
                password = new String(console.readPassword());

                controller.printOrdersByEmail(email, password);

                return false;

            case "6":
                // edit cart quantity
                System.out.print("Enter email: ");
                email = console.readLine();

                System.out.print("Enter password: ");
                password = new String(console.readPassword());

                System.out.print("Enter item id: ");
                String itemId = console.readLine();

                System.out.print("Enter quantity: ");
                int quantity = Integer.parseInt(console.readLine());

                controller.editCartQuantity(email, password, itemId, quantity);
                return false;

            case "7":
                // empty cart
                System.out.print("Enter email: ");
                email = console.readLine();

                System.out.print("Enter password: ");
                password = new String(console.readPassword());

                controller.emptyCart(email, password);

                return false;
            case "8":
                return true; // quit

            default:
                if (c != "0" && c != "") {
                    System.out.println(
                            "Invalid command: " + c);
                }
                // print help
                System.out.println("1) Search products");
                System.out.println("2) Create account");
                System.out.println("3) Print cart");
                System.out.println("4) Handle order");
                System.out.println("5) Print orders by email");
                System.out.println("6) Edit cart quantity");
                System.out.println("7) Empty cart");
                System.out.println("8) Exit");
                
                

                return false;
        }
    }

    public void initialize(DatabaseController controller) {
        this.controller = controller;
        try {
            console = System.console();
            System.out.println("Please input a command [ 0 for HELP ]");

            // keep running commands until a quit is issued
            while (!runCommand(console.readLine()))
                ;
        } finally {
            /*
             * if (kbd != null) {
             * kbd.close();
             * }
             */
        }
    }

}
