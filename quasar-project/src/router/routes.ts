import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/SignLayout.vue"),
    children: [
      {
        path: "",
        name: "sign-up",
        component: () => import("src/pages/SignIn/SignIn.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "journals",
        name: "journals-page",
        component: () => import("src/pages/JournalsPage/JournalsPage.vue"),
      },
      {
        path: "journal/:id",
        name: "journal-page-id",
        component: () => import("src/pages/JournalPage/JournalPage.vue"),
        props: true,
      },
      {
        path: "profile",
        name: "profile-page",
        component: () => import("src/pages/ProfilePage/ProfilePage.vue"),
      },
      {
        path: "/@:nickname",
        name: "user-public-page",
        component: () =>
          import("src/pages/PublicJournalsPage/PublicJournalsPage.vue"),
        props: true,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
