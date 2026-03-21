const axios = require("axios");

exports.search = async (search) => {

  let results = [];

  try {
    const res = await axios.get(
      `https://api.fda.gov/drug/label.json?search=${search}&limit=20`
    );

    results = res.data.results;

  } catch (err) {
    console.log("OpenFDA error");
    return [];
  }

  return processResults(results, search);
};



function processResults(results, search) {

  const keyword = search.toLowerCase();

  return results
    .map(item => ({
      name: item.openfda?.brand_name?.[0],
      genericName: item.openfda?.generic_name?.[0],
      dosage: item.dosage_and_administration?.[0],
      usage: item.indications_and_usage?.[0],
      manufacturer: item.openfda?.manufacturer_name?.[0]
    }))

    .filter(m => m.name && m.name !== "Unknown")

    .filter(m =>
      m.name.toLowerCase().includes(keyword) ||
      m.genericName?.toLowerCase().includes(keyword)
    )

    .filter((item, index, self) =>
      index === self.findIndex(t => t.name === item.name)
    )

    .slice(0, 5);
}