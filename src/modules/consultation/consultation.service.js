const ConsultationOrder = require("../../models/ConsultationOrder");

function buildConsultationTimeline(order) {
  const appointmentDate = new Date(order.appointmentDate);

  const getDateBefore = (days) => {
    const d = new Date(appointmentDate);
    d.setDate(d.getDate() - days);
    return d;
  };

  return [
    {
      label: "Appointment Confirmed",
      time: order.createdAt,
      subText: `Date of Appointment: ${appointmentDate.toDateString()}`,
      completed: true
    },
    {
      label: "1 week to consultation",
      time: getDateBefore(7),
      completed: new Date() >= getDateBefore(7)
    },
    {
      label: "3 days to consultation",
      time: getDateBefore(3),
      completed: new Date() >= getDateBefore(3)
    },
    {
      label: "1 day to consultation",
      time: getDateBefore(1),
      completed: new Date() >= getDateBefore(1)
    }
  ];
}

exports.getConsultationOrderDetails = async (orderId, userId) => {

  const order = await ConsultationOrder.findOne({
    _id: orderId,
    userId
  }).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return {
    id: order._id,
    orderId: order.orderId,

    type: "consultation",

    status: order.status,

    location: `${order.clinicName}, ${order.clinicAddress}`,

    doctor: {
      name: order.doctorName,
      specialization: order.specialization,
      location: `${order.clinicName}, ${order.clinicAddress}`
    },

    date: order.appointmentDate,
    timeSlot: order.timeSlot,

    consultationFee: order.consultationFee,

    invoiceUrl: order.invoiceUrl || null,

    timeline: buildConsultationTimeline(order)
  };
};