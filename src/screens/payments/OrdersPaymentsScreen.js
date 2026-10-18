import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Receipt,
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react-native';

import { COLORS } from '../../constants/theme';
import { paymentService } from '../../api/paymentService';

export function OrdersPaymentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('entitlements'); // 'entitlements' | 'orders'
  const [entitlements, setEntitlements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [entRes, ordRes] = await Promise.all([
        paymentService.getMyEntitlements(),
        paymentService.getMyOrders(),
      ]);
      setEntitlements(Array.isArray(entRes) ? entRes : []);
      setOrders(Array.isArray(ordRes) ? ordRes : []);
    } catch (err) {
      console.warn('Failed to load payment data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate[950]} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[200]} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Orders & Payments</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'entitlements' && styles.tabBtnActive]}
          onPress={() => setActiveTab('entitlements')}
          activeOpacity={0.8}
        >
          <ShieldCheck
            size={16}
            color={activeTab === 'entitlements' ? COLORS.brand[400] : COLORS.slate[400]}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'entitlements' && styles.tabBtnTextActive,
            ]}
          >
            Active Passes ({entitlements.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
          activeOpacity={0.8}
        >
          <Receipt
            size={16}
            color={activeTab === 'orders' ? COLORS.brand[400] : COLORS.slate[400]}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'orders' && styles.tabBtnTextActive,
            ]}
          >
            Order Receipts ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.brand[400]} />
          <Text style={styles.loadingText}>Fetching payment records...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.brand[400]}
            />
          }
        >
          {activeTab === 'entitlements' ? (
            entitlements.length === 0 ? (
              <View style={styles.emptyCard}>
                <BookOpen size={42} color={COLORS.slate[600]} />
                <Text style={styles.emptyTitle}>No Active Subscriptions</Text>
                <Text style={styles.emptySubtitle}>
                  You have not purchased any test series passes yet. Explore free and premium mock tests from the Series tab.
                </Text>
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => navigation.navigate('SeriesTab')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.exploreBtnText}>Browse Test Series</Text>
                </TouchableOpacity>
              </View>
            ) : (
              entitlements.map((item, idx) => {
                const isActive = String(item.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                return (
                  <View key={item.id || idx} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemBadgeRow}>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: isActive
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              {
                                color: isActive
                                  ? COLORS.status.success
                                  : COLORS.status.error,
                              },
                            ]}
                          >
                            {item.status || 'ACTIVE'}
                          </Text>
                        </View>
                        <Text style={styles.productType}>
                          {item.productType || 'TEST_SERIES'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.itemTitle}>
                      {item.title || item.productTitle || item.name || 'All-India Test Series Pass'}
                    </Text>

                    <View style={styles.itemDetailsRow}>
                      <View style={styles.detailItem}>
                        <Calendar size={13} color={COLORS.slate[400]} />
                        <Text style={styles.detailText}>
                          Valid Until: {formatDate(item.expiresAt || item.expiryDate)}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <CheckCircle2 size={13} color={COLORS.brand[400]} />
                        <Text style={styles.detailText}>Full Solutions Access</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )
          ) : (
            orders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Receipt size={42} color={COLORS.slate[600]} />
                <Text style={styles.emptyTitle}>No Order History</Text>
                <Text style={styles.emptySubtitle}>
                  You do not have any transaction receipts yet.
                </Text>
              </View>
            ) : (
              orders.map((order, idx) => {
                const isPaid = String(order.status || '').toUpperCase() === 'COMPLETED';
                return (
                  <View key={order.orderId || order.id || idx} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.orderId}>
                        Order #{String(order.orderId || order.id || '').slice(-8)}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isPaid
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {
                              color: isPaid ? COLORS.status.success : '#f59e0b',
                            },
                          ]}
                        >
                          {order.status || 'SUCCESS'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.itemTitle}>
                      {order.itemTitle || order.description || 'Test Series Purchase'}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Amount Paid</Text>
                      <Text style={styles.priceValue}>
                        ₹{order.amount || order.totalAmount || 0}
                      </Text>
                    </View>

                    <View style={styles.itemDetailsRow}>
                      <View style={styles.detailItem}>
                        <Clock size={13} color={COLORS.slate[400]} />
                        <Text style={styles.detailText}>
                          Date: {formatDate(order.createdAt || order.orderDate)}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <CreditCard size={13} color={COLORS.slate[400]} />
                        <Text style={styles.detailText}>
                          {order.paymentMethod || 'Online Payment'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.slate[950],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate[800],
    backgroundColor: COLORS.slate[950],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.slate[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[900],
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  tabBtnActive: {
    backgroundColor: COLORS.slate[950],
    borderWidth: 1,
    borderColor: COLORS.slate[700],
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.slate[400],
  },
  tabBtnTextActive: {
    color: COLORS.common.white,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.slate[400],
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  itemCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productType: {
    fontSize: 11,
    color: COLORS.slate[400],
    fontWeight: '600',
  },
  orderId: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: COLORS.slate[400],
    fontWeight: '600',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.slate[800],
    marginVertical: 8,
  },
  priceLabel: {
    fontSize: 13,
    color: COLORS.slate[400],
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.status.success,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.slate[400],
  },
  emptyCard: {
    backgroundColor: COLORS.slate[900],
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate[800],
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.common.white,
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.slate[400],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: COLORS.brand[600],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.white,
  },
});

export default OrdersPaymentsScreen;
