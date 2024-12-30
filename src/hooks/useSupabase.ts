import { supabase } from "@/lib/supabase";

export const useSupabase = () => {
  const getSupaSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { access_token, refresh_token }: any = session;
    await setSupaSession(access_token, refresh_token);
    return session;
  };

  const refreshSupaSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.refreshSession();
    console.log("refresh session", session);
    return session;
  };

  const setSupaSession = async (
    access_token: string,
    refresh_token: string
  ) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    console.log("set session", session);
    return true;
  };

  return {
    setSupaSession,
    getSupaSession,
    refreshSupaSession,
  };
};
