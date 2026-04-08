const PharmacyOrder = require("../../models/pharmacyOrder");

function buildTimeline(order) {
  return [
    {
      label: "Order Confirmed",
      time: order.createdAt,
      completed: true
    },
    {
      label: "Items Packed",
      time: order.packedAt,
      completed: !!order.packedAt
    },
    {
      label: "Out for Delivery",
      time: order.shippedAt,
      completed: !!order.shippedAt
    },
    {
      label: "Delivered",
      time: order.deliveredAt,
      completed: !!order.deliveredAt
    }
  ];
}




exports.getOrderDetails = async (orderId, userId) => {
  const order = await PharmacyOrder.findOne({
    _id: orderId,
    userId
  }).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return {
    id: order._id,
    orderId: order.orderId,
    type: "pharmacy",

    location: order.hospitalName || order.address,

    status: order.status,

    date: order.createdAt,

    items: order.items || [],

    subtotal: order.subtotal,
    totalAmount: order.totalAmount,

    deliveryPartner: order.deliveryPartner || {
      name: "Alex Johnson",
      vehicle: "Bike",
      trackingId: "TRK-0001"
    },

    prescription: order.prescriptionFile || null,

    timeline: buildTimeline(order)
  };
};