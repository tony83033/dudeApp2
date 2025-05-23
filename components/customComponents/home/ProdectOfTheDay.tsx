import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Button, FlatList } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import ProductCard from "../ProductCard";
import { router } from "expo-router";
import { fetchProductOfTheDay } from "@/lib/ProductOfTheDayFun";

// Define types for state
interface Product {
  productId: string;
  name: string;
  price: string;
  imageUrl: string;
}

const ProductOfTheDay = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductsOfTheDay = async () => {
    try {
      const productsOfTheDay = await fetchProductOfTheDay();

      // console.log("Products fetched:", productsOfTheDay); // ✅ Log fetched products
      if (productsOfTheDay.length === 0) {
        setError("No products available for today.");
      } else {
        setProducts(productsOfTheDay);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsOfTheDay();
  }, []);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadProductsOfTheDay();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No products available for today.</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Card className="bg-yellow-50 p-4 rounded-lg">
        <Text className="text-lg font-bold">Products of the Day</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.productId}
          horizontal={true} // Enables horizontal scrolling
          showsHorizontalScrollIndicator={true} // Shows the scrollbar
          contentContainerStyle={{ paddingVertical: 10, gap: 10 }} // Adjust spacing
          renderItem={({ item }) => (
            <ProductCard
              image={{ uri: item.imageUrl }}
              name={item.name}
              price={item.price}
              onPress={() => handleProductPress(item.productId)}
            />
          )}
        />
      </Card>
    </View>
  );
};

export default ProductOfTheDay;
