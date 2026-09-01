import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

async function relativeFetch(url: string, opts?: Record<string, unknown>) {
  try {
    if (url.startsWith("http"))
      url = new URL(url).pathname + new URL(url).search;
  }
  catch {}
  return useFetch(url, {
    ...opts,
  });
};

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<{ data: Awaited<ReturnType<typeof authClient.useSession>>["data"]; isPending: boolean } | null>(null);
  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function init() {
    const { data, isPending } = await authClient.useSession(relativeFetch);
    session.value = { data, isPending };
  }

  async function signIn() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      fetchOptions: {
        headers,
      },
    });
  }

  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
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
