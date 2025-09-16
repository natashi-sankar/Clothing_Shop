package emu.cosc481;

import com.orientechnologies.orient.core.db.ODatabase;
import com.orientechnologies.orient.core.db.ODatabaseSession;
import com.orientechnologies.orient.core.db.OrientDB;
import com.orientechnologies.orient.core.db.OrientDBConfig;
import com.orientechnologies.orient.core.metadata.schema.*;
import com.orientechnologies.orient.core.sql.executor.OResult;
import com.orientechnologies.orient.core.sql.executor.OResultSet;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import javax.naming.spi.DirStateFactory.Result;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.json.*;

public class DatabaseController {
    
    String username, password;
    OrientDB orient;
    ODatabase db;

    public DatabaseController(String dbName, String dbUsername, String dbPassword) {
        orient = new OrientDB("remote:localhost", OrientDBConfig.defaultConfig());
        db = orient.open(dbName,dbUsername,dbPassword);

        username = dbUsername;
        password = dbPassword;
    }

    public OClass createClassIfNotExists(String className){
        OClass orientClass = db.getClass(className);
        if(orientClass == null)
            orientClass = db.createClass(className);

        return orientClass;
    }

    public void createPropertyIfNotExists(OClass orientClass, String propertyName, OType propertyType, boolean isUnique){
        if(orientClass.getProperty(propertyName) == null)
            orientClass.createProperty(propertyName, propertyType);

        String indexName = orientClass.getName()+"_"+propertyName+"_index";
        if(orientClass.getClassIndex(indexName) == null){
            if(isUnique){
                //orientClass.createIndex(indexName, OClass.INDEX_TYPE.UNIQUE);
            }else{
                //orientClass.createIndex(indexName, OClass.INDEX_TYPE.NOTUNIQUE);
            }
        }
    }  

    public void createPropertyIfNotExists(OClass orientClass, String propertyName, OType propertyType){
        this.createPropertyIfNotExists(orientClass,propertyName,propertyType,false);
    }

    public OResult queryForResult(String query){
        OResultSet resultSet = db.query(query);

        if(resultSet.hasNext()){
            return resultSet.next();
        }

        return null;
    }

    public OResult getProductById(String rid){
        return queryForResult("SELECT * FROM Product WHERE @rid = '" + rid + "'");
    }

    public OResult getProductByName(String name){ // necessary for removing products from the database or registering new ones
        return queryForResult("SELECT * FROM Product WHERE name = '" + name + "'");
    }

    public OResultSet getSearchResults(String search){
        String query = "SELECT * FROM Product WHERE name LIKE '%" + search + "%'";
        OResultSet resultSet = db.query(query);

        System.out.println(resultSet);
        while (resultSet.hasNext()) {
            OResult item = resultSet.next();
            System.out.println(item.getProperty("name").toString() + " | ID: " + item.getProperty("@rid").toString());
        }

        return resultSet;
    }

    public OResultSet getAllProducts(){
        return getSearchResults("");
    }

    public String calculateTotal(HashMap<OResult, Integer> cartMap){
        double total = 0;

        for(Map.Entry<OResult, Integer> entry : cartMap.entrySet()){
            String stringToParse = entry.getKey().getProperty("price").toString().substring(1).replace(",", "");

            total = total+( Double.parseDouble(stringToParse) * entry.getValue() );
        }

        total = Math.round(total * 100.00) / 100.00;

        String totalString = "$" + total;
        return totalString;
    }

    public void handleOrder(String user_email, String password, String address){
        if(verifyLogin(user_email,password) == true){
            OResult user = getUser(user_email);
            HashMap<OResult, Integer> cartMap = getCartContents(user_email, password);

            if(cartMap.size() > 0){
                String total = calculateTotal(cartMap);
                
                try {
                    String cmdString = "INSERT INTO Order SET purchase_date = SYSDATE(), contents = '" + user.getProperty("cart_contents").toString() + "', total = '" + total + "', address = '" + address + "', email = '" + user_email + "'";
                    db.command(cmdString);

                    emptyCart(user_email, password);
                } catch(Exception e){
                    e.printStackTrace();
                }
            }
        }
    }

    private OResult getUser(String user_email){
        String query = "SELECT * FROM User WHERE email = '" + user_email.toLowerCase() + "'";
        OResultSet resultSet = db.query(query);

        if(resultSet.hasNext()){
            return resultSet.next();
        }

        return null;
    }

    public String createAccount(String user_email, String user_name, String password){
        if(getUser(user_email) == null && password.length() > 0){
            try {
                String cmdString = "INSERT INTO User SET email = '" + user_email + "', username = '" + user_name + "', password = '" + password + "', cart_contents = ''";
                db.command(cmdString);
                
                return "Successfully created new account!";
            } catch(Exception e){
                e.printStackTrace();

                return "Error running query; likely used an incompatible character";
            }
        }

        return "Can't create account using email " + user_email+ "; user already exists!";
    }

    public boolean verifyLogin(String user_email, String password){
        OResult user = getUser(user_email);

        if(user == null){
            return false;
        }
        return (user.getProperty("password").toString()).equals(password);
    }

    public String convertCartToString(HashMap<String, Integer> cartMap){
        String cartString = "";

        for(Map.Entry<String, Integer> cartEntry : cartMap.entrySet()){
            cartString = (cartString + cartEntry.getKey() + "_q" + cartEntry.getValue() + "|");
        }

        if(!cartString.isEmpty())
            cartString = cartString.substring(0, cartString.length()-1); // return "|" at the end

        return cartString;
    }

    public HashMap<String, Integer> convertCartToMap(String cartString){
        HashMap<String, Integer> cartMap = new HashMap<>();
        String[] cartArray = cartString.split("\\|");

        for(String s : cartArray){
            System.out.println(s);
            String[] itemData = s.split("_q");
            if(itemData.length > 1)
                cartMap.put(itemData[0], Integer.parseInt(itemData[1]));
        }

        return cartMap;
    }

    public OResultSet getOrdersByEmail(String user_email, String password){
        String query = "SELECT * FROM Order WHERE email = '" + user_email + "'";
        OResultSet resultSet = db.query(query);

        return resultSet;
    }

    public void printOrdersByEmail(String user_email, String password){
        String query = "SELECT * FROM Order WHERE email = '" + user_email + "'";
        OResultSet resultSet = db.query(query);

        while (resultSet.hasNext()) {
            OResult item = resultSet.next();
            HashMap<String, Integer> contents = convertCartToMap(item.getProperty("contents"));

            System.out.println("Order ID: " + item.getProperty("@rid").toString() + " | Total: " + item.getProperty("total").toString());
            for(Map.Entry<String, Integer> entry : contents.entrySet()){
                OResult product = getProductById(entry.getKey());
                System.out.println(product.getProperty("name") + " | Price: " + product.getProperty("price") + " | Quantity: " + entry.getValue());
            }

        }
    }

    public HashMap<OResult, Integer> getCartContents(String user_email, String password){
        HashMap<OResult, Integer> contentList = new HashMap<OResult, Integer>();

        if(verifyLogin(user_email,password) == true){
            OResult user = getUser(user_email);
            HashMap<String, Integer> cartMap = convertCartToMap(user.getProperty("cart_contents").toString());

            for(Map.Entry<String, Integer> entry : cartMap.entrySet()){
                OResult product = getProductById(entry.getKey());
                contentList.put(product,entry.getValue());
            }
            
        }
        return contentList;
    }

    public void printCartContents(String user_email, String password){
        HashMap<OResult, Integer> cartMap = getCartContents(user_email, password);
        for(Map.Entry<OResult, Integer> entry : cartMap.entrySet()){
            System.out.println(entry.getKey().getProperty("name").toString() + " | " + entry.getKey().getProperty("price").toString());
        }

        System.out.println("Cart total: " + calculateTotal(cartMap));
    }

    public boolean editCartQuantity(String user_email, String password, String itemId, int newQuantity){
        if(verifyLogin(user_email,password) == true && getProductById(itemId) != null){
            OResult user = getUser(user_email);

            HashMap<String, Integer> cartMap = convertCartToMap(user.getProperty("cart_contents").toString());
            cartMap.put(itemId, newQuantity);

            String cartString = convertCartToString(cartMap);

            db.command("UPDATE user SET cart_contents = '" + cartString + "' WHERE email = '" + user_email +"'");
            return true;
        }
        return false;
    }

    public void emptyCart(String user_email, String password){
        if(verifyLogin(user_email,password) == true){
            db.command("UPDATE user SET cart_contents = '' WHERE email = '" + user_email +"'");
        }
    }

    private void createSampleProducts(){
        OClass productClass = db.getClass("Product");

        System.out.println("Inserting sample records...");

        try {

            JSONObject jsonObj = new JSONObject(FileUtils.readFileToString(new File("orientdb-ecommerce/src/main/java/emu/cosc472/products.json")));
            JSONArray jsonArray = jsonObj.getJSONArray("products");
            
            int addedRecords = 0;
            int removedRecords = 0;

            ArrayList<String> productNames = new ArrayList<String>();
            for(int i = 0; i < jsonArray.length(); i++){
                JSONObject obj = jsonArray.getJSONObject(i);

                productNames.add(obj.getString("name"));
                if(getProductByName(obj.getString("name")) == null){
                    String cmdString = "INSERT INTO Product SET name = '" + obj.getString("name") + "', description = '" + obj.getString("description") + "', price = '" + obj.getString("price") + "', thumbnail = '" + obj.getString("thumbnail") + "'";
                    db.command(cmdString);

                    addedRecords++;
                }
            }

            String query = "SELECT * FROM Product";
            OResultSet resultSet = db.query(query);

            while (resultSet.hasNext()) {
                String itemName = resultSet.next().getProperty("name");

                boolean foundInList = false;
                for(String productName : productNames){
                    if(productName.equals(itemName))
                        foundInList = true;
                }

                if(!foundInList){
                    db.command("DELETE FROM Product WHERE name = '" + itemName + "'");
                    removedRecords++;
                }
            }

            System.out.println("Successfully added " + addedRecords + " new product(s).");
            System.out.println("Successfully removed " + removedRecords + " old product(s).");
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public void initialize(){

        OClass product = createClassIfNotExists("Product");
        createPropertyIfNotExists(product, "price", OType.STRING);
        createPropertyIfNotExists(product, "description", OType.STRING);
        createPropertyIfNotExists(product, "name", OType.STRING);
        createPropertyIfNotExists(product, "thumbnail", OType.STRING);

        createSampleProducts(); // Create new records using the products.json file

        OClass order = createClassIfNotExists("Order");
        createPropertyIfNotExists(order, "purchase_date", OType.DATE);
        createPropertyIfNotExists(order, "total", OType.STRING);
        createPropertyIfNotExists(order, "address", OType.STRING);
        createPropertyIfNotExists(order, "order_id", OType.LONG, true);

        OClass user = createClassIfNotExists("User");
        createPropertyIfNotExists(product, "email", OType.STRING);
        createPropertyIfNotExists(product, "username", OType.STRING);
        createPropertyIfNotExists(product, "cart_contents", OType.STRING);
        createPropertyIfNotExists(product, "password", OType.STRING);

        OClass search = createClassIfNotExists("Search");
        createPropertyIfNotExists(product, "text", OType.STRING);

        System.out.println("Search: chair");
        getSearchResults("chair");

        System.out.println("Search: c");
        getSearchResults("c");

        System.out.println("All products:");
        getAllProducts();

        System.out.println(createAccount("test_a@gmail.com", "John Doe", "a"));
        System.out.println(createAccount("test_b@gmail.com", "Jane Doe", "b"));
        System.out.println(createAccount("test_c@gmail.com", "Jayne Dough","c"));

        System.out.println(verifyLogin("test_a@gmail.com","b"));
        System.out.println(verifyLogin("test_b@gmail.com","b"));
        System.out.println(verifyLogin("test_c@gmail.com","fedshujsd"));

        System.out.println(editCartQuantity("test_b@gmail.com", "b", "#68:43", 4));
        System.out.println(editCartQuantity("test_b@gmail.com", "b", "#73:43", 2));

        System.out.println(editCartQuantity("test_c@gmail.com", "c", "#70:43", 4));

        printCartContents("test_b@gmail.com", "b");
        handleOrder("test_b@gmail.com", "b", "123 abc rd");
        printOrdersByEmail("test_b@gmail.com", "b");

        
        
    }

    public void close() {
        db.close();
        orient.close();
    }

}
