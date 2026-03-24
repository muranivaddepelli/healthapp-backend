const repo = require("./emr.repository");

exports.getPrescription = async (emrId) => {

  const data = await repo.getPrescriptionById(emrId);

  if (!data) {
    throw new Error("EMR record not found");
  }

  return data;
};