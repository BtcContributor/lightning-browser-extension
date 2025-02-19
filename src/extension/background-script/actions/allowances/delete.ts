import db from "~/extension/background-script/db";
import type { MessageAllowanceDelete } from "~/types";

const deleteAllowance = async (message: MessageAllowanceDelete) => {
  const id = message.args.id;
  if (!id) return { error: "id is missing" };
  await db.allowances.delete(id);
  await db.saveToStorage();
  return { data: true };
};

export default deleteAllowance;
