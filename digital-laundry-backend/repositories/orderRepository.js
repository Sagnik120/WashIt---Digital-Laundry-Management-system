const LaundryOrder = require('../models/LaundryOrder');
const OrderItem = require('../models/OrderItem');
const LaundryItem = require('../models/LaundryItem');

class OrderRepository {
  async createOrder(orderData) {
    return await LaundryOrder.create(orderData);
  }

  async createOrderItems(orderId, items) {
    return await OrderItem.createMultiple(orderId, items);
  }

  async findOrderById(id) {
    return await LaundryOrder.findById(id);
  }

  async findOrderByOrderId(orderId) {
    return await LaundryOrder.findByOrderId(orderId);
  }

  async getStudentOrders(studentId) {
    return await LaundryOrder.getOrdersByStudent(studentId);
  }

  async getOrdersByHostel(hostelName) {
    return await LaundryOrder.getOrdersByHostel(hostelName);
  }

  async updateOrderStatus(orderId, status, completedBy) {
    return await LaundryOrder.updateStatus(orderId, status, completedBy);
  }

  async getOrderDetails(orderId) {
    return await LaundryOrder.getOrderDetails(orderId);
  }

  async getOrderItems(orderId) {
    return await OrderItem.getItemsByOrder(orderId);
  }

  async getAllLaundryItems() {
    return await LaundryItem.getAll();
  }

  async findLaundryItemByName(itemName) {
    return await LaundryItem.findByName(itemName);
  }

  async findLaundryItemById(id) {
    return await LaundryItem.findById(id);
  }
}

module.exports = new OrderRepository();