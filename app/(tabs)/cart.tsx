


import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchCart, updateCart, removeFromCart, clearCart } from '../../lib/handleCart';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemoveItem: (productId: string) => Promise<void>;
}

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useGlobalContext();

  const loadCart = async () => {
    try {
      const userId = user?.$id.toString();
      const cart = await fetchCart(userId || '');
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load cart. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCart();
  }, [user]);

  // Refresh cart on screen focus
  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [user])
  );

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity === 0) {
        await handleRemoveItem(productId);
        return;
      }

      const userId = user?.$id.toString();
      const updatedItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      await updateCart(userId || '', updatedItems);
      await loadCart(); // Refresh cart data
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Quantity updated successfully!',
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity. Please try again.',
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const userId = user?.$id.toString();
      await removeFromCart(userId || '', productId);
      await loadCart(); // Refresh cart data
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Item removed from cart!',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item. Please try again.',
      });
    }
  };

  const handleClearCart = async () => {
    try {
      const userId = user?.$id.toString();
      await clearCart(userId || '');
      await loadCart(); // Refresh cart data
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Cart cleared successfully!',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to clear cart. Please try again.',
      });
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderHeader = () => (
    <View className="p-4 border-b border-gray-200 shadow-sm">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Shopping Cart</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient colors={['#FFFFFF', '#F3F4F6']} className="flex-1">
        {renderHeader()}

        {cartItems.length === 0 ? (
          // Empty Cart View
          <View className="flex-1 items-center justify-center p-4">
            <Ionicons name="cart-outline" size={80} color="#CBD5E0" />
            <Text className="text-xl font-bold mt-4 text-gray-700">
              Your cart is empty
            </Text>
            <Text className="text-gray-500 text-center mt-2 mb-6">
              Looks like you haven't added anything to your cart yet
            </Text>
            <Button onPress={() => router.push('/home')} className="bg-blue-500 px-8">
              Start Shopping
            </Button>
          </View>
        ) : (
          // Cart Items View
          <>
            <ScrollView className="flex-1">
              {cartItems.map(item => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </ScrollView>

            {/* Bottom Sheet */}
            <View className="border-t border-gray-200 p-4 bg-white">
              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="font-bold">₹{totalAmount}</Text>
              </View>
              <Button
                onPress={() => console.log('Proceed to checkout')}
                className="bg-blue-500"
              >
                Proceed to Checkout
              </Button>
              <TouchableOpacity onPress={handleClearCart} className="mt-2">
                <Text className="text-red-500 text-center">Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Toast />
      </LinearGradient>
    </SafeAreaView>
  );
};

const CartItemCard: React.FC<CartItemCardProps> = React.memo(
  ({ item, onUpdateQuantity, onRemoveItem }) => (
    <TouchableOpacity onPress={() => handleProductPress(item.productId)}>
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row">
          <Image source={{ uri: item.imageUrl }} className="w-24 h-24 rounded-lg" />
          <View className="flex-1 ml-4">
            <Text className="font-medium text-lg">{item.name}</Text>
            <Text className="text-gray-600 mt-1">₹{item.price}</Text>

            {/* Quantity Controls */}
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="black" />
              </TouchableOpacity>
              <Text className="mx-4">{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => onRemoveItem(item.productId)}
              className="mt-2"
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
);

function handleProductPress(productId: string): void {
  router.push(`/product/${productId}`);
}

export default CartScreen;