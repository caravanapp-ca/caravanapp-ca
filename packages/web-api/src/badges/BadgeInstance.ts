import { BadgeDoc, BadgeModel } from "@caravan/buddy-reading-mongo";

// Singleton pattern
export const BadgeDocInstance = (() => {
  let instance: BadgeDoc;

  async function createInstance() {
    let badgeDoc: BadgeDoc;
    try {
      badgeDoc = await BadgeModel.findOne();
    } catch (err) {
      console.error(`Error retrieving badges ${err}`);
      throw new Error(`Error retrieving badges ${err}`);
    }
    if (!badgeDoc) {
      console.error("Did not find any badges in database!");
      throw new Error("Did not find any badges in database!");
    }
    return badgeDoc;
  }

  return {
    getInstance: async () => {
      if (!instance) {
        instance = await createInstance();
      }
      return instance;
    }
  };
})();
