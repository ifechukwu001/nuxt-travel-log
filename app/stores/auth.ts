export const useAuthStore = defineStore("useAuthStore", () => {
  const authClient = useAuth();
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
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
    navigateTo("/");
  }

  return {
    init,
    loading,
    signIn,
    signOut,
    user,
  };
});
