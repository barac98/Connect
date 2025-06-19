import "ts-node/register";

import { ExpoConfig } from "expo/config";

module.exports = ({ config }: { config: ExpoConfig }) => {
  return {
    ...config,
  }
};
