package com.techtalks.backend.product;
import java.util.List;
public class ProductController {
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    public Product getProductById(String id) {
        return productService.getProductById(Long.valueOf(id));
    }

    public static void main(String[] args) {
        ProductService service = new ProductService();
        ProductController controller = new ProductController(service);

        List<Product> products = controller.getAllProducts();
        System.out.println("All Products:");
        for (Product p : products) {
            System.out.println(p);
        }

        String testId = "123"; // example ID
        Product product = controller.getProductById(testId);
        System.out.println("\nProduct with ID " + testId + ":");
        System.out.println(product);
    }

}
