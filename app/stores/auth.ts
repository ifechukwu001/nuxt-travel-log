import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<{ data: Awaited<ReturnType<typeof authClient.useSession>>["data"]; isPending: boolean } | null>(null);
  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function init() {
    const { data, isPending } = await authClient.useSession(useFetch);
    session.value = { data, isPending };
  }

  async function signIn() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });
  }

  async function signOut() {
    await authClient.signOut();
    session.value = null;
    navigateTo("/");
  }

  return {
    session,
    init,
    loading,
    signIn,
    signOut,
    user,
  };
});
