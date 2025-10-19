import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Coins, ShoppingBag, Sparkles } from 'lucide-react-native';
import type { ShopItem, Profile } from '@/types/database';

export default function ShopScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [itemsRes, profileRes] = await Promise.all([
      supabase.from('shop_items').select('*').order('price'),
      supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle(),
    ]);

    if (itemsRes.data) setItems(itemsRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    setLoading(false);
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!profile || profile.coins < item.price) {
      Alert.alert('Not Enough Coins', `You need ${item.price} coins to purchase this item.`);
      return;
    }

    Alert.alert('Confirm Purchase', `Buy ${item.name} for ${item.price} coins?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Buy',
        onPress: async () => {
          setPurchasing(item.id);

          const newCoins = profile.coins - item.price;

          const [updateRes, inventoryRes] = await Promise.all([
            supabase.from('profiles').update({ coins: newCoins }).eq('id', user?.id),
            supabase.from('user_inventory').insert({
              user_id: user?.id,
              item_id: item.id,
            }),
          ]);

          setPurchasing(null);

          if (updateRes.error || inventoryRes.error) {
            Alert.alert('Error', 'Failed to purchase item');
          } else {
            setProfile({ ...profile, coins: newCoins });
            Alert.alert('Success', `You purchased ${item.name}!`);
          }
        },
      },
    ]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'outfit':
        return '👕';
      case 'accessory':
        return '🎒';
      case 'special':
        return '✨';
      default:
        return '📦';
    }
  };

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.coinsContainer}>
          <Coins size={20} color="#FFD700" />
          <Text style={styles.coinsText}>{profile?.coins || 0}</Text>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'all' && styles.categoryTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'outfit' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('outfit')}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'outfit' && styles.categoryTextActive,
              ]}
            >
              👕 Outfits
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'accessory' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('accessory')}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'accessory' && styles.categoryTextActive,
              ]}
            >
              🎒 Accessories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'special' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('special')}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'special' && styles.categoryTextActive,
              ]}
            >
              ✨ Special
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemIcon}>{getCategoryIcon(item.category)}</Text>
                {item.category === 'special' && (
                  <Sparkles size={20} color="#FFD700" />
                )}
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <View style={styles.priceContainer}>
                  <Coins size={16} color="#FFD700" />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    (purchasing === item.id ||
                      (profile && profile.coins < item.price)) &&
                      styles.buyButtonDisabled,
                  ]}
                  onPress={() => handlePurchase(item)}
                  disabled={
                    purchasing === item.id || !!(profile && profile.coins < item.price)
                  }
                >
                  <ShoppingBag size={16} color="#FFFFFF" />
                  <Text style={styles.buyButtonText}>
                    {purchasing === item.id ? 'Buying...' : 'Buy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D2D44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2D2D44',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
