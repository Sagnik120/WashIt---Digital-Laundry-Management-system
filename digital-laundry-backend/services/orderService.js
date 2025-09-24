const orderRepository = require('../repositories/orderRepository');
const { generateOrderId } = require('../utils/helpers');

class OrderService {
  async getLaundryItems() {
    return await orderRepository.getAllLaundryItems();
  }

  async createOrder(studentId, orderData) {
    const { items, submission_date } = orderData;

    if (!items || items.length === 0) {
      throw new Error('At least one item is required');
    }

    // Validate items and get their IDs
    const validatedItems = [];
    for (const item of items) {
      const laundryItem = await orderRepository.findLaundryItemByName(item.item_name);
      if (!laundryItem) {
        throw new Error(`Invalid item: ${item.item_name}`);
      }
      validatedItems.push({
        item_id: laundryItem.id,
        quantity: item.quantity
      });
    }

    // Generate unique order ID
    const order_id = generateOrderId();

    // Create order
    const order = await orderRepository.createOrder({
      order_id,
      student_id: studentId,
      submission_date
    });

    // Create order items
    await orderRepository.createOrderItems(order.id, validatedItems);

    return {
      order_id: order.order_id,
      message: 'Order created successfully'
    };
  }

  async getOrderHistory(studentId) {
    return await orderRepository.getStudentOrders(studentId);
  }

  async getOrderDetails(orderId) {
    const orderDetails = await orderRepository.getOrderDetails(orderId);
    if (!orderDetails || orderDetails.length === 0) {
      throw new Error('Order not found');
    }

    // Group items by order
    const orderInfo = {
      order_id: orderDetails[0].order_id,
      student_name: orderDetails[0].full_name,
      laundry_id: orderDetails[0].laundry_id,
      hostel_name: orderDetails[0].hostel_name,
      room_number: orderDetails[0].room_number,
      status: orderDetails[0].status,
      submission_date: orderDetails[0].submission_date,
      completed_at: orderDetails[0].completed_at,
      items: orderDetails.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity
      }))
    };

    return orderInfo;
  }

  async scanOrder(orderId) {
    const order = await orderRepository.findOrderByOrderId(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    return await this.getOrderDetails(orderId);
  }

  async getOrdersByHostel(hostelName) {
    return await orderRepository.getOrdersByHostel(hostelName);
  }

  async updateOrderStatus(orderId, status, completedBy) {
    const order = await orderRepository.findOrderByOrderId(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'completed') {
      throw new Error('Order is already completed');
    }

    return await orderRepository.updateOrderStatus(orderId, status, completedBy);
  }

  async getOrderItems(orderId) {
    return await orderRepository.getOrderItems(orderId);
  }
}

module.exports = new OrderService();