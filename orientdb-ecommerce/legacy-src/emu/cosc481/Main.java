package emu.cosc481;

import java.io.File;
import java.io.FileInputStream;

import com.orientechnologies.orient.core.db.*;
import com.orientechnologies.orient.core.metadata.schema.*;
import com.orientechnologies.orient.server.OServer;

public class Main {
    public static void main(String[] args) throws Exception {
        DatabaseController controller = null;
        try {
            controller = new DatabaseController("ecommerce-db","root","password");
            controller.initialize();

            UserInterface ui = new UserInterface();
            ui.initialize(controller);
    
        } finally {
            controller.close();
        }

    }
}