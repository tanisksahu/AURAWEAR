import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  public type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    description : Text;
    sizes : [Text];
    colors : [Text];
    tags : [Text];
    imageUrl : Text;
    stock : Nat;
    isTrending : Bool;
  };

  public type BodyMeasurements = {
    height : Nat;
    weight : Nat;
    chest : Nat;
    waist : Nat;
    hips : Nat;
  };

  public type StyleProfile = {
    userId : Principal;
    bodyMeasurements : BodyMeasurements;
    stylePreferences : [Text];
    savedOutfits : [Outfit];
    trendAlerts : [Text];
  };

  public type WardrobeItem = {
    productId : ?Nat;
    customName : ?Text;
    category : Text;
    color : Text;
  };

  public type TrendItem = {
    productId : Nat;
    trendScore : Nat;
    trendTags : [Text];
    dateAdded : Int;
  };

  public type Outfit = {
    items : [Nat];
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module TrendItem {
    public func compare(t1 : TrendItem, t2 : TrendItem) : Order.Order {
      Nat.compare(t2.trendScore, t1.trendScore);
    };
  };

  let products = Map.empty<Nat, Product>();
  let styleProfiles = Map.empty<Principal, StyleProfile>();
  let wardrobes = Map.empty<Principal, [WardrobeItem]>();
  let trendingItems = Map.empty<Nat, TrendItem>();

  var nextProductId = 1;

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductById(id : Nat) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(item) { item.category == category }
    );
  };

  public query ({ caller }) func searchProducts(queryString : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.name.contains(#text queryString) or
        product.category.contains(#text queryString) or
        product.tags.find(func(tag) { tag.contains(#text queryString) }).isSome();
      }
    );
  };

  public shared ({ caller }) func createOrUpdateStyleProfile(profile : StyleProfile) : async () {
    styleProfiles.add(profile.userId, profile);
  };

  public query ({ caller }) func getStyleProfile(userId : Principal) : async StyleProfile {
    switch (styleProfiles.get(userId)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Style profile not found") };
    };
  };

  public shared ({ caller }) func saveOutfit(userId : Principal, outfit : Outfit) : async () {
    switch (styleProfiles.get(userId)) {
      case (?profile) {
        let updatedOutfits = profile.savedOutfits.concat([outfit]);
        let updatedProfile = {
          userId = profile.userId;
          bodyMeasurements = profile.bodyMeasurements;
          stylePreferences = profile.stylePreferences;
          savedOutfits = updatedOutfits;
          trendAlerts = profile.trendAlerts;
        };
        styleProfiles.add(userId, updatedProfile);
      };
      case (null) { Runtime.trap("Style profile not found") };
    };
  };

  public shared ({ caller }) func removeSavedOutfit(userId : Principal, index : Nat) : async () {
    switch (styleProfiles.get(userId)) {
      case (?profile) {
        if (index >= profile.savedOutfits.size()) { Runtime.trap("Invalid index") };
        let updatedOutfits = profile.savedOutfits.sliceToArray(0, index).concat(profile.savedOutfits.sliceToArray(index + 1, profile.savedOutfits.size()));
        let updatedProfile = {
          userId = profile.userId;
          bodyMeasurements = profile.bodyMeasurements;
          stylePreferences = profile.stylePreferences;
          savedOutfits = updatedOutfits;
          trendAlerts = profile.trendAlerts;
        };
        styleProfiles.add(userId, updatedProfile);
      };
      case (null) { Runtime.trap("Style profile not found") };
    };
  };

  public shared ({ caller }) func addWardrobeItem(userId : Principal, item : WardrobeItem) : async () {
    let userWardrobe = switch (wardrobes.get(userId)) {
      case (?items) { items };
      case (null) { [] };
    };
    let updatedWardrobe = userWardrobe.concat([item]);
    wardrobes.add(userId, updatedWardrobe);
  };

  public shared ({ caller }) func removeWardrobeItem(userId : Principal, index : Nat) : async () {
    let userWardrobe = switch (wardrobes.get(userId)) {
      case (?items) { items };
      case (null) { Runtime.trap("Wardrobe not found") };
    };
    if (index >= userWardrobe.size()) { Runtime.trap("Invalid index") };
    let updatedWardrobe = userWardrobe.sliceToArray(0, index).concat(userWardrobe.sliceToArray(index + 1, userWardrobe.size()));
    wardrobes.add(userId, updatedWardrobe);
  };

  public query ({ caller }) func getWardrobe(userId : Principal) : async [WardrobeItem] {
    switch (wardrobes.get(userId)) {
      case (?items) { items };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getWardrobeSuggestions(userId : Principal) : async [Product] {
    let userWardrobe = switch (wardrobes.get(userId)) {
      case (?items) { items };
      case (null) { [] };
    };

    let categories = ["Tops", "Bottoms", "Outerwear", "Accessories", "Footwear"];
    let missingCategories = categories.filter(
      func(cat) {
        not userWardrobe.find(
          func(item) { item.category == cat }
        ).isSome();
      }
    );

    products.values().toArray().filter(
      func(product) {
        missingCategories.find(
          func(cat) { product.category == cat }
        ).isSome();
      }
    );
  };

  public query ({ caller }) func getTrendingItems() : async [TrendItem] {
    trendingItems.values().toArray().sort();
  };

  public query ({ caller }) func getPersonalizedTrends(userId : Principal) : async [TrendItem] {
    switch (styleProfiles.get(userId)) {
      case (?profile) {
        trendingItems.values().toArray().sort().filter(
          func(item) {
            item.trendTags.find(
              func(tag) {
                profile.stylePreferences.find(
                  func(pref) { tag.contains(#text pref) }
                ).isSome();
              }
            ).isSome();
          }
        );
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    products.add(product.id, product);
  };

  public shared ({ caller }) func addTrendItem(trend : TrendItem) : async () {
    trendingItems.add(trend.productId, trend);
  };

  public shared ({ caller }) func seedProducts() : async () {
    let initialProducts : [Product] = [
      {
        id = 1;
        name = "Urban Denim Jacket";
        category = "Outerwear";
        price = 3500;
        description = "Classic denim jacket with a modern fit.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Blue", "Black"];
        tags = ["streetwear", "casual", "minimal"];
        imageUrl = "https://aura-wear.com/images/denim-jacket.jpg";
        stock = 50;
        isTrending = true;
      },
      {
        id = 2;
        name = "Sleek Formal Blazer";
        category = "Outerwear";
        price = 6000;
        description = "Tailored blazer for formal occasions.";
        sizes = ["M", "L", "XL"];
        colors = ["Navy", "Grey"];
        tags = ["formal", "luxury"];
        imageUrl = "https://aura-wear.com/images/formal-blazer.jpg";
        stock = 30;
        isTrending = true;
      },
      {
        id = 3;
        name = "Minimalist White Tee";
        category = "Tops";
        price = 800;
        description = "Premium cotton t-shirt with a clean design.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["White", "Black", "Grey"];
        tags = ["minimal", "casual"];
        imageUrl = "https://aura-wear.com/images/white-tee.jpg";
        stock = 100;
        isTrending = false;
      },
      {
        id = 4;
        name = "Classic Chinos";
        category = "Bottoms";
        price = 2500;
        description = "Versatile chinos for any occasion.";
        sizes = ["30", "32", "34", "36"];
        colors = ["Khaki", "Navy"];
        tags = ["casual", "minimal"];
        imageUrl = "https://aura-wear.com/images/chinos.jpg";
        stock = 40;
        isTrending = false;
      },
      {
        id = 5;
        name = "Streetwear Hoodie";
        category = "Tops";
        price = 2200;
        description = "Comfortable hoodie with bold graphics.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Black", "Red"];
        tags = ["streetwear", "casual"];
        imageUrl = "https://aura-wear.com/images/hoodie.jpg";
        stock = 60;
        isTrending = true;
      },
      {
        id = 6;
        name = "Luxury Silk Scarf";
        category = "Accessories";
        price = 4000;
        description = "Elegant silk scarf with intricate patterns.";
        sizes = ["One Size"];
        colors = ["Blue", "Gold"];
        tags = ["luxury", "formal"];
        imageUrl = "https://aura-wear.com/images/silk-scarf.jpg";
        stock = 20;
        isTrending = true;
      },
      {
        id = 7;
        name = "Athleisure Joggers";
        category = "Bottoms";
        price = 1800;
        description = "Comfortable and stylish jogger pants.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Grey", "Black"];
        tags = ["casual", "streetwear"];
        imageUrl = "https://aura-wear.com/images/joggers.jpg";
        stock = 50;
        isTrending = false;
      },
      {
        id = 8;
        name = "Eco Leather Boots";
        category = "Footwear";
        price = 5500;
        description = "High-quality boots made from eco-leather.";
        sizes = ["8", "9", "10", "11"];
        colors = ["Black", "Brown"];
        tags = ["luxury", "minimal"];
        imageUrl = "https://aura-wear.com/images/leather-boots.jpg";
        stock = 35;
        isTrending = true;
      },
      {
        id = 9;
        name = "Casual Polo Shirt";
        category = "Tops";
        price = 1500;
        description = "Stylish polo shirt for everyday wear.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Blue", "White", "Green"];
        tags = ["casual", "minimal"];
        imageUrl = "https://aura-wear.com/images/polo-shirt.jpg";
        stock = 70;
        isTrending = false;
      },
      {
        id = 10;
        name = "Slim-Fit Jeans";
        category = "Bottoms";
        price = 3000;
        description = "Modern slim-fit jeans for a sleek look.";
        sizes = ["30", "32", "34", "36"];
        colors = ["Blue", "Black"];
        tags = ["casual", "streetwear"];
        imageUrl = "https://aura-wear.com/images/slim-jeans.jpg";
        stock = 45;
        isTrending = false;
      },
      {
        id = 11;
        name = "Urban Backpack";
        category = "Accessories";
        price = 2500;
        description = "Stylish and functional everyday backpack.";
        sizes = ["One Size"];
        colors = ["Grey", "Black"];
        tags = ["streetwear", "casual"];
        imageUrl = "https://aura-wear.com/images/backpack.jpg";
        stock = 30;
        isTrending = true;
      },
      {
        id = 12;
        name = "Formal Dress Pants";
        category = "Bottoms";
        price = 3200;
        description = "Elegant pants for formal events.";
        sizes = ["30", "32", "34", "36"];
        colors = ["Black", "Navy"];
        tags = ["formal", "luxury"];
        imageUrl = "https://aura-wear.com/images/dress-pants.jpg";
        stock = 25;
        isTrending = false;
      },
      {
        id = 13;
        name = "Casual Slip-On Shoes";
        category = "Footwear";
        price = 2000;
        description = "Comfortable slip-on shoes for daily use.";
        sizes = ["8", "9", "10", "11"];
        colors = ["Grey", "Blue"];
        tags = ["casual", "minimal"];
        imageUrl = "https://aura-wear.com/images/slip-on-shoes.jpg";
        stock = 55;
        isTrending = false;
      },
      {
        id = 14;
        name = "Luxury Leather Belt";
        category = "Accessories";
        price = 1800;
        description = "Premium leather belt for a sophisticated look.";
        sizes = ["30", "32", "34", "36"];
        colors = ["Black", "Brown"];
        tags = ["luxury", "formal"];
        imageUrl = "https://aura-wear.com/images/leather-belt.jpg";
        stock = 40;
        isTrending = true;
      },
      {
        id = 15;
        name = "Minimalist Cardigan";
        category = "Outerwear";
        price = 2800;
        description = "Elegant cardigan with a minimal design.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Grey", "Beige"];
        tags = ["minimal", "casual"];
        imageUrl = "https://aura-wear.com/images/cardigan.jpg";
        stock = 35;
        isTrending = false;
      },
      {
        id = 16;
        name = "Streetwear T-Shirt";
        category = "Tops";
        price = 1200;
        description = "Vibrant t-shirt with bold prints.";
        sizes = ["S", "M", "L", "XL"];
        colors = ["Black", "White"];
        tags = ["streetwear", "casual"];
        imageUrl = "https://aura-wear.com/images/street-tshirt.jpg";
        stock = 80;
        isTrending = false;
      },
      {
        id = 17;
        name = "Smart Casual Blazer";
        category = "Outerwear";
        price = 5000;
        description = "Versatile blazer suitable for various occasions.";
        sizes = ["M", "L", "XL"];
        colors = ["Blue", "Grey"];
        tags = ["casual", "formal"];
        imageUrl = "https://aura-wear.com/images/casual-blazer.jpg";
        stock = 28;
        isTrending = true;
      },
      {
        id = 18;
        name = "Classic Sneakers";
        category = "Footwear";
        price = 3500;
        description = "Timeless sneakers with a retro design.";
        sizes = ["8", "9", "10", "11"];
        colors = ["White", "Black"];
        tags = ["casual", "streetwear"];
        imageUrl = "https://aura-wear.com/images/sneakers.jpg";
        stock = 65;
        isTrending = true;
      },
      {
        id = 19;
        name = "Luxury Silk Tie";
        category = "Accessories";
        price = 2200;
        description = "Handcrafted silk tie with premium materials.";
        sizes = ["One Size"];
        colors = ["Blue", "Red"];
        tags = ["luxury", "formal"];
        imageUrl = "https://aura-wear.com/images/silk-tie.jpg";
        stock = 18;
        isTrending = false;
      },
      {
        id = 20;
        name = "Minimalist Dress Shirt";
        category = "Tops";
        price = 3000;
        description = "Premium cotton shirt with a clean design.";
        sizes = ["M", "L", "XL"];
        colors = ["White", "Blue"];
        tags = ["minimal", "formal"];
        imageUrl = "https://aura-wear.com/images/dress-shirt.jpg";
        stock = 32;
        isTrending = false;
      }
    ];

    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };
  };

  public shared ({ caller }) func seedTrendItems() : async () {
    let initialTrends : [TrendItem] = [
      {
        productId = 1;
        trendScore = 95;
        trendTags = ["streetwear", "2025", "denim"];
        dateAdded = 1716076800;
      },
      {
        productId = 2;
        trendScore = 90;
        trendTags = ["formal", "luxury", "blazer"];
        dateAdded = 1715980400;
      },
      {
        productId = 5;
        trendScore = 85;
        trendTags = ["streetwear", "casual", "hoodie"];
        dateAdded = 1715884000;
      },
      {
        productId = 6;
        trendScore = 92;
        trendTags = ["luxury", "accessories", "scarf"];
        dateAdded = 1715787600;
      },
      {
        productId = 8;
        trendScore = 88;
        trendTags = ["luxury", "footwear", "boots"];
        dateAdded = 1715691200;
      },
      {
        productId = 11;
        trendScore = 83;
        trendTags = ["streetwear", "accessories", "backpack"];
        dateAdded = 1715594800;
      },
      {
        productId = 14;
        trendScore = 91;
        trendTags = ["luxury", "formal", "belt"];
        dateAdded = 1715498400;
      },
      {
        productId = 17;
        trendScore = 87;
        trendTags = ["casual", "formal", "blazer"];
        dateAdded = 1715402000;
      },
      {
        productId = 18;
        trendScore = 89;
        trendTags = ["streetwear", "casual", "sneakers"];
        dateAdded = 1715305600;
      }
    ];

    for (trend in initialTrends.values()) {
      trendingItems.add(trend.productId, trend);
    };
  };
};
