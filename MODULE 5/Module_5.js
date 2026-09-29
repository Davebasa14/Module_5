// ============================================================================
// DATA STRUCTURES: Manual Hash Map with Linked List Collision Chaining
// ============================================================================

// Linked List Node for Bucket Chaining
class HashNode {
    constructor(key, value) {
        this.key = key;       // Product Code (SKU)
        this.value = value;   // Direct Pointer to Product Object Record
        this.next = null;
    }
}

// Custom Hash Map Implementation (O(1) Direct Lookup & Mutation)
class ManualHashMap {
    constructor(capacity = 32) {
        this.capacity = capacity;
        this.buckets = new Array(capacity);
        for (let i = 0; i < capacity; i++) {
            this.buckets[i] = null;
        }
        this.size = 0;
    }

    // Manual Hash Function: djb2 Hashing Algorithm
    _hash(key) {
        let str = String(key);
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % this.capacity;
    }

    // Insert or update node reference
    put(key, value) {
        let index = this._hash(key);
        let current = this.buckets[index];

        while (current !== null) {
            if (current.key === key) {
                current.value = value; // Direct reference assignment
                return;
            }
            current = current.next;
        }

        let newNode = new HashNode(key, value);
        newNode.next = this.buckets[index];
        this.buckets[index] = newNode;
        this.size++;
    }

    // Step 1: Direct Access Search O(1)
    get(key) {
        let index = this._hash(key);
        let current = this.buckets[index];
        while (current !== null) {
            if (current.key === key) {
                return current.value; // Return memory reference pointer
            }
            current = current.next;
        }
        return null;
    }

    // Manual traversal to collect all values into an array (No Array.prototype methods used)
    getAllValues() {
        let list = [];
        for (let i = 0; i < this.capacity; i++) {
            let current = this.buckets[i];
            while (current !== null) {
                list[list.length] = current.value;
                current = current.next;
            }
        }
        return list;
    }
}

// ============================================================================
// MANUAL HELPER ALGORITHMS (Avoiding prohibited built-ins)
// ============================================================================

function manualTrim(str) {
    if (!str) return "";
    let start = 0;
    let end = str.length - 1;
    while (start <= end && str.charCodeAt(start) <= 32) {
        start++;
    }
    while (end >= start && str.charCodeAt(end) <= 32) {
        end--;
    }
    let res = "";
    for (let i = start; i <= end; i++) {
        res += str[i];
    }
    return res;
}

// ============================================================================
// SYSTEM INITIALIZATION & SAMPLE DATA SEEDING
// ============================================================================

const productHashMap = new ManualHashMap();

// Pre-populate system with initial product records for testing
const initialProducts = [
    { id: "PROD-1", code: "SHOE-NIKE-42-BLK", name: "Nike Dunk Low", size: "42", color: "Black", basePrice: 2100.00, isAuthentic: "Authentic" },
    { id: "PROD-2", code: "CROCS-CLOG-40-WHT", name: "Classic Clog", size: "40", color: "White", basePrice: 2500.00, isAuthentic: "Authentic" },
    { id: "PROD-3", code: "BAG-ADIDAS-RED", name: "Sports Backpack", size: "Free Size", color: "Red", basePrice: 1500.00, isAuthentic: "Class A" }
];

for (let i = 0; i < initialProducts.length; i++) {
    productHashMap.put(initialProducts[i].code, initialProducts[i]);
}

// ============================================================================
// ALGORITHM IMPLEMENTATION: Direct Access Update Algorithm
// ============================================================================

/**
 * Step 1: Search for product in Hash Map using code.
 * Step 2: Apply mutations ONLY to attributes that were modified.
 * Step 3: Trigger UI re-render event.
 */
function updateProductInformation(targetCode, updatedFields) {
    // STEP 1: Search Hash Map using Product Code (O(1) Direct Access)
    let productRef = productHashMap.get(targetCode);

    if (productRef === null) {
        return {
            success: false,
            message: "Error: Product Code '" + targetCode + "' not found in Global Product Hash Map."
        };
    }

    let mutationLogs = [];
    
    // STEP 2: Apply mutations ONLY to modified attributes (Selective Mutation)
    if (updatedFields.name !== undefined && updatedFields.name !== productRef.name) {
        mutationLogs[mutationLogs.length] = "Name updated from '" + productRef.name + "' to '" + updatedFields.name + "'";
        productRef.name = updatedFields.name;
    }

    if (updatedFields.size !== undefined && updatedFields.size !== productRef.size) {
        mutationLogs[mutationLogs.length] = "Size updated from '" + productRef.size + "' to '" + updatedFields.size + "'";
        productRef.size = updatedFields.size;
    }

    if (updatedFields.color !== undefined && updatedFields.color !== productRef.color) {
        mutationLogs[mutationLogs.length] = "Color label updated from '" + productRef.color + "' to '" + updatedFields.color + "'";
        productRef.color = updatedFields.color;
    }

    if (updatedFields.basePrice !== undefined && !isNaN(updatedFields.basePrice) && updatedFields.basePrice !== productRef.basePrice) {
        mutationLogs[mutationLogs.length] = "Base Price updated from ₱" + productRef.basePrice.toFixed(2) + " to ₱" + updatedFields.basePrice.toFixed(2);
        productRef.basePrice = updatedFields.basePrice;
    }

    if (updatedFields.isAuthentic !== undefined && updatedFields.isAuthentic !== productRef.isAuthentic) {
        mutationLogs[mutationLogs.length] = "Authenticity flag updated from '" + productRef.isAuthentic + "' to '" + updatedFields.isAuthentic + "'";
        productRef.isAuthentic = updatedFields.isAuthentic;
    }

    // STEP 3: Return mutation result for UI re-render
    return {
        success: true,
        logs: mutationLogs,
        updatedProduct: productRef
    };
}

// ============================================================================
// UI RENDERING & EVENT HANDLERS
// ============================================================================

// Render Table of all products
function renderProductDirectory() {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";
    
    const allProducts = productHashMap.getAllValues();

    for (let i = 0; i < allProducts.length; i++) {
        let p = allProducts[i];
        let row = document.createElement("tr");

        row.innerHTML = 
            "<td>" + p.id + "</td>" +
            "<td><strong>" + p.code + "</strong></td>" +
            "<td>" + p.name + "</td>" +
            "<td>" + p.size + "</td>" +
            "<td>" + p.color + "</td>" +
            "<td>₱" + p.basePrice.toFixed(2) + "</td>" +
            "<td>" + p.isAuthentic + "</td>";

        tableBody.appendChild(row);
    }
}

// Handle Product Lookup / Search
document.getElementById("searchForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let searchCode = manualTrim(document.getElementById("searchCode").value);

    let product = productHashMap.get(searchCode);
    const outputContainer = document.getElementById("outputContainer");

    if (product === null) {
        outputContainer.innerHTML = "<p><strong>SEARCH ERROR:</strong> No product record found for code '" + searchCode + "'.</p>";
        document.getElementById("updateBtn").disabled = true;
        document.getElementById("editCode").value = "";
        return;
    }

    // Populate Edit Form with current values
    document.getElementById("editCode").value = product.code;
    document.getElementById("editName").value = product.name;
    document.getElementById("editSize").value = product.size;
    document.getElementById("editColor").value = product.color;
    document.getElementById("editPrice").value = product.basePrice;
    document.getElementById("editAuthenticity").value = product.isAuthentic;

    document.getElementById("updateBtn").disabled = false;

    outputContainer.innerHTML = "<p><strong>PRODUCT LOADED:</strong> Record for '" + product.code + "' fetched into edit form. Modify fields and submit to update.</p>";
});

// Handle Product Update Submission
document.getElementById("editForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let targetCode = document.getElementById("editCode").value;
    if (!targetCode) return;

    let updatedFields = {
        name: manualTrim(document.getElementById("editName").value),
        size: manualTrim(document.getElementById("editSize").value),
        color: manualTrim(document.getElementById("editColor").value),
        basePrice: parseFloat(document.getElementById("editPrice").value),
        isAuthentic: document.getElementById("editAuthenticity").value
    };

    // Execute Module 9 Core Algorithm
    let result = updateProductInformation(targetCode, updatedFields);
    const outputContainer = document.getElementById("outputContainer");

    if (!result.success) {
        outputContainer.innerHTML = "<p><strong>UPDATE ERROR:</strong> " + result.message + "</p>";
        return;
    }

    // Build Execution Log and Output Card
    let logHtml = "<h3>Step-by-Step Execution Logs:</h3>";
    if (result.logs.length === 0) {
        logHtml += "<p><em>No fields were modified. Product record remains unchanged.</em></p>";
    } else {
        logHtml += "<ul>";
        for (let i = 0; i < result.logs.length; i++) {
            logHtml += "<li>" + result.logs[i] + "</li>";
        }
        logHtml += "</ul>";
    }

    let p = result.updatedProduct;
    let productCardHtml = 
        "<h3>Updated Product Registration Card</h3>" +
        "<table border='1' cellpadding='5'>" +
            "<tr><th>Attribute</th><th>Value</th></tr>" +
            "<tr><td>Product ID</td><td>" + p.id + "</td></tr>" +
            "<tr><td>Product Code (SKU)</td><td><strong>" + p.code + "</strong></td></tr>" +
            "<tr><td>Product Name</td><td>" + p.name + "</td></tr>" +
            "<tr><td>Size</td><td>" + p.size + "</td></tr>" +
            "<tr><td>Color Label</td><td>" + p.color + "</td></tr>" +
            "<tr><td>Base Price</td><td>₱" + p.basePrice.toFixed(2) + "</td></tr>" +
            "<tr><td>Authenticity Flag</td><td>" + p.isAuthentic + "</td></tr>" +
        "</table>";

    outputContainer.innerHTML = logHtml + productCardHtml;

    // Step 3: Trigger UI re-render event
    renderProductDirectory();
});

// Initial Directory Render on Page Load
renderProductDirectory();