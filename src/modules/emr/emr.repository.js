exports.getPrescriptionById = async (id) => {

  return {
    emrId: id,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    doctor: "Dr. Reddy",
    hospital: "ABC Hospital",
    medicines: [
      "Azithromycin 500 mg",
      "Pantoprazole 40 mg"
    ]
  };
};