import { ref } from "vue";
import { route } from "quasar/wrappers";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { nhost } from "src/boot/nhost";
import { useNhostClient } from "@nhost/vue";
import { authClient } from "src/auth/authClient";

// import { useNhostClient } from "@nhost/vue";

import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from) => {
    const session = ref<any>(null);
    const authClient = nhost.auth;
    console.log("authClient", authClient);
    const user = authClient.getUser();
    // nhost.auth.onAuthStateChanged((_, newSession) => {
    //   session.value = newSession;
    // });
    console.log("user router:", user, session);

    // session.value = nhost;
    // nhost.auth.onAuthStateChanged((_, newSession) => {
    //   session.value = newSession;
    // });

    // const { nhost } = useNhostClient();
    // const journalToLoad = to.params.id ?? null;
    // console.log("jounal id from router params", journalToLoad);
    // const { publicStatus } = UseJournal(journalToLoad as string);
    // //  #todo fix new
    // if (journalToLoad && journalToLoad != "new") {
    //   journalId.value = journalToLoad as string;

    //   while (publicStatus.value === null || publicStatus.value === undefined) {
    //     console.log("before await in router", publicStatus.value);
    //     await sleep(100);
    //   }
    // }

    return authClient.isAuthenticatedAsync().then((response) => {
      console.log("response", response);
      if (
        !response &&
        to.name !== "sign-up" &&
        true
        // to.name !== "user-public-page" &&
        // !publicStatus.value
      ) {
        console.log("first if in router");
        return { name: "sign-up" };
      }
      if (response && to.name === "sign-up") {
        console.log(" second if in router");
        return { name: "journals-page" };
      }
    });
  });

  return Router;
});
