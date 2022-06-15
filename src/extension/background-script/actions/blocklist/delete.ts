import db from "../../db";

const deleteBlocklist = async (message: { args: { host: string } }) => {
  const host = message.args.host;
  const blocklist = await db.blocklist
    .where("host")
    .equalsIgnoreCase(host)
    .first();

  if (blocklist?.id) {
    await db.blocklist.delete(blocklist.id);
    await db.saveToStorage();
  }
  return { data: true };
};

export default deleteBlocklist;
