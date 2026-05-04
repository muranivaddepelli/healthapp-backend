const PharmacyOrder = require("../../models/pharmacyOrder");
const LabOrder = require("../../models/LabOrder");

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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


const buildLabTimeline = (order) => {
  return [
    {
      label: "Order Confirmed",
      time: order.createdAt,
      completed: true
    },
    {
      label: "Phlebotomist Assigned",
      time: order.assignedAt,
      completed: !!order.assignedAt
    },
    {
      label: "Sample Collection",
      time: order.sampleCollectedAt,
      completed: !!order.sampleCollectedAt
    },
    {
      label: "Processing Started",
      time: order.processingStartedAt,
      completed: !!order.processingStartedAt
    },
    {
      label: "Reports Generated",
      time: order.completedAt,
      completed: !!order.completedAt
    }
  ];
};

exports.getOrderDetails = async (orderId, userId) => {
  const order = await PharmacyOrder.findOne({
    _id: orderId,
    userId
  }).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  // function calculateDistance(lat1, lon1, lat2, lon2) {
  //   if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  //   const R = 6371; // km
  //   const dLat = (lat2 - lat1) * Math.PI / 180;
  //   const dLon = (lon2 - lon1) * Math.PI / 180;

  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * Math.PI / 180) *
  //     Math.cos(lat2 * Math.PI / 180) *
  //     Math.sin(dLon / 2) *
  //     Math.sin(dLon / 2);

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c;
  // }

  let distance = null;
  let etaMinutes = null;

  if (order.currentLocation && order.deliveryLocation) {
    distance = calculateDistance(
      order.currentLocation.lat,
      order.currentLocation.lng,
      order.deliveryLocation.lat,
      order.deliveryLocation.lng
    );

    if (distance) {
      etaMinutes = Math.round((distance / 30) * 60); // avg speed 30km/h
    }
  }

  return {
    id: order._id,
    orderId: order.orderId,
    type: "pharmacy",

    location: order.location || "Pharmacy",

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

    map: {
      pickup: order.pickupLocation,
      drop: order.deliveryLocation,
      current: order.currentLocation,
      distance: distance ? distance.toFixed(2) + " km" : null,
      eta: etaMinutes ? etaMinutes + " mins" : null
    },

    timeline: buildTimeline(order)
  };
};



exports.getLabOrderDetails = async (orderId, userId) => {
  const order = await LabOrder.findOne({
    _id: orderId,
    userId
  }).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  let distance = null;
  let etaMinutes = null;

  if (order.currentLocation && order.deliveryLocation) {
    const dist = calculateDistance(
      order.currentLocation.lat,
      order.currentLocation.lng,
      order.deliveryLocation.lat,
      order.deliveryLocation.lng
    );

    if (dist) {
      distance = dist.toFixed(2) + " km";
      etaMinutes = Math.round((dist / 30) * 60) + " mins";
    }
  }

  return {
    id: order._id,
    orderId: order.orderId || order._id,

    type: "tests",

    location: `${order.labName || "Lab"}, ${order.labAddress || ""}`,

    status: order.status,
    date: order.createdAt,

    tests: order.tests || [{ name: order.testName }],
    testCount: order.tests?.length || 1,

    subtotal: order.subtotal || order.totalAmount,
    totalAmount: order.totalAmount,

    scheduledAt: order.scheduledAt,

    phlebotomist: order.phlebotomist || {
      name: "Alex Johnson",
      vehicle: "Bike",
      trackingId: "TRK-0001"
    },

    lab: {
      name: order.labName || "Lab",
      address: order.labAddress || ""
    },

    map: {
      pickup: order.pickupLocation,
      drop: order.deliveryLocation,
      current: order.currentLocation,
      distance,
      eta: etaMinutes
    },

    timeline: buildLabTimeline(order)
  };
};