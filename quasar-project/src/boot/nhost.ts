import { NhostClient } from "@nhost/vue";
import { boot } from "quasar/wrappers";

const nhost = new NhostClient({
  subdomain: "uoijcucqgcnuojadqdrr",
  region: "eu-central-1",
});

export default boot(({ app }) => {
  app.config.globalProperties.$nhost = nhost;
  app.use(nhost);
  app.provide("nhost", nhost);
});

export { nhost };
