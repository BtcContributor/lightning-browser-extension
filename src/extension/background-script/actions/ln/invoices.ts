import state from "~/extension/background-script/state";

const getInfo = async (message) => {
  const connector = await state.getState().getConnector();
  const invoices = await connector.getInvoices();

  console.log("Ln action - invoices", invoices);

  // return {

  // };
};

export default getInfo;
