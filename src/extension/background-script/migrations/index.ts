import type { Allowance } from "~/types";

import db from "../db";
import state from "../state";

const shouldMigrate = (name: string): boolean => {
  const { migrations } = state.getState();

  // if migrations is blank
  if (!migrations) {
    return true;
  }
  return !migrations.includes(name);
};

const setMigrated = (name: string): Promise<void> => {
  let { migrations } = state.getState();
  if (!migrations) {
    migrations = [];
  }
  migrations.push(name);
  state.setState({
    migrations: migrations,
  });
  return state.getState().saveToStorage();
};

const migrations = {
  migrateisUsingLegacyLnurlAuthKeySetting: async () => {
    const { settings } = state.getState();
    const allowances = await db.allowances
      .filter((allowance: Allowance) => {
        return !!allowance.lnurlAuth;
      })
      .toArray();

    // if there is an allowance that uses lnurlAuth we enable the legacy signing
    if (allowances.length > 0) {
      const newSettings = {
        ...settings,
        isUsingLegacyLnurlAuthKey: true,
      };
      state.setState({
        settings: newSettings,
      });
      // state is saved with the setMigrated call
    }
  },
};

const migrate = async () => {
  // Object.keys(migrations).forEach((name: string) => {
  if (shouldMigrate("migrateisUsingLegacyLnurlAuthKeySetting")) {
    console.info(
      "Running migration for: migrateisUsingLegacyLnurlAuthKeySetting"
    );
    await migrations["migrateisUsingLegacyLnurlAuthKeySetting"]();
    await setMigrated("migrateisUsingLegacyLnurlAuthKeySetting");
  }
};

export default migrate;
