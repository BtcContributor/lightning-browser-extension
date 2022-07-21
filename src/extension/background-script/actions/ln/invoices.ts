import utils from "~/common/lib/utils";
import state from "~/extension/background-script/state";
import type { Invoice, MessageInvoices } from "~/types";

const invoices = async (message: MessageInvoices) => {
  const isSettled = message.args.isSettled;

  const connector = await state.getState().getConnector();
  const data = await connector.getInvoices();

  if (data instanceof Error) {
    return { error: data.message };
  } else {
    const invoices: Invoice[] = data.data.invoices
      .filter((invoice) => (isSettled ? invoice.settled : !invoice.settled))
      .map((invoice: Invoice) => {
        const boostagram = utils.getBoostagramFromInvoiceCustomRecords(
          invoice.custom_records
        );
        return { ...invoice, boostagram };
      });

    return {
      data: {
        invoices,
      },
    };
  }
};

export default invoices;
